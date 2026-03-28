'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Calendar,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Trophy,
  UserPlus,
  ShoppingCart,
  Wand2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Sale } from '@/types';
import { HeaderButton, StatCard } from './UI';


interface DashboardViewProps {
  sales: Sale[];
  onAddCustomer: () => void;
  onAddSale: () => void;
  setActiveView: (view: any) => void;
  onUpdateSaleStatus: (saleId: string, field: 'costStatus' | 'saleStatus', status: any) => void;
  onAddLead: () => void;
  currentUser: any;
  showValues: boolean;
  onToggleValues: () => void;
}

export function DashboardView({
  sales,
  onAddCustomer,
  onAddSale,
  setActiveView,
  onUpdateSaleStatus,
  onAddLead,
  currentUser,
  showValues,
  onToggleValues
}: DashboardViewProps) {
  const fmt = (value: number) => showValues
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    : '••••••';

  const recentSales = [...sales].sort((a, b) => {
    const dateA = new Date(a.saleDate || a.createdAt).getTime();
    const dateB = new Date(b.saleDate || b.createdAt).getTime();
    return dateB - dateA;
  }).slice(0, 5);

  const currentMonthSales = React.useMemo(() => {
    const now = new Date();
    return sales.filter(sale => {
      const saleDate = new Date(sale.saleDate || sale.createdAt);
      return saleDate.getMonth() === now.getMonth() && 
             saleDate.getFullYear() === now.getFullYear();
    });
  }, [sales]);

  const chartData = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const data = months.map(month => ({ name: month, faturamento: 0, lucro: 0 }));

    sales.forEach(sale => {
      const saleDate = new Date(sale.saleDate || sale.createdAt);
      const monthIndex = saleDate.getMonth();
      const commissions = sale.items?.reduce((sum, item) => sum + (item.additionalCosts || 0), 0) || 0;
      const saleProfit = commissions > 0 ? commissions : (sale.totalValue - sale.totalCost);
      data[monthIndex].faturamento += (sale.totalValue || 0);
      data[monthIndex].lucro += saleProfit;
    });

    return data;
  }, [sales]);

  const sellerRanking = React.useMemo(() => {
    const rankingMap: Record<string, { name: string, totalValue: number, count: number }> = {};
    
    currentMonthSales.forEach(sale => {
      const emissor = sale.emissor || 'Não Informado';
      if (!rankingMap[emissor]) {
        rankingMap[emissor] = { name: emissor, totalValue: 0, count: 0 };
      }
      rankingMap[emissor].totalValue += (sale.totalValue || 0);
      rankingMap[emissor].count += 1;
    });

    return Object.values(rankingMap)
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);
  }, [currentMonthSales]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recebido': return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400';
      case 'Parcial': return 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'Pendente': return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'Atrasado': return 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'Cancelado': return 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const dateObj = dateString.includes('T') ? new Date(dateString) : new Date(dateString + 'T00:00:00');
    return dateObj.toLocaleDateString('pt-BR');
  };

  const StatusSelect = ({
    value,
    onChange,
    disabled = false
  }: {
    value: string;
    onChange: (status: string) => void;
    disabled?: boolean;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer transition-all ${getStatusColor(value)} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <option value="Recebido">Recebido</option>
      <option value="Parcial">Parcial</option>
      <option value="Pendente">Pendente</option>
      <option value="Atrasado">Atrasado</option>
      <option value="Cancelado">Cancelado</option>
    </select>
  );

  return (
    // Removido max-w-[1600px] e adicionado w-full, espaçamento reduzido
    <div className="space-y-4 md:space-y-6 w-full pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Visão Geral</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Resumo da sua agência no mês atual</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button
            onClick={onToggleValues}
            title={showValues ? 'Esconder valores' : 'Mostrar valores'}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
          >
            {showValues ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <HeaderButton icon={<ShoppingCart className="w-4 h-4" />} label="Nova venda" onClick={() => { setActiveView('vendas'); onAddSale(); }} />
          <HeaderButton icon={<UserPlus className="w-4 h-4" />} label="Novo cliente" onClick={onAddCustomer} />
          <HeaderButton icon={<Wand2 className="w-4 h-4" />} label="Fazer cotação" onClick={onAddLead} primary />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Reservas do Mês"
          value={currentMonthSales.length.toString()}
          description="Todas as reservas do mês"
          icon={<Calendar className="w-6 h-6 text-[#06B6D4]" />}
          iconBg="bg-[#ECFEFF]"
        />
        <StatCard
          label="Faturamento do Mês"
          value={fmt(currentMonthSales.reduce((sum, s) => sum + s.totalValue, 0))}
          description="Vendas confirmadas"
          icon={<DollarSign className="w-6 h-6 text-[#06B6D4]" />}
          iconBg="bg-[#ECFEFF]"
        />
        <StatCard
          label="Despesas Pendentes"
          value={fmt(currentMonthSales.reduce((sum, s) => sum + s.totalCost, 0))}
          description="Reservas ainda não pagas"
          icon={<AlertCircle className="w-6 h-6 text-[#06B6D4]" />}
          iconBg="bg-[#ECFEFF]"
        />
        <StatCard
          label="Lucro do Mês"
          value={fmt(currentMonthSales.reduce((sum, s) => {
            const commissions = s.items?.reduce((itemSum, item) => itemSum + (item.additionalCosts || 0), 0) || 0;
            const saleProfit = commissions > 0 ? commissions : (s.totalValue - s.totalCost);
            return sum + saleProfit;
          }, 0))}
          description="Lucro líquido real"
          icon={<TrendingUp className="w-6 h-6 text-[#06B6D4]" />}
          iconBg="bg-[#ECFEFF]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Reduzido o padding e bordas ajustadas para rounded-2xl */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50">
          <h2 className="text-lg font-bold mb-6 dark:text-white">Receita Mensal</h2>
          <div className="h-[300px] w-full relative">
            {!showValues && (
              <div className="absolute inset-0 z-10 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-xl flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500 font-bold text-sm uppercase tracking-widest">Valores Ocultados</span>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => showValues ? `R$${(value / 1000).toFixed(0)}k` : '•••'}
                />
                <Tooltip
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [
                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0)),
                    ''
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="rect"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar name="Faturamento" dataKey="faturamento" fill="#22D3EE" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name="Lucro" dataKey="lucro" fill="#1F2937" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reduzido o padding e bordas ajustadas */}
        <div className="bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold dark:text-white">Ranking de Vendedores</h2>
          </div>
          <div className="space-y-4">
            {sellerRanking.length > 0 ? (
              sellerRanking.map((seller, index) => (
                <div key={seller.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm
                      ${index < 3 ? 'bg-green-100 text-green-700 border border-green-200 ring-2 ring-green-50' : 
                        'bg-gray-50 text-gray-400 dark:bg-slate-800 dark:text-gray-500'}
                    `}>
                      {index + 1}º
                    </div>
                     <div>
                      <h3 className="text-xl font-black text-gray-950 dark:text-gray-100 uppercase tracking-tighter leading-none" title={seller.name}>
                        {seller.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em] mt-1 italic">
                        {seller.count} {seller.count === 1 ? 'venda' : 'vendas'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-gray-900 dark:text-gray-100">
                      {fmt(seller.totalValue)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 dark:text-gray-500 text-xs italic">
                <p>Nenhuma venda registrada.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 min-h-[200px] w-full">
        <h2 className="text-lg font-bold mb-4 dark:text-white">Reservas Recentes</h2>
        {recentSales.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-bottom border-gray-100 dark:border-slate-700/50">
                    <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Pedido</th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Data</th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Produto</th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Emissor</th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Custo</th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Venda</th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Status Custo</th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Status Venda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-4 py-3">
                        <span className="font-bold text-sm text-gray-900 dark:text-gray-100">#{sale.orderNumber || sale.id.slice(0, 4).toUpperCase()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{formatDate(sale.saleDate || sale.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-bold">{sale.customerName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            const types = Array.from(new Set(sale.items?.map(i => i.type).filter(Boolean) || []));
                            return types.length > 0 ? types.map(t => (
                              <span key={t} className="px-2 py-0.5 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold rounded-lg uppercase tracking-tight whitespace-nowrap">
                                {t === 'passagem' ? '✈️ Passagem' : 
                                 t === 'hospedagem' ? '🏨 Hotel' : 
                                 t === 'seguro' ? '🛡️ Seguro' : 
                                 t === 'aluguel' ? '🚗 Aluguel' : 
                                 t === 'adicionais' ? '➕ Adic.' : t}
                              </span>
                            )) : <span className="text-gray-400 italic text-[10px]">N/A</span>;
                          })()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <span className="px-2 py-0.5 bg-gray-50 dark:bg-slate-800/50 text-[#3b82f6] dark:text-blue-400 font-black text-[9px] uppercase tracking-wider rounded-md border border-gray-100 dark:border-slate-700/50 shadow-sm whitespace-nowrap" title={sale.emissor || '-'}>
                            {sale.emissor || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-black">
                          {fmt(sale.totalCost)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-black">
                          {fmt(sale.totalValue)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusSelect
                          value={sale.costStatus || 'Pendente'}
                          onChange={(status) => onUpdateSaleStatus(sale.id, 'costStatus', status)}
                          disabled={currentUser?.role !== 'Administrador' && sale.emissor !== `${currentUser?.name} ${currentUser?.lastName || ''}`.trim()}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <StatusSelect
                          value={sale.saleStatus || 'Pendente'}
                          onChange={(status) => onUpdateSaleStatus(sale.id, 'saleStatus', status)}
                          disabled={currentUser?.role !== 'Administrador' && sale.emissor !== `${currentUser?.name} ${currentUser?.lastName || ''}`.trim()}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {recentSales.map((sale) => (
                <div key={sale.id} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">#{sale.orderNumber || sale.id.slice(0, 4).toUpperCase()}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{formatDate(sale.saleDate || sale.createdAt)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <StatusSelect
                        value={sale.saleStatus || 'Pendente'}
                        onChange={(status) => onUpdateSaleStatus(sale.id, 'saleStatus', status)}
                      />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{sale.customerName}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-1.5 py-0.5 bg-gray-50 dark:bg-slate-800/50 text-[#3b82f6] dark:text-blue-400 font-black text-[8px] uppercase tracking-wider rounded-md border border-gray-100 dark:border-slate-700/50 shadow-sm mr-1">
                        {sale.emissor || '-'}
                      </span>
                      {Array.from(new Set(sale.items?.map(i => i.type).filter(Boolean) || [])).map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[9px] font-bold rounded-md uppercase tracking-tight shadow-sm border border-cyan-100/50 dark:border-cyan-500/20">
                          {t === 'passagem' ? 'Passagem' : 
                           t === 'hospedagem' ? 'Hotel' : 
                           t === 'seguro' ? 'Seguro' : 
                           t === 'aluguel' ? 'Aluguel' : t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-slate-700/50">
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black">Venda</p>
                      <p className="text-sm font-black text-gray-900 dark:text-gray-100">
                        {fmt(sale.totalValue)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black">Custo</p>
                      <p className="text-sm font-black text-gray-900 dark:text-gray-100">
                        {fmt(sale.totalCost)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-sm">
            <p>Nenhuma reserva encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}