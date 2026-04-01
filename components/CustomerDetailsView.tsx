'use client';

import React, { useState, useMemo } from 'react';
import {
    ArrowLeft, Edit3, DollarSign, CreditCard, Target,
    Percent, TrendingUp, Plane, Search, Settings,
    FileText, ChevronLeft, ChevronRight, Calendar,
    Copy, Users, FolderOpen, ChevronUp, Plus
} from 'lucide-react';
import { Customer, Sale } from '@/types';

interface CustomerDetailsViewProps {
    customer: Customer;
    sales: Sale[];
    onBack: () => void;
    onEditCustomer: (customer: Customer) => void;
    currentUser: any;
}

export function CustomerDetailsView({
    customer,
    sales,
    onBack,
    onEditCustomer,
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

                        <div className="p-12 text-center">
                            {customerSales.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                                    <p className="text-sm italic">Nenhuma emissão registrada para este cliente</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
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
                                                    <td className="px-4 py-3 font-bold">#{s.orderNumber || s.id.slice(0, 6)}</td>
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
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 dark:text-gray-500">Telefone:</span>
                                <span className="font-bold text-gray-800 dark:text-gray-200">{customer.phone}</span>
                            </div>
                            <p className="text-center text-[10px] text-gray-300 dark:text-gray-600 py-4 italic">Sem dados adicionais</p>
                        </div>
                    </RightSectionCard>

                    <RightSectionCard title="Voos Próximos" icon={<Plane className="w-4 h-4 text-purple-500" />} badge={0} actionIcon={<ChevronUp className="w-4 h-4 text-gray-300 dark:text-gray-600" />}>
                        <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-6">Nenhum voo agendado</p>
                    </RightSectionCard>

                    <RightSectionCard title="Passageiros" icon={<Users className="w-4 h-4 text-purple-500" />} badge={0} actionIcon={<Plus className="w-4 h-4" />}>
                        <button className="w-full py-6 text-xs text-gray-400 dark:text-gray-500 hover:text-purple-600 transition-colors flex flex-col items-center gap-2">
                            <Plus className="w-4 h-4 opacity-50" />
                            + Cadastrar primeiro passageiro
                        </button>
                    </RightSectionCard>

                    <RightSectionCard title="Documentos" icon={<FolderOpen className="w-4 h-4 text-purple-500" />} badge={0} actionIcon={<Plus className="w-4 h-4" />}>
                        <button className="w-full py-6 text-xs text-gray-400 dark:text-gray-500 hover:text-purple-600 transition-colors flex flex-col items-center gap-2">
                            <Plus className="w-4 h-4 opacity-50" />
                            + Enviar primeiro documento
                        </button>
                    </RightSectionCard>
                </div>
            </div>
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
                <div className="text-gray-400 dark:text-gray-500">
                    {actionIcon}
                </div>
            </div>
            <div className="p-3 dark:text-gray-300">
                {children}
            </div>
        </div>
    );
}