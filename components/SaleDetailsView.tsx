'use client';

import React from 'react';
import {
    ArrowLeft, DollarSign, Target, Percent, TrendingUp,
    Plane, FileText, Calendar, User, Briefcase, 
    ChevronRight, ExternalLink, Edit3, MapPin, 
    Clock, Shield, Info, Receipt, CreditCard
} from 'lucide-react';
import { Sale, SaleItem } from '@/types';

interface SaleDetailsViewProps {
    sale: Sale;
    onBack: () => void;
    onEditSale: (sale: Sale) => void;
    onViewCustomer?: (customerId: string) => void;
}

export function SaleDetailsView({
    sale,
    onBack,
    onEditSale,
    onViewCustomer
}: SaleDetailsViewProps) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return '-';
        }
    };

    const profit = (sale.items?.reduce((sum, i) => sum + (i.additionalCosts || 0), 0) || 0) > 0 
        ? (sale.items?.reduce((sum, i) => sum + (i.additionalCosts || 0), 0) || 0)
        : (sale.totalValue - sale.totalCost);
    
    const margin = sale.totalValue > 0 ? (profit / sale.totalValue) * 100 : 0;

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-300">
            {/* 1. CABEÇALHO */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <div className="w-16 h-16 bg-[#19727d] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-cyan-100">
                        <Receipt className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pedido #{sale.orderNumber || sale.id.slice(0, 8)}</h1>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                sale.saleStatus === 'Recebido' 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                            }`}>
                                {sale.saleStatus}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Emissão em {formatDate(sale.saleDate)}</p>
                        <p className="text-xs text-gray-300 dark:text-gray-500 mt-1">Venda processada por <span className="font-bold text-gray-400">{sale.emissor || 'N/A'}</span></p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onEditSale(sale)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#8B5CF6] text-white rounded-xl font-bold hover:bg-[#7C3AED] transition-all shadow-md shadow-purple-100"
                    >
                        <Edit3 className="w-4 h-4" /> Editar Venda
                    </button>
                </div>
            </div>

            {/* 2. GRID FINANCEIRO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatSmallCard label="Valor Total" value={formatCurrency(sale.totalValue)} sub={sale.paymentMethod || 'Forma não especificada'} icon={<DollarSign className="w-4 h-4 text-purple-400" />} />
                <StatSmallCard label="Custo" value={formatCurrency(sale.totalCost)} sub={`Status: ${sale.costStatus}`} icon={<CreditCard className="w-4 h-4 text-red-400" />} />
                <StatSmallCard label="Lucro" value={formatCurrency(profit)} sub="Bruto" icon={<Target className="w-4 h-4 text-green-400" />} />
                <StatSmallCard label="Margem" value={`${margin.toFixed(1)}%`} sub="Sobre o total" icon={<Percent className="w-4 h-4 text-purple-400" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* COLUNA ESQUERDA: ITENS DA VENDA */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-50 dark:border-slate-700/50 flex items-center gap-2">
                            <Plane className="w-4 h-4 text-[#19727d]" />
                            <h2 className="font-bold text-gray-800 dark:text-gray-200">Itens e Serviços</h2>
                            <span className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-[10px] px-2 py-0.5 rounded-full">{sale.items?.length || 0}</span>
                        </div>
                        <div className="p-6 space-y-4">
                            {(!sale.items || sale.items.length === 0) ? (
                                <p className="text-center py-10 text-gray-400 italic">Nenhum item registrado nesta venda</p>
                            ) : (
                                sale.items.map((item, idx) => (
                                    <ItemDetailCard key={item.id || idx} item={item} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* NOTAS */}
                    {sale.notes && (
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm p-6">
                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4 text-gray-400" /> Observações
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{sale.notes}</p>
                        </div>
                    )}
                </div>

                {/* COLUNA DIREITA: DADOS DO CLIENTE E INFO EXTRA */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <User className="w-4 h-4 text-[#19727d]" /> Cliente
                            </h3>
                            {onViewCustomer && (
                                <button 
                                    onClick={() => onViewCustomer(sale.customerId)}
                                    className="text-[10px] font-bold text-[#19727d] hover:underline"
                                >
                                    Ver Perfil
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Nome</p>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{sale.customerName}</p>
                            </div>
                            {sale.groupName && (
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Grupo</p>
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{sale.groupName}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#19727d]" /> Metadados Financeiros
                        </h3>
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Moeda/Câmbio USD:</span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">{sale.usd_rate ? sale.usd_rate.toFixed(2) : '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Parcelamento:</span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">{sale.fees_installments || 1}x</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Tipo de Taxa:</span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">{sale.fees_type === 'interest_free' ? 'Sem Juros' : 'Com Juros'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

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

function ItemDetailCard({ item }: { item: SaleItem }) {
    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return '-';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'passagem': return <Plane className="w-5 h-5 text-blue-500" />;
            case 'hospedagem': return <Briefcase className="w-5 h-5 text-green-500" />;
            case 'seguro': return <Shield className="w-5 h-5 text-yellow-500" />;
            default: return <FileText className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 hover:border-[#19727d]/30 transition-all">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                        {getTypeIcon(item.type)}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#19727d] uppercase tracking-tighter">{item.type}</p>
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                            {item.type === 'passagem' ? `${item.origin} ➔ ${item.destination}` : item.hotelName || item.description || 'Descrição não informada'}
                        </h4>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Localizador</p>
                    <p className="text-sm font-black text-cyan-600 dark:text-cyan-400 tracking-widest">{item.locator || 'PENDENTE'}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100 dark:border-slate-700/50">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Data</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{formatDate(item.departureDate || item.checkIn || item.emissionDate)}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5"><User className="w-3 h-3" /> Passageiro(s)</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate" title={item.passengerName}>{item.passengerName || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> Fornecedor</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.vendor || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> Modelo</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.saleModel || 'Revenda'}</p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                    {item.ticket_url && (
                        <a href={item.ticket_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-colors">
                            <FileText className="w-3.5 h-3.5" /> Ver Bilhete 1
                        </a>
                    )}
                    {item.ticket_url2 && (
                        <a href={item.ticket_url2} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg text-[10px] font-bold hover:bg-orange-100 transition-colors">
                            <FileText className="w-3.5 h-3.5" /> Ver Bilhete 2
                        </a>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Venda</p>
                        <p className="text-xs font-black text-gray-900 dark:text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valuePaidByCustomer)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Custo</p>
                        <p className="text-xs font-black text-gray-500 dark:text-gray-400">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.emissionValue)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

