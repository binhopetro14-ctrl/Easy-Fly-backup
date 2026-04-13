'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Download, ChevronLeft, ChevronRight, 
  MoreVertical, Wallet, Clock, AlertTriangle, CheckCircle2,
  Calendar, Filter, FileSpreadsheet, ChevronDown, Trash, Edit,
  TrendingDown, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NumericFormat } from 'react-number-format';
import { parseISO, isValid, format } from 'date-fns';
import { FinancialTransaction, FinancialAccount, FinancialCategory } from '../types';
import { Truck } from 'lucide-react';

interface CashFlowControlViewProps {
  transactions: FinancialTransaction[];
  accounts: FinancialAccount[];
  categories: FinancialCategory[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: FinancialTransaction) => void;
  onDeleteTransaction: (transaction: FinancialTransaction) => void;
  onSaveTransaction: (transaction: FinancialTransaction) => void;
}

export function CashFlowControlView({
  transactions,
  accounts,
  categories,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onSaveTransaction
}: CashFlowControlViewProps) {
  const [activeTab, setActiveTab] = useState<'pagar' | 'receber'>('pagar');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth());
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showOnlyMonthly, setShowOnlyMonthly] = useState(false);
  const [showAllMonths, setShowAllMonths] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = [2024, 2025, 2026, 2027];

  // Filtragem
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const dateStr = t.dueDate || t.createdAt;
      const date = dateStr ? parseISO(dateStr.split('T')[0]) : new Date();
      const isCorrectType = activeTab === 'pagar' ? t.type === 'Despesa' : t.type === 'Receita';
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesMonth = showAllMonths || date.getMonth() === monthFilter;
      const matchesYear = showAllMonths || date.getFullYear() === yearFilter;
      const matchesMonthly = !showOnlyMonthly || t.recurrence === 'Mensal' || t.recurrence === 'monthly';

      return isCorrectType && matchesSearch && matchesCategory && matchesMonth && matchesYear && matchesMonthly;
    });
  }, [transactions, activeTab, searchTerm, categoryFilter, monthFilter, yearFilter, showOnlyMonthly, showAllMonths]);

  // Cálculos de Resumo
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return filteredTransactions.reduce((acc, t) => {
      const dueDate = t.dueDate ? new Date(t.dueDate) : null;
      const amount = t.amount || 0;

      acc.total += amount;
      if (t.status === 'Pago') {
        acc.pagas += amount;
      } else {
        acc.pendente += amount;
        if (dueDate && dueDate < today) {
          acc.vencidas += amount;
        }
      }
      return acc;
    }, { total: 0, pendente: 0, vencidas: 0, pagas: 0 });
  }, [filteredTransactions]);

  // Paginação
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportExcel = () => {
    const headers = ['Descrição', 'Valor', 'Vencimento', 'Status', 'Categoria', 'Recorrência'];
    const csvContent = [
      headers.join(';'),
      ...filteredTransactions.map(t => [
        t.description,
        t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        t.dueDate ? new Date(t.dueDate).toLocaleDateString('pt-BR') : '-',
        t.status,
        categories.find(c => c.id === t.category)?.name || t.category || '-',
        t.recurrence || 'Única'
      ].join(';'))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `controle_caixa_${activeTab}_${months[monthFilter]}_${yearFilter}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 overflow-y-auto">
      {/* Top Bar Navigation */}
      <div className="p-6 md:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
            <button 
              onClick={() => setActiveTab('pagar')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'pagar' 
                  ? 'bg-[#19727d] text-white shadow-lg shadow-[#19727d]/20' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Contas a Pagar
            </button>
            <button 
              onClick={() => setActiveTab('receber')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'receber' 
                  ? 'bg-[#19727d] text-white shadow-lg shadow-[#19727d]/20' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Contas a Receber
            </button>

            <div className="w-[1px] h-6 bg-gray-200 dark:bg-gray-800 mx-2" />

            {/* Calendário/Período Selector Compact V3 (Reduced 40%) */}
            <div className="flex items-center gap-0.5 p-0.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg shadow-gray-200/10 dark:shadow-none transition-all">
              <div className="flex items-center gap-2 pl-2 pr-1 py-1">
                <div className="p-1 bg-[#19727d]/10 rounded-lg shadow-inner-sm">
                  <Calendar className="w-3.5 h-3.5 text-[#19727d]" strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-1.5">
                  <select 
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(Number(e.target.value))}
                    disabled={showAllMonths}
                    className={`bg-transparent text-[10px] font-black text-gray-800 dark:text-white uppercase tracking-tight outline-none cursor-pointer appearance-none hover:text-[#19727d] transition-colors ${showAllMonths ? 'opacity-30' : ''}`}
                  >
                    {months.map((m, i) => <option key={i} value={i} className="dark:bg-slate-950">{m}</option>)}
                  </select>
                  <span className="text-gray-200 dark:text-gray-700 font-thin text-xs">/</span>
                  <select 
                    value={yearFilter}
                    onChange={(e) => setYearFilter(Number(e.target.value))}
                    disabled={showAllMonths}
                    className={`bg-transparent text-[10px] font-black text-gray-800 dark:text-white uppercase tracking-tight outline-none cursor-pointer appearance-none hover:text-[#19727d] transition-colors ${showAllMonths ? 'opacity-30' : ''}`}
                  >
                    {years.map(y => <option key={y} value={y} className="dark:bg-slate-950">{y}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="w-[1px] h-6 bg-gray-100 dark:bg-slate-800 mx-1.5" />
              
              <button 
                onClick={() => setShowAllMonths(!showAllMonths)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest ${
                  showAllMonths 
                    ? 'bg-[#19727d] text-white shadow-md shadow-[#19727d]/20' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-[#19727d] hover:bg-[#19727d]/10 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`p-1 rounded-md transition-colors ${showAllMonths ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800'}`}>
                  <Filter className="w-2.5 h-2.5" />
                </div>
                {showAllMonths ? 'Todos' : 'Mensal'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>financeiro</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 dark:text-gray-300">Controle de Caixa</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#19727d] transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar registros..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#19727d]/10 transition-all"
              />
            </div>
            <div className="bg-[#19727d]/10 dark:bg-[#19727d]/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-[#19727d] dark:text-[#19727d]">
              {filteredTransactions.length} Resultados
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowOnlyMonthly(!showOnlyMonthly)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm border ${
                showOnlyMonthly 
                  ? 'bg-[#19727d] text-white border-[#19727d] shadow-[#19727d]/20' 
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <Filter className={`w-4 h-4 ${showOnlyMonthly ? 'animate-pulse' : ''}`} />
              Apenas Mensais
            </button>
            <button 
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Exportar Excel
            </button>
            <button 
              onClick={onAddTransaction}
              className="px-6 py-2.5 bg-[#19727d] hover:bg-[#15616a] text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#19727d]/20 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Nova conta
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total" 
            value={stats.total} 
            icon={<Wallet className="w-6 h-6 text-[#19727d]" />} 
            bg="bg-[#19727d]/10 dark:bg-[#19727d]/20"
            color="text-gray-900 dark:text-white"
          />
          <StatCard 
            label="Pendente" 
            value={stats.pendente} 
            icon={<Clock className="w-6 h-6 text-amber-500" />} 
            bg="bg-orange-50 dark:bg-orange-950/20"
            color="text-amber-600"
          />
          <StatCard 
            label="Vencidas" 
            value={stats.vencidas} 
            icon={<AlertTriangle className="w-6 h-6 text-rose-500" />} 
            bg="bg-rose-50 dark:bg-rose-950/20"
            color="text-rose-600"
          />
          <StatCard 
            label="Pagas" 
            value={stats.pagas} 
            icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />} 
            bg="bg-emerald-50 dark:bg-emerald-950/20"
            color="text-emerald-600"
          />
        </div>

        {/* List Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs">LISTAGEM</h3>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#19727d]/10 cursor-pointer min-w-[220px]"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-800/20">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">DESCRIÇÃO</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">VALOR</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">VENCIMENTO</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">STATUS</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">CATEGORIA</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">RECORRÊNCIA</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {paginatedTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t.description}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className={`text-sm font-black ${t.type === 'Receita' ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                        <NumericFormat value={t.amount} displayType="text" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale />
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        {t.dueDate ? new Date(t.dueDate).toLocaleDateString('pt-BR') : '-'}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button 
                        onClick={() => onSaveTransaction({ ...t, status: t.status === 'Pago' ? 'Pendente' : 'Pago' })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight transition-all active:scale-95 ${
                          t.status === 'Pago' 
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' 
                            : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'Pago' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
                        {t.status}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        {categories.find(c => c.id === t.category)?.name || t.category || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                        {t.recurrence || 'monthly'}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center relative">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionMenuOpen(actionMenuOpen === t.id ? null : t.id);
                          }}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                            actionMenuOpen === t.id 
                              ? 'bg-[#19727d] text-white shadow-lg shadow-[#19727d]/20 rotate-90' 
                              : 'text-gray-400 hover:text-[#19727d] hover:bg-[#19727d]/10 dark:hover:bg-indigo-900/10'
                          }`}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        <AnimatePresence>
                          {actionMenuOpen === t.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setActionMenuOpen(null)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10, x: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0, x: -10 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10, x: -10 }}
                                className="absolute right-full top-1/2 -translate-y-1/2 mr-2 z-50 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden min-w-[140px]"
                              >
                                <div className="p-1.5 flex flex-col gap-1">
                                  <button 
                                    onClick={() => {
                                      onEditTransaction(t);
                                      setActionMenuOpen(null);
                                    }}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-[#19727d]/10 hover:text-[#19727d] dark:hover:text-[#19727d] transition-all uppercase tracking-wide group"
                                  >
                                    <div className="p-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg group-hover:bg-[#19727d]/20 transition-colors">
                                      <Edit className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                                    </div>
                                    Editar
                                  </button>
                                  <button 
                                    onClick={() => {
                                      onDeleteTransaction(t);
                                      setActionMenuOpen(null);
                                    }}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all uppercase tracking-wide group"
                                  >
                                    <div className="p-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-lg group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20 transition-colors">
                                      <Trash className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                                    </div>
                                    Excluir
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-gray-400 italic text-sm">
                      Nenhum registro encontrado para este período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-1.5">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all font-bold"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                    currentPage === i + 1 
                      ? 'bg-[#19727d] text-white shadow-lg shadow-[#19727d]/20' 
                      : 'border border-gray-200 dark:border-slate-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all font-bold"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} de {filteredTransactions.length}
              </p>
              
              <div className="relative">
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-slate-50 dark:bg-slate-800 border bg-white dark:border-slate-800 rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#19727d]/10 cursor-pointer"
                >
                  <option value={5}>5 itens por página</option>
                  <option value={10}>10 itens por página</option>
                  <option value={20}>20 itens por página</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, bg, color }: { label: string, value: number, icon: React.ReactNode, bg: string, color: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-5 group hover:shadow-md transition-shadow`}>
      <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-xl font-black tracking-tight ${color}`}>
          <NumericFormat value={value} displayType="text" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale />
        </p>
      </div>
    </div>
  );
}
