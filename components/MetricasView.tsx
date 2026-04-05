'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Clock, 
  CheckCircle2, 
  Plane, 
  Receipt, 
  Wallet, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  LayoutGrid,
  Search,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  eachDayOfInterval, 
  isSameDay, 
  subMonths, 
  subQuarters,
  subYears,
  addMonths,
  addQuarters,
  addYears,
  parseISO,
  isSameMonth,
  isSameQuarter,
  isSameYear,
  setDate
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sale, SaleItem } from '@/types';
import { motion } from 'framer-motion';

interface MetricasViewProps {
  sales: Sale[];
  fetchSales: (filters: { startDate: string; endDate: string }) => Promise<void>;
  onViewChange?: (view: any) => void;
}

export type ViewType = 'mes' | 'trimestre' | 'semestre' | 'ano';

export function MetricasView({ sales, fetchSales, onViewChange }: MetricasViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('mes');
  const [prevPeriodTotal, setPrevPeriodTotal] = useState(0);

  const getInterval = (date: Date, type: ViewType) => {
    let start: Date, end: Date;
    if (type === 'mes') {
      start = startOfMonth(date);
      end = endOfMonth(date);
    } else if (type === 'trimestre') {
      start = startOfQuarter(date);
      end = endOfQuarter(date);
    } else if (type === 'semestre') {
      const isFirstHalf = date.getMonth() < 6;
      start = new Date(date.getFullYear(), isFirstHalf ? 0 : 6, 1);
      end = new Date(date.getFullYear(), isFirstHalf ? 5 : 11, isFirstHalf ? 30 : 31);
    } else {
      start = startOfYear(date);
      end = endOfYear(date);
    }
    return { start, end };
  };

  const updateData = (date: Date, type: ViewType) => {
    const { start, end } = getInterval(date, type);
    fetchSales({ 
      startDate: start.toISOString().split('T')[0], 
      endDate: end.toISOString().split('T')[0] 
    });
  };

  // --- NAVEGAÇÃO DE DATA ---
  const handlePrev = () => {
    let newDate: Date;
    if (viewType === 'mes') newDate = subMonths(currentDate, 1);
    else if (viewType === 'trimestre') newDate = subQuarters(currentDate, 1);
    else if (viewType === 'semestre') newDate = subMonths(currentDate, 6);
    else newDate = subYears(currentDate, 1);
    
    setCurrentDate(newDate);
    updateData(newDate, viewType);
  };

  const handleNext = () => {
    let newDate: Date;
    if (viewType === 'mes') newDate = addMonths(currentDate, 1);
    else if (viewType === 'trimestre') newDate = addQuarters(currentDate, 1);
    else if (viewType === 'semestre') newDate = addMonths(currentDate, 6);
    else newDate = addYears(currentDate, 1);
    
    setCurrentDate(newDate);
    updateData(newDate, viewType);
  };

  const handleViewTypeChange = (type: ViewType) => {
    setViewType(type);
    updateData(currentDate, type);
  };

  // Buscar total do período anterior para cálculo de crescimento justo
  React.useEffect(() => {
    const fetchPrevPeriodData = async () => {
      let prevStart: Date, prevEnd: Date;
      
      if (viewType === 'mes') {
        const prevDate = subMonths(currentDate, 1);
        prevStart = startOfMonth(prevDate);
        prevEnd = endOfMonth(prevDate);
        
        // Comparação honesta dia a dia se for o mês corrente
        const isCurrentMonth = isSameMonth(currentDate, new Date()) && isSameYear(currentDate, new Date());
        if (isCurrentMonth) {
          prevEnd = setDate(prevStart, new Date().getDate());
        }
      } else if (viewType === 'trimestre') {
        const prevDate = subQuarters(currentDate, 1);
        prevStart = startOfQuarter(prevDate);
        prevEnd = endOfQuarter(prevDate);
      } else if (viewType === 'semestre') {
        const isFirstHalf = currentDate.getMonth() < 6;
        const year = isFirstHalf ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
        prevStart = new Date(year, isFirstHalf ? 6 : 0, 1);
        prevEnd = new Date(year, isFirstHalf ? 11 : 5, isFirstHalf ? 31 : 30);
      } else {
        const prevDate = subYears(currentDate, 1);
        prevStart = startOfYear(prevDate);
        prevEnd = endOfYear(prevDate);
      }
      
      try {
        const { saleService } = await import('@/services/supabaseService');
        const prevSales = await saleService.getAll({ 
          startDate: prevStart.toISOString().split('T')[0], 
          endDate: prevEnd.toISOString().split('T')[0] 
        });

        // Somar apenas itens que caem no período correto de emissão (equivalente ao cálculo do dashboard)
        let total = 0;
        prevSales.forEach(s => {
          s.items?.forEach(item => {
            if (item.emissionDate) {
              const d = parseISO(item.emissionDate);
              if (d >= prevStart && d <= prevEnd) {
                total += item.valuePaidByCustomer || 0;
              }
            }
          });
        });
        
        setPrevPeriodTotal(total);
      } catch (err) {
        console.error('Erro ao buscar dados do período anterior:', err);
      }
    };

    fetchPrevPeriodData();
  }, [currentDate, viewType]);

  const getLabel = () => {
    if (viewType === 'mes') return format(currentDate, "MMMM yyyy", { locale: ptBR });
    if (viewType === 'trimestre') return `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()}`;
    if (viewType === 'semestre') return `${currentDate.getMonth() < 6 ? '1º' : '2º'} Semestre ${currentDate.getFullYear()}`;
    return currentDate.getFullYear().toString();
  };

  const periodLabel = getLabel();

  // --- CÁLCULOS DE MÉTRICAS ---
  const metrics = useMemo(() => {
    let totalVendido = 0;
    let custoTotal = 0;
    let lucro = 0;
    let custoMilhas = 0;
    let totalTaxas = 0;
    let totalVendidoComparativo = 0;
    let totalAReceber = 0;
    let totalRecebido = 0;
    let itemCount = 0;

    const { start: periodStart, end: periodEnd } = getInterval(currentDate, viewType);
    const isCurrentPeriod = new Date() >= periodStart && new Date() <= periodEnd;
    const now = new Date();

    sales.forEach(sale => {
      sale.items?.forEach(item => {
        if (!item.emissionDate) return;
        
        const emissionDate = parseISO(item.emissionDate);
        
        // Verifica se o item pertence ao período visualizado
        if (emissionDate >= periodStart && emissionDate <= periodEnd) {
          const itemValue = item.valuePaidByCustomer || 0;
          const itemCost = item.emissionValue || 0;
          const itemCommission = item.additionalCosts || 0;
          
          totalVendido += itemValue;
          custoTotal += itemCost;
          
          // Cálculo do lucro/comissão do item
          const itemProfit = itemCommission > 0 ? itemCommission : (itemValue - itemCost);
          lucro += itemProfit;
          
          // Custo das Milhas
          const isMiles = item.saleModel?.toLowerCase().includes('milhas') || 
                         item.description?.toLowerCase().includes('milhas');
          if (isMiles) custoMilhas += itemCost;
          
          // Total em Taxas (Comissões diretas)
          totalTaxas += itemCommission;
          
          itemCount++;

          // Controle de Recebíveis baseado no Lucro/Comissão (visão financeira líquida)
          if (sale.saleStatus === 'Recebido') {
            totalRecebido += itemProfit;
          } else {
            totalAReceber += itemProfit;
          }

          // Para o cálculo de crescimento (comparação honesta do período atual até hoje)
          if (isCurrentPeriod) {
            if (emissionDate <= now) {
              totalVendidoComparativo += itemValue;
            }
          } else {
            totalVendidoComparativo += itemValue;
          }
        }
      });
    });

    const margem = totalVendido > 0 ? (lucro / totalVendido) * 100 : 0;
    
    // Removidos cálculos por venda inteira para evitar discrepâncias entre meses
    // totalAReceber e totalRecebido agora são calculados item a item acima
    
    const daysInPeriod = eachDayOfInterval({ start: periodStart, end: periodEnd }).length;
    const mediaDiaria = itemCount / daysInPeriod;

    let taxaCrescimento = 0;
    if (prevPeriodTotal > 0) {
      taxaCrescimento = ((totalVendidoComparativo - prevPeriodTotal) / prevPeriodTotal) * 100;
    } else if (totalVendidoComparativo > 0) {
      taxaCrescimento = 100;
    }

    // Dados para o gráfico
    const { start: startDate, end: endDate } = getInterval(currentDate, viewType);
    const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });

    let accumValue = 0;
    let accumProfit = 0;

    const chartData = daysInterval.map(day => {
      let dailyValue = 0;
      let dailyProfit = 0;

      sales.forEach(sale => {
        sale.items?.forEach(item => {
          if (item.emissionDate && isSameDay(parseISO(item.emissionDate), day)) {
            const itemValue = item.valuePaidByCustomer || 0;
            const itemCost = item.emissionValue || 0;
            const itemCommission = item.additionalCosts || 0;
            
            dailyValue += itemValue;
            dailyProfit += itemCommission > 0 ? itemCommission : (itemValue - itemCost);
          }
        });
      });

      accumValue += dailyValue;
      accumProfit += dailyProfit;

      return {
        name: format(day, 'dd/MM'),
        vendas: accumValue,
        lucro: accumProfit,
        vendasOriginal: dailyValue,
        lucroOriginal: dailyProfit
      };
    });

    return {
      lucro,
      totalVendido,
      margem,
      totalAReceber,
      totalRecebido,
      custoMilhas,
      totalTaxas,
      custoTotal,
      taxaCrescimento,
      mediaDiaria,
      chartData
    };
  }, [sales, currentDate, viewType, prevPeriodTotal]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatPercent = (val: number) => {
    return val.toFixed(1) + '%';
  };

  const kpis = [
    { label: 'Lucro', value: formatCurrency(metrics.lucro), sub: 'lucro total', icon: <TrendingUp size={14} className="text-purple-500" />, color: 'purple' },
    { label: 'Total Vendido', value: formatCurrency(metrics.totalVendido), sub: 'valor total de vendas', icon: <DollarSign size={14} className="text-purple-400" />, color: 'indigo' },
    { label: 'Margem', value: formatPercent(metrics.margem), sub: 'margem de lucro', icon: <Percent size={14} className="text-blue-500" />, color: 'blue' },
    { label: 'Lucro a Receber', value: formatCurrency(metrics.totalAReceber), sub: 'pendente', icon: <Clock size={14} className="text-orange-500" />, color: 'orange' },
    { label: 'Lucro Recebido', value: formatCurrency(metrics.totalRecebido), sub: 'confirmado', icon: <CheckCircle2 size={14} className="text-green-500" />, color: 'green' },
    { label: 'Custo das Milhas', value: formatCurrency(metrics.custoMilhas), sub: 'custo total em milhas', icon: <Plane size={14} className="text-pink-500" />, color: 'pink' },
    { label: 'Total em Taxas', value: formatCurrency(metrics.totalTaxas), sub: 'taxas acumuladas', icon: <Receipt size={14} className="text-indigo-500" />, color: 'teal' },
    { label: 'Custo Total', value: formatCurrency(metrics.custoTotal), sub: 'todos os custos', icon: <Wallet size={14} className="text-gray-500" />, color: 'indigo' },
    { 
      label: 'Taxa de Crescimento', 
      value: formatPercent(metrics.taxaCrescimento), 
      sub: 'vs período anterior', 
      icon: metrics.taxaCrescimento < 0 ? <Activity size={14} className="text-red-500" /> : <TrendingUp size={14} className="text-cyan-500" />, 
      color: metrics.taxaCrescimento < 0 ? 'red' : 'cyan' 
    },
    { label: 'Média Diária', value: metrics.mediaDiaria.toFixed(1), sub: 'emissões/dia', icon: <Activity size={14} className="text-rose-500" />, color: 'rose' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER AZUL (COR SIDEBAR) */}
      <div className="bg-[#19727d] rounded-[24px] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-cyan-900/10 border border-cyan-800/20">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Métricas de Emissões</h1>
          <p className="text-cyan-100/80 font-medium text-sm">Acompanhe o desempenho das suas vendas</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Seletor de Período (Novo) */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            {(['mes', 'trimestre', 'semestre', 'ano'] as ViewType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleViewTypeChange(type)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewType === type 
                    ? 'bg-white text-[#19727d] shadow-lg' 
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {type === 'mes' ? 'Mensal' : type === 'trimestre' ? 'Trimestral' : type === 'semestre' ? 'Semestral' : 'Anual'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            <button onClick={handlePrev} className="p-2 hover:bg-white/10 rounded-xl transition-all">
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-black uppercase text-[10px] tracking-widest min-w-[140px] text-center">
              {periodLabel}
            </span>
            <button onClick={handleNext} className="p-2 hover:bg-white/10 rounded-xl transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
          
          <button className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
            <CalendarIcon size={20} />
          </button>
          
          <button 
            onClick={() => onViewChange?.('clientes')}
            className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all font-bold text-sm"
          >
            <UsersIcon size={18} />
            Clientes
          </button>
          
          <button className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all font-bold text-sm">
            <LayoutGrid size={18} />
            Organizar
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-[#1e293b] p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700/50 hover:shadow-md transition-all group relative"
          >
            <div className="absolute top-4 right-4 p-2 bg-gray-50 dark:bg-slate-800 rounded-[12px] group-hover:scale-110 transition-transform">
              {kpi.icon}
            </div>
            
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-4">{kpi.label}</span>
                <h3 className={`text-xl font-black mb-1 ${
                  kpi.label === 'Taxa de Crescimento' && kpi.value.startsWith('-')
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {kpi.value}
                </h3>
              </div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHART SECTION */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[32px] p-8 shadow-sm border border-gray-100 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Evolução Diária das Métricas</h2>
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mt-1">Acompanhe a evolução das principais métricas financeiras ao longo do tempo.</p>
          </div>
          <button className="p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg">
             <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
          </button>
        </div>
        
        <div className="h-[400px] w-full">
          {metrics.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4c1d95" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4c1d95" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                  tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-2xl shadow-2xl flex flex-col gap-2 min-w-[200px]">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-slate-700/50 pb-1.5 mb-1 text-center">
                            {data.name}
                          </p>
                          
                          <div className="space-y-3">
                            {/* Vendas / Faturamento */}
                            <div className="border-b border-gray-50 dark:border-slate-700/50 pb-1.5">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Vendas (Período)</span>
                                <span className="text-[11px] font-black text-gray-950 dark:text-gray-100">{formatCurrency(data.vendasOriginal)}</span>
                              </div>
                              <div className="flex items-center justify-between gap-4 mt-0.5">
                                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-tight">Vendas (Acumulado)</span>
                                <span className="text-[11px] font-black text-cyan-600 dark:text-cyan-400">{formatCurrency(data.vendas)}</span>
                              </div>
                            </div>
                            
                            {/* Lucro / Comissão */}
                            <div className="pt-0.5">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Lucro (Período)</span>
                                <span className="text-[11px] font-black text-gray-950 dark:text-gray-100">{formatCurrency(data.lucroOriginal)}</span>
                              </div>
                              <div className="flex items-center justify-between gap-4 mt-0.5">
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">Lucro (Acumulado)</span>
                                <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(data.lucro)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="vendas" 
                  stroke="#4c1d95" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  name="Vendas"
                />
                <Area 
                  type="monotone" 
                  dataKey="lucro" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                  name="Lucro"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 italic space-y-4">
              <Activity size={48} className="opacity-20" />
              <p className="text-sm font-medium">Nenhum dado disponível para este período.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
