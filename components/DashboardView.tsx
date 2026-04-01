'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
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
  EyeOff,
  Luggage,
  Bell,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
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
    const isAdminOrManager = currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente';
    const currentUserName = `${currentUser?.name} ${currentUser?.lastName || ''}`.trim();

    return sales.filter(sale => {
      const saleDate = new Date(sale.saleDate || sale.createdAt);
      const isThisMonth = saleDate.getMonth() === now.getMonth() &&
        saleDate.getFullYear() === now.getFullYear();

      if (!isThisMonth) return false;
      if (isAdminOrManager) return true;

      // Se for vendedor, para os CARDS mostramos apenas as dele
      return sale.emissor === currentUserName;
    });
  }, [sales, currentUser]);

  const chartData = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const data = months.map(month => ({
      name: month,
      Faturamento: 0,
      Lucro: 0,
      Comissão: 0
    }));
    const now = new Date();
    const currentYear = now.getFullYear();

    sales.forEach(sale => {
      const saleDate = new Date(sale.saleDate || sale.createdAt);
      if (saleDate.getFullYear() === currentYear) {
        const monthIndex = saleDate.getMonth();
        const commissions = sale.items?.reduce((sum, item) => sum + (item.additionalCosts || 0), 0) || 0;
        const profit = commissions > 0 ? commissions : (sale.totalValue - sale.totalCost);

        data[monthIndex].Faturamento += (sale.totalValue || 0);
        data[monthIndex].Lucro += profit;
        data[monthIndex].Comissão += commissions;
      }
    });

    return data;
  }, [sales]);

  const sellerRanking = React.useMemo(() => {
    const rankingMap: Record<string, { name: string, totalValue: number, count: number }> = {};
    const now = new Date();

    sales.filter(sale => {
      const saleDate = new Date(sale.saleDate || sale.createdAt);
      return saleDate.getMonth() === now.getMonth() &&
        saleDate.getFullYear() === now.getFullYear();
    }).forEach(sale => {
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
  }, [sales]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white leading-tight">Visão Geral</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Resumo da sua agência no mês atual</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button
            onClick={onToggleValues}
            title={showValues ? 'Esconder valores' : 'Mostrar valores'}
            className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
          >
            {showValues ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <HeaderButton icon={<ShoppingCart className="w-4 h-4" />} label="Nova venda" onClick={() => { setActiveView('vendas'); onAddSale(); }} />
          <HeaderButton icon={<UserPlus className="w-4 h-4" />} label="Novo cliente" onClick={onAddCustomer} />
          <HeaderButton icon={<Wand2 className="w-4 h-4" />} label="Fazer cotação" onClick={onAddLead} primary />
        </div>
      </div>

      <div className="bg-[#f8fafc]/50 dark:bg-slate-800/40 p-4 md:p-6 rounded-2xl border border-cyan-100/50 dark:border-cyan-900/20 w-full hover:shadow-md transition-shadow">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full">
          {/* Widget de Meta do Mês Integrado */}
          {(() => {
            const goalValue = 50000;
            const currentFaturamento = currentMonthSales.reduce((sum, s) => sum + s.totalValue, 0);
            const progressPercent = Math.round(Math.min(100, (currentFaturamento / goalValue) * 100));
            const remainingValue = Math.max(0, goalValue - currentFaturamento);

            const getMotivationalMessage = (percent: number) => {
              if (percent >= 100) return "Parabéns! Meta batida 🚀";
              if (percent >= 70) return "Falta pouco! Você está quase lá.";
              if (percent >= 30) return "Bom progresso! Continue assim.";
              return "Você está começando, bora acelerar as vendas!";
            };

            return (
              <div className="lg:w-[45%] flex flex-col justify-center relative overflow-hidden group min-h-[160px]">
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm border border-white/50 dark:border-white/5">
                    <Luggage className="w-5 h-5" />
                  </div>
                  <div className="flex flex-baseline gap-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Meta do Mês</h3>
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-1">R$ 50.000</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="flex-1 h-3.5 bg-white/50 dark:bg-slate-700/50 rounded-full overflow-hidden border border-white dark:border-slate-600 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-cyan-500 shadow-lg shadow-cyan-500/20"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {progressPercent}%
                  </span>
                </div>

                <div className="relative z-10 space-y-1">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                    {progressPercent >= 100
                      ? "Objetivo alcançado! 🎉"
                      : <>{`Faltam `}<span className="text-gray-950 dark:text-white font-black">{fmt(remainingValue)}</span>{` para bater sua meta.`}</>}
                  </p>
                  <div className="flex items-center gap-1.5 opacity-70">
                    <span className="text-xs">🔔</span>
                    <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 italic">
                      {getMotivationalMessage(progressPercent)}
                    </p>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-cyan-50/20 dark:from-cyan-900/5 to-transparent pointer-events-none" />
              </div>
            );
          })()}

          {/* Mini Stat Cards à Direita */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label="Reservas do Mês"
              value={currentMonthSales.length.toString()}
              description="Vendas confirmadas"
              icon={<Calendar className="w-5 h-5 text-cyan-500" />}
              iconBg="bg-cyan-50"
            />
            <StatCard
              label="Faturamento do Mês"
              value={fmt(currentMonthSales.reduce((sum, s) => sum + s.totalValue, 0))}
              description="Vendas confirmadas"
              icon={<DollarSign className="w-5 h-5 text-cyan-500" />}
              iconBg="bg-cyan-50"
            />
            <StatCard
              label="Lucro do Mês"
              value={fmt(currentMonthSales.reduce((sum, s) => {
                const commissions = s.items?.reduce((itemSum, item) => itemSum + (item.additionalCosts || 0), 0) || 0;
                const saleProfit = commissions > 0 ? commissions : (s.totalValue - s.totalCost);
                return sum + saleProfit;
              }, 0))}
              description="Lucro líquido real"
              icon={<AlertCircle className="w-5 h-5 text-cyan-500" />}
              iconBg="bg-cyan-50"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Reduzido o padding e bordas ajustadas para rounded-2xl */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50">
          <h2 className="text-lg font-black tracking-tight mb-6 dark:text-white uppercase leading-none">Evolução de Fluxo</h2>
          <div className="h-[300px] w-full relative">
            {!showValues && (
              <div className="absolute inset-0 z-10 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-xl flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500 font-bold text-sm uppercase tracking-widest">Valores Ocultados</span>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 'bold' }}
                  tickFormatter={(value) => showValues ? `R$${Math.floor(value / 1000)}k` : '••k'}
                />
                <Tooltip
                  cursor={{ stroke: '#06B6D4', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && showValues) {
                      return (
                        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-2.5 rounded-xl shadow-2xl flex flex-col gap-1.5 min-w-[140px] relative mb-10 translate-y-[-10px] transform -translate-x-1/2 left-1/2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-slate-700/50 pb-1 mb-1">
                            {payload[0].payload.name}
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[10px] font-bold text-cyan-500 uppercase">Faturamento</span>
                            <span className="text-[10px] font-black text-gray-900 dark:text-gray-100">{fmt(payload.find(p => p.dataKey === 'Faturamento')?.value as number)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[10px] font-bold text-[#64748B] uppercase">Lucro</span>
                            <span className="text-[10px] font-black text-gray-900 dark:text-gray-100">{fmt(payload.find(p => p.dataKey === 'Lucro')?.value as number)}</span>
                          </div>
                          {/* Triangle indicator */}
                          <div className="absolute -bottom-1.5 left-1/2 -ms-1.5 w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-gray-100 dark:border-slate-700 rotate-45" />
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  iconType="square"
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="Lucro"
                  stroke="#64748B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLucro)"
                  activeDot={{ r: 4, fill: '#FFFFFF', stroke: '#64748B', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="Faturamento"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorFaturamento)"
                  activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#06B6D4', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="Comissão" stroke="transparent" fill="transparent" />
              </AreaChart>
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
                        <span className={`text-sm dark:text-gray-100 font-black ${(currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente' || sale.emissor === `${currentUser?.name} ${currentUser?.lastName || ''}`.trim())
                          ? 'text-gray-900' : 'text-gray-300 dark:text-gray-600 italic'
                          }`}>
                          {(currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente' || sale.emissor === `${currentUser?.name} ${currentUser?.lastName || ''}`.trim())
                            ? fmt(sale.totalCost) : 'Restrito'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm dark:text-gray-100 font-black ${(currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente' || sale.emissor === `${currentUser?.name} ${currentUser?.lastName || ''}`.trim())
                          ? 'text-gray-900' : 'text-gray-300 dark:text-gray-600 italic'
                          }`}>
                          {(currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente' || sale.emissor === `${currentUser?.name} ${currentUser?.lastName || ''}`.trim())
                            ? fmt(sale.totalValue) : 'Restrito'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusSelect
                          value={sale.costStatus || 'Pendente'}
                          onChange={(status) => onUpdateSaleStatus(sale.id, 'costStatus', status)}
                          disabled={(currentUser?.role !== 'Administrador' && currentUser?.role !== 'Gerente' && sale.emissor !== `${currentUser?.name} ${currentUser?.lastName || ''}`.trim())}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <StatusSelect
                          value={sale.saleStatus || 'Pendente'}
                          onChange={(status) => onUpdateSaleStatus(sale.id, 'saleStatus', status)}
                          disabled={(currentUser?.role !== 'Administrador' && currentUser?.role !== 'Gerente' && sale.emissor !== `${currentUser?.name} ${currentUser?.lastName || ''}`.trim())}
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