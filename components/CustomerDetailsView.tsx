'use client';

import React, { useState, useMemo } from 'react';
import {
    ArrowLeft, Edit3, DollarSign, CreditCard, Target,
    Percent, TrendingUp, Plane, Search, Settings,
    FileText, ChevronLeft, ChevronRight, Calendar,
    Copy, Users, FolderOpen, ChevronUp, Plus, Mail,
    Briefcase, Shield, Trash2, ExternalLink, Eye
} from 'lucide-react';
import { Customer, Sale, CustomerDocument, CustomerPassenger } from '@/types';
import { customerService } from '@/services/supabaseService';
import { supabase } from '@/lib/supabase';

interface CustomerDetailsViewProps {
    customer: Customer;
    sales: Sale[];
    onBack: () => void;
    onEditCustomer: (customer: Customer) => void;
    onViewSale: (sale: Sale) => void;
    currentUser: any;
}

export function CustomerDetailsView({
    customer,
    sales,
    onBack,
    onEditCustomer,
    onViewSale,
    currentUser
}: CustomerDetailsViewProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // --- LÓGICA DE INTEGRAÇÃO DO CRUD (READ) ---
    const customerSales = useMemo(() =>
        sales.filter(s => s.customerId === customer.id),
        [sales, customer.id]
    );

    const stats = useMemo(() => {
        const total = customerSales.reduce((acc, s) => acc + (s.totalValue || 0), 0);
        const custo = customerSales.reduce((acc, s) => acc + (s.totalCost || 0), 0);
        const lucro = total - custo;
        return {
            faturamento: total,
            lucro: lucro,
            emissoes: customerSales.length,
            margem: total > 0 ? (lucro / total) * 100 : 0,
            ticketMedio: customerSales.length > 0 ? total / customerSales.length : 0
        };
    }, [customerSales]);

    // --- LÓGICA DE VOOS PRÓXIMOS ---
    const upcomingFlights = useMemo(() => {
        const now = new Date();
        const flights: any[] = [];
        
        customerSales.forEach(sale => {
            sale.items?.forEach(item => {
                if (item.type === 'passagem' && item.departureDate) {
                    const depDate = new Date(item.departureDate + 'T00:00:00');
                    if (depDate >= now) {
                        flights.push({
                            ...item,
                            saleId: sale.id,
                            orderNumber: sale.orderNumber,
                            sale: sale
                        });
                    }
                }
            });
        });

        return flights.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
    }, [customerSales]);

    // --- ESTADOS LOCAIS PARA DOCUMENTOS E PASSAGEIROS ---
    const [documents, setDocuments] = useState<CustomerDocument[]>(customer.documents || []);
    const [passengers, setPassengers] = useState<CustomerPassenger[]>(customer.passengers || []);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${customer.id}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('customer_documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('customer_documents')
                .getPublicUrl(filePath);

            const newDoc = await customerService.saveDocument({
                customerId: customer.id,
                name: file.name,
                url: publicUrl,
                type: file.type
            });

            setDocuments(prev => [newDoc, ...prev]);
        } catch (err) {
            console.error('Erro no upload:', err);
            alert('Falha ao enviar documento');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteDocument = async (id: string) => {
        if (!confirm('Excluir este documento?')) return;
        try {
            await customerService.deleteDocument(id);
            setDocuments(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddPassenger = async () => {
        const name = prompt('Nome Completo do Passageiro:');
        if (!name) return;
        const passport = prompt('Número do Passaporte (opcional):') || '';
        
        try {
            const newP = await customerService.savePassenger({
                customerId: customer.id,
                name,
                passportNumber: passport,
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' ')
            });
            setPassengers(prev => [newP, ...prev]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePassenger = async (id: string) => {
        if (!confirm('Remover este passageiro?')) return;
        try {
            await customerService.deletePassenger(id);
            setPassengers(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-300">

            {/* 1. CABEÇALHO (Perfil e Botão de Edição) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <div className="w-16 h-16 bg-[#8B5CF6] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-200">
                        {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h1>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Cliente ativo no sistema</p>
                        <p className="text-xs text-gray-300 dark:text-gray-500 mt-1">Cadastrado em {new Date(customer.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                {/* BOTÃO EDITAR (Update do CRUD) */}
                {(currentUser?.role === 'Administrador' || customer.emissor === `${currentUser?.name} ${currentUser?.lastName || ''}`.trim()) && (
                    <button
                        onClick={() => onEditCustomer(customer)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#8B5CF6] text-white rounded-xl font-bold hover:bg-[#7C3AED] transition-all shadow-md shadow-purple-100"
                    >
                        <Edit3 className="w-4 h-4" /> Editar Cliente
                    </button>
                )}
            </div>

            {/* 2. GRID FINANCEIRO (Cards coloridos) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatSmallCard label="Faturamento" value={formatCurrency(stats.faturamento)} sub={`${stats.emissoes} emissões`} icon={<DollarSign className="w-4 h-4 text-purple-400" />} />
                <StatSmallCard label="Em Aberto" value="R$ 0,00" sub="Tudo pago" icon={<CreditCard className="w-4 h-4 text-purple-400" />} />
                <StatSmallCard label="Lucro Total" value={formatCurrency(stats.lucro)} sub="Acumulado" icon={<Target className="w-4 h-4 text-green-400" />} />
                <StatSmallCard label="Margem" value={`${stats.margem.toFixed(1)}%`} sub="Média ponderada" icon={<Percent className="w-4 h-4 text-purple-400" />} />
                <StatSmallCard label="Ticket Médio" value={formatCurrency(stats.ticketMedio)} sub="Por emissão" icon={<TrendingUp className="w-4 h-4 text-purple-400" />} />
            </div>

            {/* 3. CONTEÚDO EM DUAS COLUNAS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLUNA DA ESQUERDA (70%): HISTÓRICO */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm overflow-hidden min-h-[400px]">
                        <div className="p-4 border-b border-gray-50 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Plane className="w-4 h-4 text-purple-500" />
                                <h2 className="font-bold text-gray-800 dark:text-gray-200">Histórico de Emissões</h2>
                                <span className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-[10px] px-2 py-0.5 rounded-full">{customerSales.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                    <input
                                        type="text" placeholder="Buscar localizador..."
                                        className="pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-slate-800/50 dark:text-gray-100 border-none rounded-lg text-xs focus:ring-2 focus:ring-purple-500/20 w-40"
                                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700/50"><Settings className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" /></button>
                                <button className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700/50"><FileText className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" /></button>
                            </div>
                        </div>

                        <div className="p-6">
                            {customerSales.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                                    <p className="text-sm italic">Nenhuma emissão registrada para este cliente</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-gray-800 dark:text-gray-200">
                                        <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 uppercase">
                                            <tr>
                                                <th className="px-4 py-2">Data</th>
                                                <th className="px-4 py-2">Pedido</th>
                                                <th className="px-4 py-2">Valor</th>
                                                <th className="px-4 py-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                                            {customerSales.map(s => (
                                                <tr key={s.id} className="dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-4 py-3">{new Date(s.saleDate || s.createdAt).toLocaleDateString('pt-BR')}</td>
                                                    <td className="px-4 py-3 font-bold">
                                                        <button 
                                                            onClick={() => onViewSale(s)}
                                                            className="hover:text-purple-600 transition-colors cursor-pointer"
                                                        >
                                                            #{s.orderNumber || s.id.slice(0, 6)}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3 font-bold">{formatCurrency(s.totalValue)}</td>
                                                    <td className="px-4 py-3"><span className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{s.saleStatus}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* COLUNA DA DIREITA (30%): DADOS E CARDS LATERAIS */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-[#1e293b] p-3 rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                        <button className="p-1 hover:bg-gray-50 dark:hover:bg-slate-800 rounded"><ChevronLeft className="w-4 h-4 text-gray-400 dark:text-gray-500" /></button>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 text-center flex-1">março 2026</span>
                        <div className="flex items-center gap-1">
                            <button className="p-1 hover:bg-gray-50 dark:hover:bg-slate-800 rounded"><ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" /></button>
                            <div className="w-px h-4 bg-gray-100 dark:bg-slate-700/50 mx-1"></div>
                            <button className="p-1 hover:bg-gray-50 dark:hover:bg-slate-800 rounded"><Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" /></button>
                        </div>
                    </div>

                    <RightSectionCard title="Dados do Cliente" icon={<Users className="w-4 h-4 text-purple-500" />} badge={null} actionIcon={<Copy className="w-3.5 h-3.5" />}>
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 dark:text-gray-500">Nome:</span>
                                <span className="font-bold text-gray-800 dark:text-gray-200">{customer.name}</span>
                            </div>
                            {customer.email && (
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 dark:text-gray-500">E-mail:</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-200">{customer.email}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 dark:text-gray-500">Telefone:</span>
                                <span className="font-bold text-gray-800 dark:text-gray-200">{customer.phone}</span>
                            </div>
                            {customer.passportNumber && (
                                <>
                                    <div className="h-px bg-gray-50 dark:bg-slate-700/50 my-2"></div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                                            <Shield className="w-3 h-3 text-purple-400" /> Passaporte:
                                        </span>
                                        <span className="font-bold text-gray-800 dark:text-gray-200">{customer.passportNumber}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs mt-1">
                                        <span className="text-gray-400 dark:text-gray-500">Validade:</span>
                                        <span className={`font-bold ${
                                            customer.passportExpiry && customer.passportExpiry.startsWith(new Date().getFullYear().toString())
                                                ? 'text-red-500 dark:text-red-400'
                                                : 'text-green-500 dark:text-green-400'
                                        }`}>
                                            {customer.passportExpiry ? customer.passportExpiry.split('-').reverse().join('/') : ''}
                                        </span>
                                    </div>
                                </>
                            )}
                            {!customer.passportNumber && !customer.email && (
                                <p className="text-center text-[10px] text-gray-300 dark:text-gray-600 py-4 italic">Sem dados adicionais</p>
                            )}
                        </div>
                    </RightSectionCard>

                    <RightSectionCard title="Voos Próximos" icon={<Plane className="w-4 h-4 text-purple-500" />} badge={upcomingFlights.length} actionIcon={<ChevronUp className="w-4 h-4 text-gray-300 dark:text-gray-600" />}>
                        {upcomingFlights.length === 0 ? (
                            <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-6">Nenhum voo agendado</p>
                        ) : (
                            <div className="space-y-3">
                                {upcomingFlights.map((flight, i) => (
                                    <div key={i} className="p-2.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                                        <div className="flex justify-between items-start mb-1">
                                            <button 
                                                onClick={() => onViewSale(flight.sale)}
                                                className="text-[10px] font-black text-purple-500 hover:text-purple-700 uppercase tracking-tight cursor-pointer"
                                            >
                                                #{flight.orderNumber}
                                            </button>
                                            <span className="text-[10px] text-gray-400">{new Date(flight.departureDate).toLocaleDateString('pt-BR')} {flight.boardingTime}</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                            {flight.origin} <ChevronRight className="w-2.5 h-2.5" /> {flight.destination}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">Localizador: <span className="font-mono font-bold text-purple-600">{flight.locator}</span></p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </RightSectionCard>

                    <RightSectionCard title="Passageiros" icon={<Users className="w-4 h-4 text-purple-500" />} badge={passengers.length} actionIcon={<Plus className="w-4 h-4 cursor-pointer hover:text-purple-600" onClick={handleAddPassenger}/>}>
                        {passengers.length === 0 ? (
                            <button onClick={handleAddPassenger} className="w-full py-6 text-xs text-gray-400 dark:text-gray-500 hover:text-purple-600 transition-colors flex flex-col items-center gap-2">
                                <Plus className="w-4 h-4 opacity-50" />
                                + Cadastrar primeiro passageiro
                            </button>
                        ) : (
                            <div className="space-y-2">
                                {passengers.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg group">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 font-bold text-[10px]">
                                                {p.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 leading-tight">{p.name}</p>
                                                <p className="text-[9px] text-gray-400 uppercase tracking-tight">{p.passportNumber || 'Sem passaporte'}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeletePassenger(p.id)} className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </RightSectionCard>

                    <RightSectionCard 
                        title="Documentos" 
                        icon={<FolderOpen className="w-4 h-4 text-purple-500" />} 
                        badge={documents.length} 
                        actionIcon={
                            <label className="cursor-pointer">
                                <Plus className="w-4 h-4 hover:text-purple-600" />
                                <input type="file" className="hidden" onChange={handleUploadDocument} disabled={isUploading} />
                            </label>
                        }
                    >
                        {documents.length === 0 ? (
                            <label className="w-full py-6 text-xs text-gray-400 dark:text-gray-500 hover:text-purple-600 transition-colors flex flex-col items-center gap-2 cursor-pointer">
                                <Plus className="w-4 h-4 opacity-50" />
                                + Enviar primeiro documento
                                <input type="file" className="hidden" onChange={handleUploadDocument} disabled={isUploading} />
                            </label>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {documents.map(doc => (
                                    <div key={doc.id} className="relative group rounded-lg overflow-hidden border border-gray-100 dark:border-slate-700/50 aspect-video bg-gray-50 flex items-center justify-center">
                                        <img src={doc.url} alt={doc.name} className="w-full h-full object-cover cursor-pointer" onClick={() => setSelectedImage(doc.url)} />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                                            <p className="text-[8px] text-white font-bold px-2 text-center truncate w-full">{doc.name}</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => setSelectedImage(doc.url)} title="Ampliar" className="p-1.5 bg-white rounded-lg text-gray-900 hover:bg-cyan-50 transition-colors">
                                                    <Eye className="w-3 h-3" />
                                                </button>
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" title="Abrir em Nova Aba" className="p-1.5 bg-white rounded-lg text-gray-900 hover:bg-purple-50 transition-colors">
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                                <button onClick={() => handleDeleteDocument(doc.id)} title="Excluir" className="p-1.5 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isUploading && (
                                    <div className="aspect-video bg-gray-50 dark:bg-slate-800 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-[10px] text-gray-400 animate-pulse">
                                        Enviando...
                                    </div>
                                )}
                            </div>
                        )}
                    </RightSectionCard>
                </div>
            </div>

            {/* 4. MODAL DE IMAGEM AMPLIADA */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" 
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full h-[85vh] flex items-center justify-center animate-in zoom-in-95 duration-200">
                        <img 
                            src={selectedImage} 
                            alt="Documento Ampliado" 
                            className="max-w-full max-h-full rounded-xl object-contain drop-shadow-2xl" 
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button 
                            onClick={() => setSelectedImage(null)} 
                            className="absolute top-0 right-0 md:-top-4 md:-right-4 w-10 h-10 bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- COMPONENTES AUXILIARES ---

function StatSmallCard({ label, value, sub, icon }: any) {
    return (
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm flex justify-between items-start">
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{sub}</p>
            </div>
            <div className="p-1.5 bg-gray-50 dark:bg-slate-800/50 rounded-lg">{icon}</div>
        </div>
    );
}

interface RightSectionCardProps {
    title: string;
    icon: React.ReactNode;
    badge: number | null;
    children: React.ReactNode;
    actionIcon?: React.ReactNode;
}

function RightSectionCard({ title, icon, badge, children, actionIcon }: RightSectionCardProps) {
    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
            <div className="p-3 border-b border-gray-50 dark:border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">{title}</h3>
                    {badge !== null && badge !== undefined && (
                        <span className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>
                    )}
                </div>
                <div className="text-gray-400 dark:text-gray-500 flex items-center">
                    {actionIcon}
                </div>
            </div>
            <div className="p-3 dark:text-gray-300">
                {children}
            </div>
        </div>
    );
}