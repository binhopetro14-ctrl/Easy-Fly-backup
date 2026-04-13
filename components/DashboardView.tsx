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
  format,
  parseISO,
  subDays
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
  Plus,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Sale, TeamMember, CalendarEvent } from '@/types';
import { HeaderButton, StatCard } from './UI';
import Image from 'next/image';
interface DashboardViewProps {
  sales: Sale[];
  onAddCustomer: () => void;
  onAddSale: () => void;
  setActiveView: (view: any) => void;
  onUpdateSaleStatus: (saleId: string, field: 'costStatus' | 'saleStatus', status: any) => void;
  onAddLead: () => void;
  currentUser: any;
  teamMembers: TeamMember[];
  calendarEvents: CalendarEvent[];
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
  teamMembers,
  calendarEvents,
  showValues,
  onToggleValues
}: DashboardViewProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const fmt = (value: number) => showValues
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    : '••••••';
  const recentSales = [...sales].sort((a, b) => {
    const dateA = new Date(a.saleDate || a.createdAt).getTime();
    const dateB = new Date(b.saleDate || b.createdAt).getTime();
    return dateB - dateA;
  }).slice(0, 5);
  const currentMonthSalesData = React.useMemo(() => {
    const now = new Date();
    const isAdminOrManager = currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente';
    const currentUserName = `${currentUser?.name} ${currentUser?.lastName || ''}`.trim();
    let totalFaturamento = 0;
    let totalComissao = 0;
    let count = 0;
    sales.forEach(sale => {
      // Se não for admin/gerente, filtra apenas vendas do emissor logado
      if (!isAdminOrManager && sale.emissor !== currentUserName) return;
      sale.items?.forEach(item => {
        if (!item.emissionDate) return;
        const emissionDate = parseISO(item.emissionDate);

        if (emissionDate.getMonth() === now.getMonth() && emissionDate.getFullYear() === now.getFullYear()) {
          totalFaturamento += (item.valuePaidByCustomer || 0);

          const itemCost = item.emissionValue || 0;
          const itemCommission = item.additionalCosts || 0;
          const itemProfit = itemCommission > 0 ? itemCommission : ((item.valuePaidByCustomer || 0) - itemCost);

          totalComissao += itemProfit;
          count++;
        }
      });
    });
    return { totalFaturamento, totalComissao, count };
  }, [sales, currentUser]);
  const previousMonthSalesData = React.useMemo(() => {
    const now = new Date();
    const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const todayDay = now.getDate();
    const isAdminOrManager = currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente';
    const currentUserName = `${currentUser?.name} ${currentUser?.lastName || ''}`.trim();
    let totalFaturamento = 0;
    let totalComissao = 0;
    let count = 0;
    sales.forEach(sale => {
      if (!isAdminOrManager && sale.emissor !== currentUserName) return;
      sale.items?.forEach(item => {
        if (!item.emissionDate) return;
        const emissionDate = parseISO(item.emissionDate);
        const isPrevMonth = emissionDate.getMonth() === prevMonth && emissionDate.getFullYear() === prevYear;
        if (isPrevMonth && emissionDate.getDate() <= todayDay) {
          totalFaturamento += (item.valuePaidByCustomer || 0);

          const itemCost = item.emissionValue || 0;
          const itemCommission = item.additionalCosts || 0;
          const itemProfit = itemCommission > 0 ? itemCommission : ((item.valuePaidByCustomer || 0) - itemCost);

          totalComissao += itemProfit;
          count++;
        }
      });
    });
    return { totalFaturamento, totalComissao, count };
  }, [sales, currentUser]);
  const renderTrend = (current: number, previous: number) => {
    if (previous === 0) return <span className="text-[12px] text-gray-400 font-medium italic">novo período</span>;
    const percent = ((current - previous) / previous) * 100;
    const isNegative = percent < 0;
    const formattedPercent = Math.abs(percent).toFixed(1);

    return (
      <div className="flex items-center gap-1.5">
        <span className={`px-1.5 py-0.5 rounded-lg font-black text-[11px] ${isNegative ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-[#19727d] bg-[#19727d]/10'
          }`}>
          {isNegative ? '-' : '+'}{formattedPercent}%
        </span>
        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-bold lowercase tracking-tight">vs mês passado</span>
      </div>
    );
  };
  const chartData = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const data = months.map(month => ({
      name: month,
      Faturamento: 0,
      Comissão: 0,
      FaturamentoMensal: 0,
      ComissaoMensal: 0
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
        data[monthIndex].Comissão += profit;
      }
    });
    // Acumular valores para visão geral acumulativa (Running Total)
    let accumFaturamento = 0;
    let accumComissao = 0;

    data.forEach(d => {
      // Preservar valores mensais individuais para o Tooltip
      d.FaturamentoMensal = d.Faturamento;
      d.ComissaoMensal = d.Comissão;
      accumFaturamento += d.Faturamento;
      accumComissao += d.Comissão;

      // Valores acumulados para a linha do gráfico
      d.Faturamento = accumFaturamento;
      d.Comissão = accumComissao;
    });
    return data;
  }, [sales]);
  const sellerRanking = React.useMemo(() => {
    const rankingMap: Record<string, { name: string, totalValue: number, count: number, avatarUrl?: string }> = {};
    const now = new Date();
    sales.filter(sale => {
      const saleDate = new Date(sale.saleDate || sale.createdAt);
      return saleDate.getMonth() === now.getMonth() &&
        saleDate.getFullYear() === now.getFullYear();
    }).forEach(sale => {
      const emissor = sale.emissor || 'Não Informado';
      if (!rankingMap[emissor]) {
        // Busca o avatar do membro da equipe pelo nome
        const member = teamMembers.find(m => {
          const fullName = `${m.name} ${m.lastName || ''}`.trim();
          return fullName.toLowerCase() === emissor.toLowerCase() || m.name.toLowerCase() === emissor.toLowerCase();
        });

        rankingMap[emissor] = {
          name: emissor,
          totalValue: 0,
          count: 0,
          avatarUrl: member?.avatarUrl
        };
      }
      rankingMap[emissor].totalValue += (sale.totalValue || 0);
      rankingMap[emissor].count += 1;
    });
    return Object.values(rankingMap)
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);
  }, [sales, teamMembers]);
  const allEvents = React.useMemo(() => {
    const manualEvents = calendarEvents || [];
    const autoEvents: any[] = [];

    // GERAÇÃO DE EVENTOS AUTOMÁTICOS
    sales.forEach(sale => {
      sale.items?.forEach((item, idx) => {
        const passengerLabel = item.passengerName ? ` - ${item.passengerName}` : '';

        if (item.type === 'passagem' && item.departureDate) {
          try {
            const boardingTimeStr = item.boardingTime || '00:00';
            const fullDepartureStr = `${item.departureDate}T${boardingTimeStr}`;

            // Embarque
            autoEvents.push({
              id: `sale-dep-${sale.id}-${idx}`,
              title: `Embarque: ${item.origin} ✈️ ${item.destination}${passengerLabel}`,
              type: 'Embarque',
              startDate: fullDepartureStr,
              isAuto: true,
              saleId: sale.id
            });
            // Check-in (24h antes)
            const checkInDateTime = new Date(boardingDateTime.getTime() - 24 * 60 * 60 * 1000);
            
            // Gerar ISO local manualmente para evitar o checkout em UTC do toISOString()
            const pad = (n: number) => n.toString().padStart(2, '0');
            const localCheckInISO = `${checkInDateTime.getFullYear()}-${pad(checkInDateTime.getMonth() + 1)}-${pad(checkInDateTime.getDate())}T${pad(checkInDateTime.getHours())}:${pad(checkInDateTime.getMinutes())}`;

            autoEvents.push({
              id: `sale-checkin-${sale.id}-${idx}`,
              title: `Check-in: ${item.passengerName || sale.customerName || 'Passageiro'} - ${item.origin || ''}/${item.destination || ''}`,
              type: 'Check-in',
              startDate: localCheckInISO,
              isAuto: true,
              saleId: sale.id
            });
          } catch (e) { /* ignore error */ }
        }
      });
    });
    // Filtra autoEvents se já existir um evento manual/do banco vinculado à mesma venda e tipo
    const filteredAutoEvents = autoEvents.filter(autoEv => {
      const hasDuplicate = manualEvents.some(manEv =>
        manEv.saleId === autoEv.saleId &&
        manEv.type === autoEv.type &&
        (autoEv.type === 'Check-in' || autoEv.type === 'Embarque'
          ? (manEv.title.includes(autoEv.title) || autoEv.title.includes(manEv.title))
          : true)
      );
      return !hasDuplicate;
    });
    return [...manualEvents, ...filteredAutoEvents];
  }, [sales, calendarEvents]);
  const upcomingEvents = React.useMemo(() => {
    const now = new Date();
    const futureEvents = allEvents
      .filter(event => parseISO(event.startDate) >= now)
      .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
    return futureEvents.slice(0, 5);
  }, [allEvents]);
  const formatEventDate = (dateStr: string) => {
    try {
      if (!isMounted) return { day: '--', month: '---', time: '--:--' };
      
      const date = parseISO(dateStr);
      if (isNaN(date.getTime())) return { day: '--', month: '---', time: '--:--' };
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      return { day, month, time: `${hour}:${minute}` };
    } catch {
      return { day: '--', month: '---', time: '--:--' };
    }
  };
  const getBadgeStyles = (type: string) => {
    switch (type) {
      case 'Check-in':
        return "bg-purple-50 dark:bg-purple-500/10 text-[#19727d] dark:text-purple-400 border-purple-100 dark:border-purple-900/20";
      case 'Embarque':
        return "bg-[#19727d]/10 dark:bg-[#19727d]/100/10 text-[#19727d] dark:text-[#19727d] border-[#19727d]/20 dark:border-cyan-900/20";
      case 'Tarefa':
        return "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/20";
      default:
        return "bg-gray-50 dark:bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-900/20";
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recebido': return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400';
      case 'Parcial': return 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'Pendente': return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'Atrasado': return 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'Cancelado': return 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400';
      case 'Pago': return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400';
      default: return 'bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-gray-300';
    }
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    // Se for apenas data YYYY-MM-DD, tratamos como string pura para evitar bugs de fuso horário
    if (dateString.length === 10 && dateString.includes('-')) {
      const portions = dateString.split('-');
      if (portions[0].length === 4) {
        return `${portions[2]}/${portions[1]}/${portions[0]}`;
      }
    }

    try {
      const dateObj = parseISO(dateString);
      if (isNaN(dateObj.getTime())) return '-';
      return dateObj.toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
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
      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-[#19727d]/20 cursor-pointer transition-all ${getStatusColor(value)} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <option value="Recebido">Recebido</option>
      <option value="Parcial">Parcial</option>
      <option value="Pendente">Pendente</option>
      <option value="Atrasado">Atrasado</option>
      <option value="Cancelado">Cancelado</option>
      <option value="Pago">Pago</option>
    </select>
  );
  return (
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
      <div className="bg-[#f8fafc]/50 dark:bg-slate-800/40 p-4 md:p-6 rounded-2xl border border-[#19727d]/20 dark:border-[#19727d]/10 w-full hover:shadow-md transition-shadow">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full">
          {/* Widget de Meta do Mês Integrado */}
          {(() => {
            const goalValue = 50000;
            const currentFaturamento = currentMonthSalesData.totalFaturamento;
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
                  <div className="w-10 h-10 rounded-xl bg-[#19727d]/10 dark:bg-[#19727d]/20 flex items-center justify-center text-[#19727d] dark:text-[#19727d] shadow-sm border border-white/50 dark:border-white/10">
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
                      className="h-full bg-[#19727d] shadow-lg shadow-[#19727d]/20"
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
                <div className="absolute top-0 right-0 w-100 h-full bg-gradient-to-l from-[#19727d]/2 dark:from-[#19727d]/10 to-transparent pointer-events-none" />
              </div>
            );
          })()}
          {/* Mini Stat Cards à Direita */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label="Reservas do Mês"
              value={currentMonthSalesData.count.toString()}
              description={renderTrend(currentMonthSalesData.count, previousMonthSalesData.count)}
              icon={<Calendar className="w-5 h-5 text-[#19727d]" />}
              iconBg="bg-[#19727d]/10"
            />
            <StatCard
              label="Faturamento do Mês"
              value={fmt(currentMonthSalesData.totalFaturamento)}
              description={renderTrend(currentMonthSalesData.totalFaturamento, previousMonthSalesData.totalFaturamento)}
              icon={<DollarSign className="w-5 h-5 text-[#19727d]" />}
              iconBg="bg-[#19727d]/10"
            />
            <StatCard
              label="Comissão do Mês"
              value={fmt(currentMonthSalesData.totalComissao)}
              description={renderTrend(currentMonthSalesData.totalComissao, previousMonthSalesData.totalComissao)}
              icon={<TrendingUp className="w-5 h-5 text-[#19727d]" />}
              iconBg="bg-[#19727d]/10"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 text-gray-950 dark:text-white">
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
                    <stop offset="5%" stopColor="#19727d" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#19727d" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="colorComissão" x1="0" y1="0" x2="0" y2="1">
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
                  cursor={{ stroke: '#19727d', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && showValues) {
                      return (
                        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-2.5 rounded-xl shadow-2xl flex flex-col gap-1.5 min-w-[140px] relative mb-10 translate-y-[-10px] transform -translate-x-1/2 left-1/2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-slate-700/50 pb-1 mb-1">
                            {payload[0].payload.name}
                          </p>
                          <div className="space-y-2">
                            <div className="border-b border-gray-50 dark:border-slate-700/50 pb-1">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Faturamento (Mês)</span>
                                <span className="text-[10px] font-black text-gray-950 dark:text-gray-100">{fmt(payload[0].payload.FaturamentoMensal)}</span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[9px] font-bold text-[#19727d] uppercase">Faturamento (Acum.)</span>
                                <span className="text-[10px] font-black text-[#19727d] dark:text-[#19727d]">{fmt(payload[0].payload.Faturamento)}</span>
                              </div>
                            </div>

                            <div className="pt-0.5">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Comissão (Mês)</span>
                                <span className="text-[10px] font-black text-gray-950 dark:text-gray-100">{fmt(payload[0].payload.ComissaoMensal)}</span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[9px] font-bold text-slate-500 uppercase">Comissão (Acum.)</span>
                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">{fmt(payload[0].payload.Comissão)}</span>
                              </div>
                            </div>
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
                  dataKey="Comissão"
                  stroke="#64748B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorComissão)"
                  activeDot={{ r: 4, fill: '#FFFFFF', stroke: '#64748B', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="Faturamento"
                  stroke="#19727d"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorFaturamento)"
                  activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#19727d', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold dark:text-white">Ranking de Vendedores</h2>
          </div>
          <div className="space-y-6">
            {sellerRanking.length > 0 ? (
              sellerRanking.map((seller, index) => {
                const goal = 50000;
                const progress = Math.round(Math.min(100, (seller.totalValue / goal) * 100));
                return (
                  <div key={seller.name} className="flex flex-col gap-3 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {seller.avatarUrl ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#19727d]/20 dark:border-slate-700 shadow-sm">
                              <Image
                                src={seller.avatarUrl}
                                alt={seller.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shadow-sm border-2
                              ${index === 0 ? 'bg-orange-50 text-orange-500 border-orange-100' :
                                index === 1 ? 'bg-gray-50 text-gray-500 border-gray-100' :
                                  index === 2 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:text-gray-500 dark:border-slate-700'}
                            `}>
                              {seller.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm border border-white
                            ${index === 0 ? 'bg-orange-400 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                                index === 2 ? 'bg-amber-600 text-white' :
                                  'bg-slate-400 text-white'}
                          `}>
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-gray-950 dark:text-gray-100 uppercase tracking-tight leading-none" title={seller.name}>
                            {seller.name}
                          </h3>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1 italic">
                            {seller.count} {seller.count === 1 ? 'venda' : 'vendas'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900 dark:text-gray-100 tracking-tight">
                          {fmt(seller.totalValue)}
                        </p>
                        <p className="text-[9px] font-bold text-[#19727d] dark:text-[#19727d] uppercase mt-0.5">
                          {progress}% de R$ 50.000
                        </p>
                      </div>
                    </div>
                    {/* Barra de Progresso Individual */}
                    <div className="w-full h-1.5 bg-gray-50 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-100 dark:border-slate-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                        style={{ backgroundColor: '#19727d' }}
                        className="h-full shadow-sm"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 dark:text-gray-500 text-xs italic">
                <p>Nenhuma venda registrada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 min-h-[200px]">
          <h2 className="text-lg font-bold mb-4 dark:text-white uppercase tracking-tight leading-none">Reservas Recentes</h2>
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
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Emissor</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Custo</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Venda</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Status</th>
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
                          <span className="text-sm text-gray-900 dark:text-gray-100 font-bold truncate max-w-[150px] block" title={sale.customerName}>{sale.customerName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {Array.from(new Set(sale.items?.map(i => i.type).filter(Boolean) || [])).map(t => (
                              <span key={t} className="px-2 py-0.5 bg-[#19727d]/10 dark:bg-[#19727d]/20 text-[#19727d] dark:text-[#19727d] text-[10px] font-bold rounded-lg uppercase tracking-tight whitespace-nowrap">
                                {t === 'passagem' ? '✈️' : t === 'hospedagem' ? '🏨' : t === 'seguro' ? '🛡️' : t === 'aluguel' ? '🚗' : '➕'} {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-gray-50 dark:bg-slate-800/50 text-[#19727d] dark:text-[#19727d] font-black text-[9px] uppercase tracking-wider rounded-md border border-gray-100 dark:border-slate-700/50">
                            {sale.emissor || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-black text-gray-900 dark:text-gray-100">{fmt(sale.totalCost)}</td>
                        <td className="px-4 py-3 text-sm font-black text-gray-900 dark:text-gray-100">{fmt(sale.totalValue)}</td>
                        <td className="px-4 py-3">
                          <StatusSelect
                            value={sale.saleStatus || 'Pendente'}
                            onChange={(status) => onUpdateSaleStatus(sale.id, 'saleStatus', status)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-gray-900 dark:text-gray-100">#{sale.orderNumber}</p>
                      <StatusSelect
                        value={sale.saleStatus || 'Pendente'}
                        onChange={(status) => onUpdateSaleStatus(sale.id, 'saleStatus', status)}
                      />
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{sale.customerName}</p>
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-gray-500">{formatDate(sale.saleDate)}</span>
                      <span className="text-gray-900 dark:text-white">{fmt(sale.totalValue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500 text-xs italic">
              <p>Nenhuma venda registrada.</p>
            </div>
          )}
        </div>
        {/* Card do Calendário - Posicionado à direita (conforme "AQUI" na imagem) */}
        <div className="bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 h-fit">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#19727d]" />
              <h2 className="text-lg font-bold dark:text-white">Próximos Eventos</h2>
            </div>
            <button
              onClick={() => setActiveView('calendario')}
              className="text-[10px] font-black text-[#19727d] uppercase tracking-widest hover:underline"
            >
              Ver Agenda
            </button>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                {upcomingEvents.map((event, idx) => (
                  <div key={event.id || idx} className="flex gap-3 group/item">
                    {/* Bloco de Data Minimalista e Compacto */}
                    <div className="flex flex-col items-center justify-center w-10 h-10 bg-[#19727d]/10 dark:bg-[#19727d]/20 rounded-lg border border-[#19727d]/10 dark:border-[#19727d]/30 shadow-sm flex-shrink-0">
                      <span className="text-[10px] font-black text-[#19727d] leading-none">
                        {formatEventDate(event.startDate).day}
                      </span>
                      <span className="text-[8px] font-bold text-[#19727d] uppercase leading-none opacity-80 mt-0.5">
                        {formatEventDate(event.startDate).month}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 py-0.5">
                      <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight truncate leading-tight mb-0.5 group-hover/item:text-[#19727d] transition-colors" title={event.title}>
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                            {formatEventDate(event.startDate).time}
                          </span>
                        </div>
                        <span className={`px-1.5 py-0.5 ${getBadgeStyles(event.type)} text-[8px] font-black rounded uppercase border tracking-wider`}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2">
                <button
                  onClick={() => setActiveView('calendario')}
                  className="flex items-center justify-between w-full group"
                >
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-[#19727d] transition-colors">Acessar agenda completa</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#19727d] transition-all transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-50 dark:border-slate-800 rounded-2xl">
              <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 border border-gray-100 dark:border-slate-700">
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Nenhum evento agendado</p>
              <p className="text-[10px] text-gray-400 mt-1 italic">Sua agenda está livre!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
