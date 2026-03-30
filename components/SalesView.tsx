'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search, Settings, Trash2, Plus, Users,
  Target, TrendingUp, DollarSign, Receipt, Plane, Activity,
  ChevronLeft, ChevronRight, Calendar, Tag, FileText, SlidersHorizontal, Upload,
  ArrowUpDown, X, LayoutGrid, RefreshCw, ArrowLeftRight, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sale } from '@/types';

interface SalesViewProps {
  sales: Sale[];
  onAddSale: () => void;
  onEditSale: (sale: Sale) => void;
  onDeleteSale: (id: string) => void;
  onUpdateSale: (saleId: string, updates: Partial<Sale>) => void;
  currentUser: any;
  fetchSales: (filters?: { startDate?: string; endDate?: string }) => Promise<void>;
  showValues?: boolean;
}

export function SalesView({
  sales,
  onAddSale,
  onEditSale,
  onDeleteSale,
  onUpdateSale,
  currentUser,
  fetchSales,
  showValues = true
}: SalesViewProps) {
  // Helper para formatar data sem sofrer com fuso horário (UTC vs Local)
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return '-';
    // Se vier no formato YYYY-MM-DD
    if (dateString.includes('-') && dateString.length <= 10) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    // Caso contrário (ISO string completa), usa o fallback seguro
    try {
      const date = new Date(dateString);
      // Força o meio do dia para evitar virar o dia no fuso horário
      date.setHours(12, 0, 0, 0);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Sale | 'lucro'; direction: 'asc' | 'desc' } | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isModelHelpOpen, setIsModelHelpOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // --- ESTADO DA DATA (Março 2026 como base) ---
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 25));

  // --- ATALHOS DO CALENDÁRIO ---
  const handleShortcut = (type: string) => {
    const today = new Date(2026, 2, 25);
    switch (type) {
      case 'Hoje': setCurrentDate(today); break;
      case 'Ontem': setCurrentDate(new Date(2026, 2, 24)); break;
      case 'Este mês': setCurrentDate(new Date(2026, 2, 1)); break;
      case 'Mês passado': setCurrentDate(new Date(2026, 1, 1)); break;
      case 'Este ano': setCurrentDate(new Date(2026, 0, 1)); break;
    }
    setIsCalendarOpen(false);
  };

  // Fecha o calendário ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- BUSCA DINÂMICA NO SUPABASE AO MUDAR O MÊS ---
  useEffect(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Formata YYYY-MM-DD mantendo o fuso local
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    
    fetchSales({ 
      startDate: formatDate(firstDay), 
      endDate: formatDate(lastDay) 
    });
  }, [currentDate, fetchSales]);

  const monthYearLabel = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // --- FILTRO E ORDENAÇÃO DE VENDAS ---
  const filteredSales = useMemo(() => {
    let result = sales.filter(sale => {
      // Já vem filtrado por mês do Supabase, filtramos apenas por termo de busca
      const matchesSearch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.orderNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    if (sortConfig) {
      result.sort((a: any, b: any) => {
        const getSaleProfit = (s: any) => {
          const comms = s.items?.reduce((sum: number, i: any) => sum + (i.additionalCosts || 0), 0) || 0;
          return comms > 0 ? comms : (s.totalValue - s.totalCost);
        };
        const aValue = sortConfig.key === 'lucro' ? getSaleProfit(a) : a[sortConfig.key];
        const bValue = sortConfig.key === 'lucro' ? getSaleProfit(b) : b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [sales, searchTerm, sortConfig]); // currentDate não filtrado aqui — o Supabase já retorna o mês correto via useEffect

  // --- CÁLCULOS DINÂMICOS ---
  const stats = useMemo(() => {
    const isAdminOrManager = currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente';
    const currentUserName = `${currentUser?.name} ${currentUser?.lastName || ''}`.trim();

    // Filtra as vendas que compõem os INDICADORES (Cards de cima)
    const mySales = filteredSales.filter(s => isAdminOrManager || s.emissor === currentUserName);

    const totalVendas = mySales.reduce((acc, s) => acc + (s.totalValue || 0), 0);
    const lucroTotal = mySales.reduce((acc, s) => {
      const saleCommissions = s.items?.reduce((sum, item) => sum + (item.additionalCosts || 0), 0) || 0;
      const saleProfit = saleCommissions > 0 ? saleCommissions : (s.totalValue - s.totalCost);
      return acc + (saleProfit || 0);
    }, 0);
    const custoTotal = totalVendas - lucroTotal;
    return { totalVendas, custoTotal, lucroTotal };
  }, [filteredSales, currentUser]);

  const fmt = (value: number) => showValues
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    : '••••••';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleSort = (key: keyof Sale | 'lucro') => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full space-y-6 relative">

      {/* 1. INDICADORES (Cards Superiores) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Lucro Total</p>
            <p className={`text-2xl font-bold ${stats.lucroTotal >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500 dark:text-red-400'}`}>
              {fmt(stats.lucroTotal)}
            </p>
          </div>
          <Target className="w-5 h-5 text-purple-300" />
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Total de Vendas</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(stats.totalVendas)}</p>
          </div>
          <TrendingUp className="w-5 h-5 text-purple-300" />
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Custo Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(stats.custoTotal)}</p>
          </div>
          <DollarSign className="w-5 h-5 text-purple-300" />
        </div>
      </div>

      {/* 2. BARRA DE FERRAMENTAS COM POPOVER DE CALENDÁRIO */}
      <div className="flex flex-col xl:flex-row gap-4 relative">

        {/* Seletor de Data */}
        <div className="flex items-center justify-between bg-white dark:bg-[#1e293b] px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700/50 min-w-[260px] relative">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-gray-400 dark:text-gray-500 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-gray-700 dark:text-gray-200 text-sm capitalize">{monthYearLabel}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-gray-400 dark:text-gray-500 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-200 dark:bg-slate-700/50"></div>

            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`p-1 rounded cursor-pointer transition-colors ${isCalendarOpen ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          {/* POPOVER DO CALENDÁRIO */}
          {isCalendarOpen && (
            <div ref={calendarRef} className="absolute top-14 left-0 z-50 bg-white dark:bg-[#1e293b] shadow-2xl border border-gray-200 dark:border-slate-700/50 rounded-2xl flex overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="w-44 bg-gray-50/50 dark:bg-slate-800/50 border-r border-gray-100 dark:border-slate-700/50 p-2 flex flex-col gap-1">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 px-3 py-2 uppercase">Atalhos</p>
                {['Hoje', 'Ontem', 'Últimos 7 dias', 'Últimos 30 dias', 'Esta semana', 'Semana passada', 'Este mês', 'Mês passado', 'Este ano'].map((label) => (
                  <button
                    key={label}
                    onClick={() => handleShortcut(label)}
                    className="text-left px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-all cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-white dark:bg-[#1e293b]">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex gap-2">
                    <div className="text-xs font-bold bg-gray-50 dark:bg-slate-800 rounded-md px-2 py-1 capitalize dark:text-gray-200">{currentDate.toLocaleDateString('pt-BR', { month: 'long' })}</div>
                    <div className="text-xs font-bold bg-gray-50 dark:bg-slate-800 rounded-md px-2 py-1 dark:text-gray-200">2026</div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map(d => (
                    <span key={d} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase py-2">{d}</span>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentDate(new Date(2026, currentDate.getMonth(), i + 1));
                        setIsCalendarOpen(false);
                      }}
                      className={`w-8 h-8 text-xs font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer
                        ${i + 1 === currentDate.getDate() ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/50' : 'hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300'}
                      `}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barra de Pesquisa e Ações */}
        <div className="flex-1 flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-[#1e293b] p-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800/50 dark:text-gray-100 border-none rounded-lg text-sm focus:outline-none cursor-text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50 cursor-pointer"><Tag className="w-4 h-4" /></button>
            <button onClick={() => handleSort('lucro')} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50 cursor-pointer whitespace-nowrap"><Settings className="w-4 h-4" /> Organizar</button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50 cursor-pointer whitespace-nowrap"><FileText className="w-4 h-4" /> Relatório</button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50 cursor-pointer"><SlidersHorizontal className="w-4 h-4" /></button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50 cursor-pointer"><Upload className="w-4 h-4" /></button>
            <button onClick={onAddSale} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-sm cursor-pointer whitespace-nowrap"><Plus className="w-4 h-4" /> Nova Venda</button>
          </div>
        </div>
      </div>

      {/* 3. TABELA DE VENDAS */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-50 dark:border-slate-700/50 bg-white dark:bg-[#1e293b]/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Emissão</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Embarque</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Retorno</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Localizador</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Valor Venda</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Custo</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Comissão</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Emissor</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Fornecedor</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center justify-center gap-1">
                  Modelo de Venda
                  <button 
                    onClick={() => setIsModelHelpOpen(true)}
                    className="w-3.5 h-3.5 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-[9px] font-black text-gray-400 dark:text-gray-500 hover:bg-cyan-100 hover:text-cyan-600 transition-colors"
                  >
                    !
                  </button>
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status Custo</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status Venda</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Produto</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Bilhetes</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  {/* 1. Data da Emissão */}
                  <td className="px-6 py-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {formatDate(sale.saleDate)}
                  </td>

                  {/* 2. Data de Embarque */}
                  <td className="px-6 py-3 text-xs font-bold text-gray-800 dark:text-gray-200">
                    {(() => {
                      const date = sale.items?.find(i => i.departureDate)?.departureDate;
                      return date ? formatDate(date) : '-';
                    })()}
                  </td>
                  
                  {/* 2.5 Data de Retorno */}
                  <td className="px-6 py-3 text-xs font-bold text-gray-800 dark:text-gray-200">
                    {(() => {
                      // Procura em qualquer item o campo returnDate preenchido
                      const date = sale.items?.find(i => i.returnDate && i.returnDate !== '')?.returnDate;
                      return date ? formatDate(date) : '-';
                    })()}
                  </td>

                  {/* 3. Localizador */}
                  <td className="px-6 py-3 text-xs font-black text-cyan-600 dark:text-cyan-400 tracking-wider">
                    {sale.items?.map(i => i.locator).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', ') || '-'}
                  </td>

                  {/* 4. Cliente / Passageiros */}
                  <td className="px-6 py-3 text-xs leading-tight">
                    <div className="flex flex-col">
                      {(() => {
                        // 1. All unique names from all items
                        const itemNames = sale.items?.flatMap(i => 
                          i.passengerName ? i.passengerName.split(',').map(n => n.trim()) : []
                        ).filter(Boolean) || [];
                        const uniqueNames = Array.from(new Set(itemNames));
                        
                        // 2. Resolve Main Name: Preference order
                        // 1. sale.customerName
                        // 2. first item passengerName first part
                        // 3. first unique name
                        let mainName = sale.customerName?.trim();
                        if (!mainName && sale.items?.[0]?.passengerName) {
                          mainName = sale.items[0].passengerName.split(',')[0].trim();
                        }
                        if (!mainName && uniqueNames.length > 0) {
                          mainName = uniqueNames[0];
                        }
                        mainName = mainName || '-';

                        // 3. Count others
                        const othersCount = uniqueNames.filter(n => n.toLowerCase() !== mainName!.toLowerCase()).length;

                        return (
                          <>
                            <span className="font-bold text-gray-900 dark:text-gray-100 uppercase truncate max-w-[150px]" title={mainName}>
                              {mainName}
                            </span>
                            {othersCount > 0 && (
                              <span className="text-[10px] font-black text-cyan-500 dark:text-cyan-400 mt-0.5">
                                + {othersCount} {othersCount === 1 ? 'Passageiro' : 'Passageiros'}
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </td>

                  {/* 5. Valor da Venda */}
                  <td className="px-6 py-3 text-sm font-bold text-gray-800 dark:text-gray-200">
                    {(currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente' || sale.emissor === `${currentUser?.name} ${currentUser?.lastName || ''}`.trim())
                      ? fmt(sale.totalValue) : '••••••'}
                  </td>

                  {/* 6. Custo Total */}
                  <td className="px-6 py-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                    {(currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente' || sale.emissor === `${currentUser?.name} ${currentUser?.lastName || ''}`.trim())
                      ? fmt(sale.totalCost) : '••••••'}
                  </td>

                  {/* 6.1 Comissão Total */}
                  <td className="px-6 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 text-center">
                    {(currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente' || sale.emissor === `${currentUser?.name} ${currentUser?.lastName || ''}`.trim())
                      ? fmt(sale.items?.reduce((sum, i) => sum + (i.additionalCosts || 0), 0) || 0) : '••••••'}
                  </td>

                  {/* 6.2 Emissor */}
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center">
                      <span className="px-3 py-1 bg-gray-50/50 dark:bg-slate-800/50 text-[#3b82f6] dark:text-blue-400 font-black text-[10px] uppercase tracking-wider rounded-lg border border-gray-100 dark:border-slate-700/50 shadow-sm" title={sale.emissor || '-'}>
                        {sale.emissor || '-'}
                      </span>
                    </div>
                  </td>

                  {/* 6.5 Fornecedor */}
                  <td className="px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    <span className="truncate max-w-[120px] block" title={sale.items?.map(i => i.vendor).filter(Boolean).join(', ')}>
                      {sale.items?.map(i => i.vendor).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', ') || '-'}
                    </span>
                  </td>

                  {/* 7. Modelo da Venda */}
                  <td className="px-6 py-3">
                    <select 
                      className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md uppercase border-none outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      value={sale.items && sale.items[0]?.saleModel ? sale.items[0].saleModel : 'Revenda'}
                      disabled={currentUser?.role !== 'Administrador' && currentUser?.role !== 'Gerente' && sale.emissor !== `${currentUser?.name} ${currentUser?.lastName || ''}`.trim()}
                      onChange={(e) => {
                        const newModel = e.target.value;
                        const updatedItems = sale.items?.map(item => ({ 
                          ...item, 
                          saleModel: newModel 
                        })) || [];
                        onUpdateSale(sale.id, { 
                          items: updatedItems 
                        });
                      }}
                    >
                      <option value="Customizado">Customizado</option>
                      <option value="Comissão direta">Comissão direta</option>
                      <option value="Comissão com repasse">Comissão com repasse</option>
                      <option value="Revenda">Revenda</option>
                    </select>
                  </td>

                  {/* 8. Status Custo */}
                  <td className="px-6 py-3">
                    <select 
                      className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase border-none outline-none cursor-pointer transition-colors ${
                        sale.costStatus === 'Pago' 
                          ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                      }`}
                      value={sale.costStatus || 'Pendente'}
                      disabled={currentUser?.role !== 'Administrador' && currentUser?.role !== 'Gerente' && sale.emissor !== `${currentUser?.name} ${currentUser?.lastName || ''}`.trim()}
                      onChange={(e) => onUpdateSale(sale.id, { costStatus: e.target.value as any })}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Pago">Pago</option>
                    </select>
                  </td>

                  {/* 9. Status Venda */}
                  <td className="px-6 py-3">
                    <select 
                      className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase border-none outline-none cursor-pointer transition-colors ${
                        sale.saleStatus === 'Recebido' 
                          ? 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' 
                          : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                      }`}
                      value={sale.saleStatus || 'Pendente'}
                      disabled={currentUser?.role !== 'Administrador' && currentUser?.role !== 'Gerente' && sale.emissor !== `${currentUser?.name} ${currentUser?.lastName || ''}`.trim()}
                      onChange={(e) => onUpdateSale(sale.id, { saleStatus: e.target.value as any })}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Recebido">Recebido</option>
                      <option value="Parcial">Parcial</option>
                      <option value="Atrasado">Atrasado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>

                   {/* 9.5 Produto */}
                  <td className="px-6 py-3">
                    <div className="flex justify-center flex-wrap gap-1 max-w-[120px] mx-auto">
                      {(() => {
                        const types = Array.from(new Set(sale.items?.map(i => i.type).filter(Boolean) || []));
                        const labels: Record<string, string> = {
                          passagem: 'Passagem',
                          hospedagem: 'Hospedagem',
                          seguro: 'Seguro',
                          aluguel: 'Aluguel',
                          adicionais: 'Adicionais'
                        };
                        const colors: Record<string, string> = {
                          passagem: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20',
                          hospedagem: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20',
                          seguro: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-500/20',
                          aluguel: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20',
                          adicionais: 'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-500/20'
                        };
                        
                        return types.length > 0 ? types.map(t => (
                          <span key={t} className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter whitespace-nowrap ${colors[t] || colors.passagem}`}>
                            {labels[t] || t}
                          </span>
                        )) : <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 italic">N/A</span>;
                      })()}
                    </div>
                  </td>

                  {/* 10. Bilhetes */}
                  <td className="px-6 py-3">
                    <div className="flex justify-center gap-1.5 flex-wrap max-w-[120px] mx-auto">
                      {sale.items && sale.items.flatMap(item => [
                        item.ticket_url ? { url: item.ticket_url, label: 'B1' } : null,
                        item.ticket_url2 ? { url: item.ticket_url2, label: 'B2' } : null
                      ]).filter(Boolean).map((ticket: any, idx) => (
                        <a 
                          key={idx}
                          href={ticket.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all shadow-sm ${
                            ticket.label === 'B1' 
                              ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20' 
                              : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-500/20'
                          }`}
                          title={`Ver Bilhete ${ticket.label}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      ))}
                      {(!sale.items || !sale.items.some(item => item.ticket_url || item.ticket_url2)) && (
                        <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 italic">Nenhum</span>
                      )}
                    </div>
                  </td>

                  {/* 11. Ações */}
                  <td className="px-6 py-3">
                    <div className="flex gap-1 justify-end">
                      {(currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente' || sale.emissor === `${currentUser?.name} ${currentUser?.lastName || ''}`.trim()) ? (
                        <>
                          <button onClick={() => onEditSale(sale)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-purple-600 cursor-pointer transition-colors" title="Editar Venda"><Settings className="w-4 h-4" /></button>
                          <button onClick={() => onDeleteSale(sale.id)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 cursor-pointer transition-colors" title="Excluir Venda"><Trash2 className="w-4 h-4" /></button>
                        </>
                      ) : (
                        <div className="p-1.5 text-gray-300 dark:text-gray-600 italic text-[10px]">Restrito</div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSales.length === 0 && (
            <div className="p-20 text-center text-gray-400 text-sm italic">
              Nenhuma venda encontrada para {monthYearLabel}.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModelHelpOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#1e293b] rounded-[32px] w-full max-w-4xl border border-gray-100 dark:border-slate-700/50 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="p-8 border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1e293b] z-10">
                <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">Modelos de venda</h2>
                <button onClick={() => setIsModelHelpOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <p className="text-sm font-bold text-gray-400">Conheça os modelos de venda disponíveis e como cada um gera lançamentos financeiros.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CUSTOMIZADO */}
                  <div className="p-6 border border-gray-100 dark:border-slate-700/50 rounded-3xl space-y-4 hover:border-cyan-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 dark:text-gray-200">Customizado</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed">Nenhum lançamento é criado automaticamente. Os lançamentos financeiros devem ser feitos manualmente.</p>
                  </div>

                  {/* COMISSÃO DIRETA */}
                  <div className="p-6 border border-gray-100 dark:border-slate-700/50 rounded-3xl space-y-4 hover:border-cyan-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 dark:text-gray-200">Comissão direta</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed">O cliente paga diretamente o fornecedor ou consolidadora. A agência recebe apenas a comissão/lucro.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                       <span className="px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-tighter border border-green-100 dark:border-green-500/20">Receita (comissão/lucro)</span>
                    </div>
                  </div>

                  {/* COMISSÃO COM REPASSE */}
                  <div className="p-6 border border-gray-100 dark:border-slate-700/50 rounded-3xl space-y-4 hover:border-cyan-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20">
                        <RefreshCw className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 dark:text-gray-200">Comissão com repasse</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed">O cliente paga a agência, e a agência repassa o valor total ao fornecedor.</p>
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-50 dark:border-slate-700/50 mt-2">
                       <span className="px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-tighter">Entrada (Cliente)</span>
                       <span className="px-2 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-[9px] font-black uppercase tracking-tighter">Saída (Fornecedor)</span>
                       <span className="px-2 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-[9px] font-black uppercase tracking-tighter">Receita (Lucro)</span>
                    </div>
                  </div>

                  {/* REVENDA */}
                  <div className="p-6 border border-gray-100 dark:border-slate-700/50 rounded-3xl space-y-4 hover:border-cyan-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-slate-700 flex items-center justify-center text-white shadow-lg shadow-gray-500/20">
                        <ArrowLeftRight className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 dark:text-gray-200">Revenda</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed">O cliente paga a agência e a agência paga o fornecedor.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-tighter border border-green-100 dark:border-green-500/20">Receita (Total)</span>
                      <span className="px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-tighter border border-red-100 dark:border-red-500/20">Despesa (Custo)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 dark:border-slate-700/50 flex justify-end">
                <button 
                  onClick={() => setIsModelHelpOpen(false)}
                  className="px-6 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}