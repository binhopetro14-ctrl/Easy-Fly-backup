'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, CreditCard, LayoutGrid, Plus,
  ChevronLeft, ChevronRight, BarChart3, X, ArrowUpRight, ArrowDownRight, 
  Search, ArrowRight, Check, ChevronUp, AlertCircle, Plane, Filter,
  CheckCircle2, Circle, Edit2, Trash2, Calendar, MoreHorizontal, ChevronDown,
  ArrowDownLeft, ArrowUpRight as ArrowUpRightSmall, MoreVertical, FileText,
  EyeOff, Building, Banknote, PiggyBank, Coins, DollarSign, Download, 
  RotateCcw, Settings2, ShieldCheck, FolderTree, FolderPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinance } from '../hooks/useFinance';
import { useSales } from '../hooks/useSales';
import { NumericFormat } from 'react-number-format';
import { FinancialAccount, FinancialTransaction, FinancialCategory } from '../types';
import { FinancialTransactionModal } from './FinancialTransactionModal';
import { AccountModal } from './AccountModal';
import { DeleteAccountModal } from './DeleteAccountModal';
import { CategoryModal } from './CategoryModal';

export function FinancialView() {
  const { 
    accounts, transactions, categories, settings, loading, 
    saveTransaction, deleteTransaction, saveAccount, deleteAccount,
    saveCategory, deleteCategory, saveSettings, recalculateBalances 
  } = useFinance();
  const { sales } = useSales();
  const [activeTab, setActiveTab] = useState<'Visão Geral' | 'Lançamentos' | 'Contas' | 'Configurações'>('Visão Geral');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<FinancialAccount | undefined>(undefined);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [accountToDeleteId, setAccountToDeleteId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FinancialCategory | undefined>(undefined);
  const [categoryMenuId, setCategoryMenuId] = useState<string | null>(null);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(null);
  
  // --- FILTROS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Receita' | 'Despesa'>('Todos');
  const [accountFilter, setAccountFilter] = useState('Todas as Contas');
  const [categoryFilter, setCategoryFilter] = useState('Todas as Categorias');
  const [statusFilter, setStatusFilter] = useState('Todos os Status');
  
  // --- CONFIGURAÇÕES ---
  const [tempSettings, setTempSettings] = useState(settings);
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<'Despesa' | 'Receita'>('Despesa');
  const [showOnlyActiveCategories, setShowOnlyActiveCategories] = useState(true);
  
  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  // --- FILTRAGEM E CÁLCULOS ---
  const currentMonthSales = useMemo(() => {
    return sales.filter(s => {
      const d = new Date(s.saleDate);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  }, [sales, currentDate]);

  const totalReceitas = useMemo(() => {
    const fromSales = currentMonthSales.reduce((sum, s) => sum + (s.totalValue || 0), 0);
    const fromTransactions = transactions
      .filter(t => t.type === 'Receita' && new Date(t.dueDate || t.createdAt).getMonth() === currentDate.getMonth())
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return fromSales + fromTransactions;
  }, [currentMonthSales, transactions, currentDate]);

  const totalDespesas = useMemo(() => {
    const fromTransactions = transactions
      .filter(t => t.type === 'Despesa' && new Date(t.dueDate || t.createdAt).getMonth() === currentDate.getMonth())
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return fromTransactions;
  }, [transactions, currentDate]);

  const saldoPeriodo = totalReceitas - totalDespesas;

  const ativos = useMemo(() => accounts.filter(a => a.type === 'Ativo').reduce((sum, a) => sum + a.balance, 0), [accounts]);
  const passivos = useMemo(() => accounts.filter(a => a.type === 'Passivo').reduce((sum, a) => sum + a.balance, 0), [accounts]);
  const totalGeralContas = useMemo(() => accounts.reduce((sum, a) => sum + a.balance, 0), [accounts]);

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  const renderAccountIcon = (iconName: string | undefined, color: string | undefined) => {
    const iconStyle = { color: color || '#6366f1' };
    const bgStyle = { backgroundColor: `${color || '#6366f1'}15` }; 

    switch (iconName) {
      case 'Building': return <div style={bgStyle} className="p-3 rounded-2xl"><Building style={iconStyle} className="w-5 h-5" /></div>;
      case 'CreditCard': return <div style={bgStyle} className="p-3 rounded-2xl"><CreditCard style={iconStyle} className="w-5 h-5" /></div>;
      case 'Banknote': return <div style={bgStyle} className="p-3 rounded-2xl"><Banknote style={iconStyle} className="w-5 h-5" /></div>;
      case 'PiggyBank': return <div style={bgStyle} className="p-3 rounded-2xl"><PiggyBank style={iconStyle} className="w-5 h-5" /></div>;
      case 'TrendingUp': return <div style={bgStyle} className="p-3 rounded-2xl"><TrendingUp style={iconStyle} className="w-5 h-5" /></div>;
      case 'Coins': return <div style={bgStyle} className="p-3 rounded-2xl"><Coins style={iconStyle} className="w-5 h-5" /></div>;
      case 'DollarSign': return <div style={bgStyle} className="p-3 rounded-2xl"><DollarSign style={iconStyle} className="w-5 h-5" /></div>;
      default: return <div style={bgStyle} className="p-3 rounded-2xl"><Wallet style={iconStyle} className="w-5 h-5" /></div>;
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-20px)] bg-[#f8fafc] dark:bg-slate-950 overflow-hidden text-slate-800 dark:text-slate-100">
      {/* HEADER */}
      <div className="bg-[#19727d] text-white p-5 md:px-10 md:py-6 rounded-b-[32px] shadow-2xl relative overflow-hidden shrink-0 border-b-2 border-[#145d66]/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-none">Dashboard Financeiro</h1>
            <p className="text-cyan-100 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-80 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Controle Inteligente de Fluxo de Caixa
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsTransactionModalOpen(true)}
              className="px-5 py-2.5 bg-white text-[#19727d] text-[10px] font-black rounded-xl hover:bg-cyan-50 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              NOVO LANÇAMENTO
            </button>

            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-xl p-1 border border-white/10">
              <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/10 rounded-lg transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-5 font-black text-[10px] uppercase tracking-widest min-w-[120px] text-center">
                {monthName}
              </span>
              <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/10 rounded-lg transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="px-8 md:px-12 mt-[-20px] shrink-0 z-10">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800/50 p-1 flex items-center gap-1 overflow-x-auto">
          {['Visão Geral', 'Lançamentos', 'Contas', 'Configurações'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-[#19727d] text-white shadow-lg' 
                  : 'text-slate-400 hover:text-[#19727d] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#19727d transparent' }}>
        {activeTab === 'Visão Geral' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Lançamentos do Período</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="RECEITAS" value={totalReceitas} color="emerald" icon={<TrendingUp className="w-3.5 h-3.5" />} />
                <StatCard label="DESPESAS" value={totalDespesas} color="rose" icon={<TrendingDown className="w-3.5 h-3.5" />} />
                <StatCard label="SALDO PERÍODO" value={saldoPeriodo} color="cyan" icon={<Wallet className="w-3.5 h-3.5" />} isBalance />
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Contas Financeiras</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="ATIVOS" value={ativos} color="emerald" icon={<ArrowUpRight className="w-3.5 h-3.5" />} />
                <StatCard label="PASSIVOS" value={passivos} color="rose" icon={<ArrowDownRight className="w-3.5 h-3.5" />} />
                <StatCard label="BALANÇO PATRIMONIAL" value={ativos - passivos} color="indigo" icon={<CreditCard className="w-3.5 h-3.5" />} />
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <ChartCard 
                title="Despesas por Categoria" 
                subtitle="Situação projetada" 
                icon={<TrendingDown className="w-12 h-12 opacity-10" />} 
                emptyMessage="Nenhuma despesa no período"
              />
              <ChartCard 
                title="Receitas por Categoria" 
                subtitle="Situação projetada" 
                icon={<TrendingUp className="w-12 h-12 opacity-10" />} 
                emptyMessage="Nenhuma receita no período"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              <StatusListCard 
                title="Contas a Pagar" 
                total={totalDespesas} 
                color="rose" 
                icon={<TrendingDown className="w-4 h-4 text-rose-500" />}
                emptyMessage="Nenhuma conta a pagar no período"
              />
              <StatusListCard 
                title="Contas a Receber" 
                total={totalReceitas} 
                color="emerald" 
                icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
                emptyMessage="Nenhuma conta a receber no período"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'Lançamentos' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px] relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#19727d] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar lançamento..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
                />
              </div>

              <div className="flex p-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                {(['Todos', 'Despesa', 'Receita'] as const).map(type => (
                  <button 
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-6 py-2 text-[10px] font-black rounded-xl transition-all flex items-center gap-2 ${
                      typeFilter === type ? 'bg-[#19727d] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setIsTransactionModalOpen(true)}
                className="bg-[#6b21a8] hover:bg-[#581c87] text-white px-6 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95 ml-auto"
              >
                <Plus className="w-4 h-4" />
                NOVO LANÇAMENTO
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden min-h-[400px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                    <tr>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center w-20">PAGO</th>
                      <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">DATA</th>
                      <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">DESCRIÇÃO</th>
                      <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">CATEGORIA</th>
                      <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">CONTA</th>
                      <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">VALOR</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center w-24">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {transactions
                      .filter(t => {
                        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesType = typeFilter === 'Todos' || t.type === typeFilter;
                        return matchesSearch && matchesType;
                      })
                      .map(t => {
                        const account = accounts.find(a => a.id === t.accountId);
                        return (
                          <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                            <td className="px-8 py-5 text-center">
                              {t.status === 'Pago' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" strokeWidth={3} />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-200 hover:text-emerald-500 cursor-pointer mx-auto transition-colors" strokeWidth={3} />
                              )}
                            </td>
                            <td className="px-6 py-5 text-[11px] font-black text-slate-700 dark:text-slate-200">
                              {new Date(t.dueDate || t.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-5 text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-tight">
                              {t.description}
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {t.category}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase">
                              {account?.name || 'Geral'}
                            </td>
                            <td className={`px-6 py-5 text-right text-xs font-black ${t.type === 'Receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              <NumericFormat 
                                value={t.amount} 
                                displayType="text" 
                                prefix={t.type === 'Receita' ? '+ R$ ' : '- R$ '} 
                                thousandSeparator="." 
                                decimalSeparator="," 
                                decimalScale={2} 
                                fixedDecimalScale 
                              />
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                                <button onClick={() => deleteTransaction(t.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Contas' && (
          <div className="space-y-6 flex flex-col min-h-[60vh]">
            <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl"><Wallet className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Gerenciar Contas</h3>
                  <p className="text-[10px] font-bold text-slate-400">({accounts.length} contas)</p>
                </div>
              </div>
              <button 
                onClick={() => { setEditingAccount(undefined); setIsAccountModalOpen(true); }}
                className="bg-[#6b21a8] hover:bg-[#581c87] text-white px-6 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                NOVA CONTA
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {accounts.map(account => (
                <div 
                  key={account.id} 
                   style={{ borderTop: `4px solid ${account.color || '#8b5cf6'}` }}
                  className={`bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden group relative flex flex-col transition-all ${
                    account.status === 'Inativo' ? 'opacity-60 grayscale-[0.5]' : ''
                  }`}
                >
                  <div className="p-6 space-y-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {renderAccountIcon(account.icon, account.color)}
                        <div className="space-y-0.5">
                          <h4 className="font-black text-xs text-slate-700 dark:text-white uppercase tracking-tight">{account.name}</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{account.category}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === account.id ? null : account.id); }}
                          className="p-1.5 text-slate-300 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-all"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {menuOpenId === account.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)} />
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-10 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-1.5 z-50 overflow-hidden"
                              >
                                <button 
                                  onClick={() => { setEditingAccount(account); setIsAccountModalOpen(true); setMenuOpenId(null); }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all uppercase tracking-widest"
                                >
                                  <Edit2 className="w-3.5 h-3.5" /> Editar
                                </button>
                                <button 
                                  onClick={async () => {
                                    const newStatus = account.status === 'Ativo' ? 'Inativo' : 'Ativo';
                                    await saveAccount({ ...account, status: newStatus });
                                    setMenuOpenId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all uppercase tracking-widest"
                                >
                                  <EyeOff className="w-3.5 h-3.5" /> {account.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                                </button>
                                <div className="h-px bg-slate-50 dark:bg-slate-700/50 my-1.5 mx-2" />
                                <button 
                                  onClick={() => {
                                    setAccountToDeleteId(account.id);
                                    setIsDeleteAccountModalOpen(true);
                                    setMenuOpenId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all uppercase tracking-widest"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Excluir
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Saldo atual</p>
                      <div className="text-xl font-black text-emerald-500 tracking-tight pl-1">
                        <NumericFormat 
                          value={account.balance} 
                          displayType="text" 
                          prefix="R$ " 
                          thousandSeparator="." 
                          decimalSeparator="," 
                          decimalScale={2} 
                          fixedDecimalScale 
                        />
                      </div>
                    </div>

                    <button className="w-full py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest">
                       <FileText className="w-3.5 h-3.5" /> Extrato
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <div className="bg-purple-100/50 dark:bg-purple-900/10 p-6 rounded-[32px] border border-purple-200/50 dark:border-purple-800/30 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl text-purple-600 shadow-sm"><Wallet className="w-4 h-4" /></div>
                  <h4 className="text-xs md:text-sm font-black text-slate-700 dark:text-purple-100 uppercase tracking-tight">Saldo Total de Todas as Contas</h4>
                </div>
                <div className="text-xl md:text-2xl font-black text-emerald-500 tracking-tighter">
                  <NumericFormat 
                    value={totalGeralContas} 
                    displayType="text" 
                    prefix="R$ " 
                    thousandSeparator="." 
                    decimalSeparator="," 
                    decimalScale={2} 
                    fixedDecimalScale 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Configurações' && (
          <div className="space-y-6">
            {/* CONFIGURAÇÕES GLOBAIS */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-slate-800">
              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Configurações do Financeiro</h3>
                <p className="text-sm text-slate-400 font-medium">Defina valores padrão para o módulo financeiro e emissões</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Conta Padrão para Receitas</label>
                  <select 
                    value={tempSettings.defaultIncomeAccountId || ''}
                    onChange={e => setTempSettings({ ...tempSettings, defaultIncomeAccountId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-[#19727d]/10 rounded-2xl px-5 py-4 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none transition-all"
                  >
                    <option value="">Nenhuma conta padrão</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Conta Padrão para Despesas</label>
                  <select 
                    value={tempSettings.defaultExpenseAccountId || ''}
                    onChange={e => setTempSettings({ ...tempSettings, defaultExpenseAccountId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-[#19727d]/10 rounded-2xl px-5 py-4 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none transition-all"
                  >
                    <option value="">Nenhuma conta padrão</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => saveSettings(tempSettings)}
                    className="flex items-center gap-3 px-8 py-4 bg-purple-900 hover:bg-purple-950 text-white rounded-2xl shadow-xl shadow-purple-500/10 transition-all active:scale-95 text-[11px] font-black uppercase tracking-widest"
                  >
                    <ShieldCheck className="w-4 h-4" /> Salvar Configurações
                  </button>
                </div>
              </div>
            </div>

            {/* RECALCULAR SALDOS */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-slate-800">
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Recalcular Saldos</h3>
                <p className="text-sm text-slate-400 font-medium">Sincroniza os saldos das contas com o histórico de transações.</p>
              </div>
              <button 
                onClick={recalculateBalances}
                className="flex items-center gap-3 px-6 py-3.5 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-white rounded-2xl transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest"
              >
                <RotateCcw className="w-4 h-4" /> Recalcular Saldos
              </button>
            </div>

            {/* GERENCIADOR DE CATEGORIAS */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-slate-800 flex flex-col gap-8">
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Gerenciador de Categorias</h3>
                <p className="text-sm text-slate-400 font-medium">Configure Grupos e Subcategorias</p>
              </div>
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-3 space-y-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setCategoryTypeFilter('Despesa')}
                      className={`flex items-center justify-between px-5 py-4 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${
                        categoryTypeFilter === 'Despesa' ? 'bg-purple-900 text-white shadow-xl shadow-purple-500/20' : 'bg-slate-50 dark:bg-slate-950 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3"><ArrowDownLeft className="w-4 h-4" /> Despesas</div>
                      <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">{categories.filter(c => c.type === 'Despesa' && !c.parentId).length}</span>
                    </button>
                    <button 
                      onClick={() => setCategoryTypeFilter('Receita')}
                      className={`flex items-center justify-between px-5 py-4 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${
                        categoryTypeFilter === 'Receita' ? 'bg-purple-900 text-white shadow-xl shadow-purple-500/20' : 'bg-slate-50 dark:bg-slate-950 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2"><ArrowUpRightSmall className="w-4 h-4" /> Receitas</div>
                      <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-[10px] text-slate-500">{categories.filter(c => c.type === 'Receita' && !c.parentId).length}</span>
                    </button>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ativas</span>
                    <button 
                      onClick={() => setShowOnlyActiveCategories(!showOnlyActiveCategories)}
                      className={`w-10 h-5 rounded-full transition-all relative ${showOnlyActiveCategories ? 'bg-purple-900' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${showOnlyActiveCategories ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-600 dark:text-white uppercase tracking-widest hover:border-slate-200 transition-all active:scale-95">
                      <Download className="w-4 h-4" />
                      Exportar categorias
                    </button>
                    <button 
                      onClick={() => { setEditingCategory(undefined); setIsCategoryModalOpen(true); }}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-900 hover:bg-purple-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-500/10 active:scale-95"
                    >
                      <Plus className="w-4 h-4" strokeWidth={3} />
                      Nova Categoria
                    </button>
                  </div>
                </div>
                <div className="col-span-9 bg-slate-50/50 dark:bg-slate-950/20 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {categories
                      .filter(c => c.type === categoryTypeFilter && !c.parentId && (!showOnlyActiveCategories || c.status === 'Ativo'))
                      .map((cat, idx) => (
                        <div key={cat.id} className="group">
                          <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <div className="flex items-center gap-6">
                              <span className="text-[10px] font-black text-slate-300">{String(idx + 1).padStart(2, '0')}</span>
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#6366f1' }} />
                                <span className="text-sm font-black text-slate-700 dark:text-white tracking-tight">{cat.name}</span>
                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-[9px] font-bold text-slate-400">
                                  {categories.filter(sc => sc.parentId === cat.id).length}
                                </span>
                              </div>
                            </div>
                            <div className="relative">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setCategoryMenuId(categoryMenuId === cat.id ? null : cat.id); }}
                                className="p-2 text-slate-300 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-all"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              <AnimatePresence>
                                {categoryMenuId === cat.id && (
                                  <>
                                    <div className="fixed inset-0 z-40" onClick={() => setCategoryMenuId(null)} />
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                      className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-1.5 z-50 overflow-hidden"
                                    >
                                      <button 
                                        onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); setCategoryMenuId(null); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all uppercase tracking-widest"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" /> Editar
                                      </button>
                                      <button 
                                        onClick={() => { 
                                          setEditingCategory({ 
                                            name: '', 
                                            type: cat.type, 
                                            parentId: cat.id, 
                                            status: 'Ativo', 
                                            color: cat.color 
                                          } as any); 
                                          setIsCategoryModalOpen(true); 
                                          setCategoryMenuId(null); 
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all uppercase tracking-widest"
                                      >
                                        <FolderPlus className="w-3.5 h-3.5" /> Adicionar Subcategoria
                                      </button>
                                      <div className="h-px bg-slate-50 dark:bg-slate-700/50 my-1.5 mx-2" />
                                      <button 
                                        onClick={() => {
                                          setCategoryToDeleteId(cat.id);
                                          setIsDeleteCategoryModalOpen(true);
                                          setCategoryMenuId(null);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all uppercase tracking-widest"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                                      </button>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-slate-900/20">
                            {categories
                              .filter(sc => sc.parentId === cat.id && (!showOnlyActiveCategories || sc.status === 'Ativo'))
                              .map((sub, sIdx) => (
                                <div key={sub.id} className="flex items-center justify-between pl-16 pr-6 p-4 border-t border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all group/sub">
                                  <div className="flex items-center gap-4">
                                    <div className="w-4 h-4 border-l-2 border-b-2 border-slate-200 dark:border-slate-700 rounded-bl-lg -mt-2" />
                                    <span className="text-[10px] font-black text-slate-300">{(idx + 1)}.{String(sIdx + 1).padStart(2, '0')}</span>
                                    <span className="text-[12px] font-bold text-slate-600 dark:text-slate-300 tracking-tight">{sub.name}</span>
                                  </div>
                                  <div className="relative">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setCategoryMenuId(categoryMenuId === sub.id ? null : sub.id); }}
                                      className="p-1.5 text-slate-200 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-all opacity-0 group-hover/sub:opacity-100"
                                    >
                                      <MoreVertical className="w-3.5 h-3.5" />
                                    </button>
                                    <AnimatePresence>
                                      {categoryMenuId === sub.id && (
                                        <>
                                          <div className="fixed inset-0 z-40" onClick={() => setCategoryMenuId(null)} />
                                          <motion.div 
                                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                            className="absolute right-0 top-8 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-1 z-50 overflow-hidden"
                                          >
                                            <button 
                                              onClick={() => { setEditingCategory(sub); setIsCategoryModalOpen(true); setCategoryMenuId(null); }}
                                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[10px] font-black text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all uppercase tracking-widest"
                                            >
                                              <Edit2 className="w-3 h-3" /> Editar
                                            </button>
                                            <div className="h-px bg-slate-50 dark:bg-slate-700/50 my-1 mx-2" />
                                            <button 
                                              onClick={() => {
                                                setCategoryToDeleteId(sub.id);
                                                setIsDeleteCategoryModalOpen(true);
                                                setCategoryMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[10px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all uppercase tracking-widest"
                                            >
                                              <Trash2 className="w-3 h-3" /> Excluir
                                            </button>
                                          </motion.div>
                                        </>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isTransactionModalOpen && (
          <FinancialTransactionModal 
            onClose={() => setIsTransactionModalOpen(false)}
            onSave={saveTransaction}
            accounts={accounts}
          />
        )}
        {isAccountModalOpen && (
          <AccountModal 
            onClose={() => setIsAccountModalOpen(false)}
            onSave={saveAccount}
            account={editingAccount}
          />
        )}
        {isDeleteAccountModalOpen && accountToDeleteId && (
          <DeleteAccountModal 
            onClose={() => {
              setIsDeleteAccountModalOpen(false);
              setAccountToDeleteId(null);
            }}
            onConfirm={async () => {
              await deleteAccount(accountToDeleteId);
            }}
          />
        )}
        {isCategoryModalOpen && (
          <CategoryModal 
            onClose={() => setIsCategoryModalOpen(false)}
            onSave={async (cat) => { await saveCategory(cat); }}
            category={editingCategory}
            categories={categories}
            defaultType={categoryTypeFilter}
          />
        )}
        {isDeleteCategoryModalOpen && categoryToDeleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteCategoryModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2"><Trash2 className="w-8 h-8" /></div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Excluir Categoria?</h3>
                <p className="text-xs font-medium text-slate-400">Esta ação não pode ser desfeita. Todas as subcategorias vinculadas também serão removidas.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteCategoryModalOpen(false)} className="flex-1 px-6 py-4 bg-slate-50 text-slate-400 text-[10px] font-black rounded-2xl uppercase tracking-widest">Cancelar</button>
                <button onClick={async () => { await deleteCategory(categoryToDeleteId); setIsDeleteCategoryModalOpen(false); }} className="flex-1 px-6 py-4 bg-rose-500 text-white text-[10px] font-black rounded-2xl shadow-lg shadow-rose-500/20 uppercase tracking-widest">Confirmar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, color, icon, isBalance }: any) {
  const iconBgMap: any = {
    emerald: 'bg-emerald-500/10 text-emerald-500',
    rose: 'bg-rose-500/10 text-rose-500',
    cyan: 'bg-cyan-500/10 text-cyan-500',
    indigo: 'bg-[#19727d]/10 text-[#19727d]',
  };

  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between min-h-[90px]">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        <div className={`p-1 rounded-md ${iconBgMap[color]}`}>{icon}</div>
      </div>
      <div className={`text-lg font-black tracking-tight ${value < 0 && !isBalance ? 'text-rose-500' : (value > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100')}`}>
        <NumericFormat value={value} displayType="text" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale />
      </div>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, icon, emptyMessage }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm min-h-[220px] flex flex-col">
      <div className="px-5 py-4 border-b border-gray-50 dark:border-slate-800/50 flex justify-between items-start">
        <div>
          <h3 className="text-[11px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight">{title}</h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <BarChart3 className="w-3.5 h-3.5" />
          <Check className="w-3.5 h-3.5" />
          <ChevronUp className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-300">
        <div className="relative group/icon">
          <div className="absolute inset-0 bg-gray-100 dark:bg-slate-800 rounded-full scale-150 blur-xl opacity-0 group-hover/icon:opacity-50 transition-all" />
          {icon}
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">{emptyMessage || `Nenhum registro no período`}</p>
      </div>
    </div>
  );
}

function StatusListCard({ title, total, color, emptyMessage, icon }: any) {
  const borderColor = color === 'rose' ? 'border-l-rose-500' : 'border-l-emerald-500';
  const textColor = color === 'rose' ? 'text-rose-500' : 'text-emerald-500';
  
  return (
    <div className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 border-l-[4px] ${borderColor} rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-[140px]`}>
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-[11px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight">{title}</h3>
        </div>
        <span className={`text-xs font-black ${textColor}`}>
          <NumericFormat value={total} displayType="text" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale />
        </span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4 border-t border-gray-50 dark:border-slate-800/50">
        <div className="w-8 h-8 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
          <AlertCircle className="w-4 h-4 text-gray-300" />
        </div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{emptyMessage || `Sem lançamentos`}</p>
      </div>
    </div>
  );
}
