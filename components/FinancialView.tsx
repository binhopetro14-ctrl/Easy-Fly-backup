'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, CreditCard, LayoutGrid, Plus,
  ChevronLeft, ChevronRight, BarChart3, X, ArrowUpRight, ArrowDownRight, 
  Search, ArrowRight, Check, ChevronUp, AlertCircle, Plane, Filter,
  CheckCircle2, Circle, Edit2, Trash2, Calendar, MoreHorizontal, ChevronDown,
  RotateCcw, Settings2, ShieldCheck, FolderTree, FolderPlus, GripVertical,
  Building, Banknote, PiggyBank, Coins, DollarSign, ArrowDownLeft, MoreVertical, Download, FileText, EyeOff
} from 'lucide-react';
const ArrowUpRightSmall = ArrowUpRight;
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { parseISO, isValid } from 'date-fns';
import { useFinance } from '../hooks/useFinance';
import { useSales } from '../hooks/useSales';
import { NumericFormat } from 'react-number-format';
import { FinancialAccount, FinancialTransaction, FinancialCategory } from '../types';
import { FinancialTransactionModal } from './FinancialTransactionModal';
import { AccountModal } from './AccountModal';
import { DeleteAccountModal } from './DeleteAccountModal';
import { DeleteTransactionModal } from './DeleteTransactionModal';
import { CategoryModal } from './CategoryModal';

import { CashFlowControlView } from './CashFlowControlView';

interface FinancialViewProps {
  subView?: 'controle' | 'contas';
}

export function FinancialView({ subView }: FinancialViewProps) {
  const { 
    accounts, transactions, categories, settings, loading, 
    saveTransaction, deleteTransaction, saveAccount, deleteAccount,
    saveCategory, deleteCategory, saveSettings, recalculateBalances, updateCategoriesOrder 
  } = useFinance();
  const { sales } = useSales();
  const [activeTab, setActiveTab] = useState<'Visão Geral' | 'Lançamentos' | 'Contas' | 'Configurações'>('Visão Geral');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // States para Modais
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
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
  const [isDeleteTransactionModalOpen, setIsDeleteTransactionModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<FinancialTransaction | null>(null);
  
  // State para Abas internas de Contas
  const [contasActiveTab, setContasActiveTab] = useState<'contas' | 'config'>('contas');
  
  // Filtros Transações
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Receita' | 'Despesa'>('Todos');
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<'Despesa' | 'Receita'>('Despesa');
  const [showOnlyActiveCategories, setShowOnlyActiveCategories] = useState(true);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  
  // Configurações Temporárias
  const [tempSettings, setTempSettings] = useState(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  // --- CÁLCULOS ---
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  const currentMonthSales = useMemo(() => {
    return sales.filter(s => {
      const d = s.saleDate ? parseISO(s.saleDate.split('T')[0]) : new Date();
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  }, [sales, currentDate]);

  const allPeriodIncomes = useMemo(() => {
    const saleIncomes = currentMonthSales.map(s => ({
      id: s.id,
      description: `Venda #${s.orderNumber || s.id.slice(0, 8)} - ${s.customerName || 'Cliente'}`,
      amount: s.totalValue || 0,
      type: 'Receita' as const,
      status: s.saleStatus === 'Recebido' ? 'Pago' : 'Pendente',
      dueDate: s.saleDate,
      createdAt: s.saleDate,
      saleId: s.id
    }));

    const manualIncomes = transactions.filter(t => {
      const dateStr = t.dueDate || t.createdAt;
      const d = dateStr ? parseISO(dateStr.split('T')[0]) : new Date();
      return t.type === 'Receita' && 
             (!t.saleId || t.category !== 'Venda de Serviços') && 
             d.getMonth() === currentDate.getMonth() &&
             d.getFullYear() === currentDate.getFullYear();
    });

    return [...saleIncomes, ...manualIncomes];
  }, [currentMonthSales, transactions, currentDate]);

  const allPeriodExpenses = useMemo(() => {
    const saleCosts = currentMonthSales
      .filter(s => (s.totalCost || 0) > 0)
      .map(s => ({
        id: `cost-${s.id}`,
        description: `Custo: Venda #${s.orderNumber || s.id.slice(0, 8)}`,
        amount: s.totalCost || 0,
        type: 'Despesa' as const,
        status: s.costStatus === 'Pago' ? 'Pago' : 'Pendente',
        dueDate: s.saleDate,
        createdAt: s.saleDate,
        saleId: s.id
      }));

    const manualExpenses = transactions.filter(t => {
      const dateStr = t.dueDate || t.createdAt;
      const d = dateStr ? parseISO(dateStr.split('T')[0]) : new Date();
      return t.type === 'Despesa' && 
             (!t.saleId || t.category !== 'Fornecedores') && 
             d.getMonth() === currentDate.getMonth() &&
             d.getFullYear() === currentDate.getFullYear();
    });

    return [...saleCosts, ...manualExpenses];
  }, [currentMonthSales, transactions, currentDate]);

  const totalReceitas = useMemo(() => allPeriodIncomes.reduce((sum, i) => sum + i.amount, 0), [allPeriodIncomes]);
  const totalDespesas = useMemo(() => allPeriodExpenses.reduce((sum, i) => sum + i.amount, 0), [allPeriodExpenses]);
  const totalDespesasRecorrentes = useMemo(() => {
    return transactions
      .filter(t => {
        const dateStr = t.dueDate || t.createdAt;
        const d = dateStr ? parseISO(dateStr.split('T')[0]) : new Date();
        return t.type === 'Despesa' && t.recurrence === 'Mensal' && d.getMonth() === currentDate.getMonth();
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [transactions, currentDate]);

  const unpaidExpenses = useMemo(() => allPeriodExpenses.filter(e => e.status !== 'Pago'), [allPeriodExpenses]);
  const unpaidIncomes = useMemo(() => allPeriodIncomes.filter(i => i.status !== 'Pago'), [allPeriodIncomes]);
  const totalUnpaidExpenses = useMemo(() => unpaidExpenses.reduce((sum, e) => sum + e.amount, 0), [unpaidExpenses]);
  const totalUnpaidIncomes = useMemo(() => unpaidIncomes.reduce((sum, i) => sum + i.amount, 0), [unpaidIncomes]);
  const saldoPeriodo = totalReceitas - totalDespesas;
  const ativos = useMemo(() => accounts.filter(a => a.type === 'Ativo').reduce((sum, a) => sum + a.balance, 0), [accounts]);
  const passivos = useMemo(() => accounts.filter(a => a.type === 'Passivo').reduce((sum, a) => sum + a.balance, 0), [accounts]);
  const totalGeralContas = useMemo(() => accounts.reduce((sum, a) => sum + a.balance, 0), [accounts]);

  // Handlers
  const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

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

  const handleReorderCategories = (newOrder: FinancialCategory[], _parentId?: string) => {
    const fullList = [...categories];
    const newItemsWithSort = newOrder.map((cat, idx) => ({
      ...cat,
      sortOrder: idx
    }));
    const updatedFullList = fullList.map(cat => {
      const updatedItem = newItemsWithSort.find(u => u.id === cat.id);
      return updatedItem || cat;
    });
    updateCategoriesOrder(updatedFullList);
  };

  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);
      await saveSettings(tempSettings);
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // --- COMPONENTES DE VIEW ---
  
  // VIEW: CONTROLE DE CAIXA
  if (subView === 'controle') {
    return (
      <div className="h-full flex flex-col relative">
        <CashFlowControlView 
          transactions={transactions}
          accounts={accounts}
          categories={categories}
          onAddTransaction={() => { setEditingTransaction(null); setIsTransactionModalOpen(true); }}
          onEditTransaction={(t) => { setEditingTransaction(t); setIsTransactionModalOpen(true); }}
          onDeleteTransaction={(t) => { setTransactionToDelete(t); setIsDeleteTransactionModalOpen(true); }}
          onSaveTransaction={saveTransaction}
        />
        {/* Modais Compartilhados */}
        <AnimatePresence>
          {isTransactionModalOpen && (
            <FinancialTransactionModal 
              onClose={() => { setIsTransactionModalOpen(false); setEditingTransaction(null); }}
              onSave={saveTransaction}
              accounts={accounts}
              categories={categories}
              initialTransaction={editingTransaction}
            />
          )}
          {isDeleteTransactionModalOpen && transactionToDelete && (
            <DeleteTransactionModal 
              onClose={() => { setIsDeleteTransactionModalOpen(false); setTransactionToDelete(null); }}
              onConfirm={async () => { if (transactionToDelete) await deleteTransaction(transactionToDelete.id); }}
              transactionDescription={transactionToDelete.description}
            />
          )}
          {/* Outros modais se necessário no controle */}
        </AnimatePresence>
      </div>
    );
  }

  // VIEW: CONTAS E CONFIGURAÇÕES
  if (subView === 'contas') {
    return (
      <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#8b5cf6 transparent' }}>
          <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#19727d]/10 text-[#19727d] rounded-2xl"><Wallet className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                    {contasActiveTab === 'contas' ? 'Gerenciar Contas Bancárias' : 'Configurações Financeiras'}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400">
                    {contasActiveTab === 'contas' ? `(${accounts.length} contas)` : 'Categorias e Preferências'}
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <button onClick={() => setContasActiveTab('contas')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${contasActiveTab === 'contas' ? 'bg-[#19727d] text-white shadow-md' : 'text-slate-400 hover:text-[#19727d]'}`}>Contas</button>
                <button onClick={() => setContasActiveTab('config')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${contasActiveTab === 'config' ? 'bg-[#19727d] text-white shadow-md' : 'text-slate-400 hover:text-[#19727d]'}`}>Configurações</button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>financeiro</span> <ChevronRight className="w-3 h-3" /> <span className="text-gray-600 dark:text-gray-300">{contasActiveTab === 'contas' ? 'Contas Bancárias' : 'Configurações'}</span>
            </div>
          </div>

          {contasActiveTab === 'contas' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {accounts.map(account => (
                <div key={account.id} style={{ borderTop: `4px solid ${account.color || '#8b5cf6'}` }} className={`bg-white dark:bg-slate-900 rounded-[24px] shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden group/card relative flex flex-col transition-all ${account.status === 'Inativo' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                  <div className="p-5 md:p-6 space-y-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {renderAccountIcon(account.icon, account.color)}
                        <div className="space-y-0.5">
                          <h4 className="font-black text-xs text-slate-700 dark:text-white uppercase tracking-tight">{account.name}</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{account.category}</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === account.id ? null : account.id); }} className="p-1.5 text-slate-300 hover:text-[#19727d] hover:bg-[#19727d]/10 rounded-lg transition-all"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                    <div className="text-xl font-black text-emerald-500 tracking-tight pl-1"><NumericFormat value={account.balance} displayType="text" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale /></div>
                  </div>
                </div>
              ))}
              <button onClick={() => { setEditingAccount(undefined); setIsAccountModalOpen(true); }} className="bg-white dark:bg-slate-900 rounded-[24px] border-2 border-dashed border-gray-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-[#19727d] hover:border-[#19727d] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[#19727d]/10 transition-all"><Plus className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Nova Conta</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
              {/* CONFIGURAÇÕES */}
              <div className="bg-white dark:bg-slate-900 rounded-[24px] p-5 md:p-6 shadow-xl border border-gray-100 dark:border-slate-800">
                <div className="mb-6"><h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight leading-tight">Configurações do Financeiro</h3><p className="text-xs text-slate-400 font-medium">Defina valores padrão para emissões e fluxo de caixa</p></div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Receitas (Conta Padrão)</label><select value={tempSettings.defaultIncomeAccountId || ''} onChange={e => setTempSettings({ ...tempSettings, defaultIncomeAccountId: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-[#19727d]/30 rounded-xl px-4 py-3 text-[11px] font-bold outline-none transition-all">{accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}</select></div>
                    <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Despesas (Conta Padrão)</label><select value={tempSettings.defaultExpenseAccountId || ''} onChange={e => setTempSettings({ ...tempSettings, defaultExpenseAccountId: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-[#19727d]/30 rounded-xl px-4 py-3 text-[11px] font-bold outline-none transition-all">{accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}</select></div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={handleSaveSettings} disabled={isSavingSettings} className="flex items-center gap-2 px-6 py-3 bg-[#19727d] hover:bg-[#15616a] text-white rounded-xl shadow-xl shadow-[#19727d]/10 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
                      {isSavingSettings ? 'Salvando...' : <><ShieldCheck className="w-4 h-4" /> Salvar Configurações</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* GERENCIADOR DE CATEGORIAS */}
              <div className="bg-white dark:bg-slate-900 rounded-[24px] p-5 md:p-6 shadow-xl border border-gray-100 dark:border-slate-800 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight leading-tight">Gerenciador de Categorias</h3>
                    <p className="text-xs text-slate-400 font-medium">Arraste para reordenar grupos e subcategorias</p>
                  </div>
                  <button 
                    onClick={() => { setEditingCategory(undefined); setIsCategoryModalOpen(true); }}
                    className="px-6 py-3 bg-[#19727d] hover:bg-[#15616a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#19727d]/10 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={3} /> Nova Categoria
                  </button>
                </div>
                
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-4 flex flex-col gap-2">
                    <button 
                      onClick={() => setCategoryTypeFilter('Despesa')} 
                      className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${categoryTypeFilter === 'Despesa' ? 'bg-[#19727d] text-white shadow-xl shadow-[#19727d]/20' : 'bg-slate-50 dark:bg-slate-950 text-slate-400'}`}
                    >
                      <div className="flex items-center gap-3"><ArrowDownLeft className="w-3.5 h-3.5" /> Despesas</div>
                      <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[9px]">{categories.filter(c => c.type === 'Despesa' && !c.parentId).length}</span>
                    </button>
                    <button 
                      onClick={() => setCategoryTypeFilter('Receita')} 
                      className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${categoryTypeFilter === 'Receita' ? 'bg-[#19727d] text-white shadow-xl shadow-[#19727d]/20' : 'bg-slate-50 dark:bg-slate-950 text-slate-400'}`}
                    >
                      <div className="flex items-center gap-3"><ArrowUpRightSmall className="w-3.5 h-3.5" /> Receitas</div>
                      <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-[9px] text-slate-500">{categories.filter(c => c.type === 'Receita' && !c.parentId).length}</span>
                    </button>
                  </div>

                  <div className="col-span-12 lg:col-span-8 bg-slate-50/50 dark:bg-slate-950/20 rounded-[24px] border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                      <Reorder.Group 
                        axis="y" 
                        values={categories.filter(c => c.type === categoryTypeFilter && !c.parentId && (!showOnlyActiveCategories || c.status === 'Ativo')).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))}
                        onReorder={(newOrder) => handleReorderCategories(newOrder)}
                        className="space-y-2"
                      >
                        {categories
                          .filter(c => c.type === categoryTypeFilter && !c.parentId && (!showOnlyActiveCategories || c.status === 'Ativo'))
                          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                          .map((cat) => {
                            const subCats = categories.filter(s => s.parentId === cat.id && (!showOnlyActiveCategories || s.status === 'Ativo')).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
                            const isExpanded = expandedCategoryId === cat.id;

                            return (
                              <Reorder.Item 
                                key={cat.id} 
                                value={cat}
                                className="group/item"
                              >
                                <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-2xl border transition-all ${isExpanded ? 'border-[#19727d]/30 dark:border-[#19727d]/50 shadow-md' : 'border-slate-100 dark:border-slate-800'}`}>
                                  <div className="flex items-center justify-between p-3 px-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-2xl cursor-pointer" onClick={() => setExpandedCategoryId(isExpanded ? null : cat.id)}>
                                    <div className="flex items-center gap-3">
                                      <GripVertical className="w-3.5 h-3.5 text-slate-300 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#19727d' }} />
                                      <span className="text-xs font-black text-slate-700 dark:text-white tracking-tight">{cat.name}</span>
                                      {subCats.length > 0 && (
                                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-[8px] font-black text-slate-400">
                                          {subCats.length} SUB
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button onClick={(e) => { e.stopPropagation(); setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="p-1.5 text-slate-300 hover:text-[#19727d] hover:bg-[#19727d]/10 rounded-lg transition-all"><Edit2 className="w-3 h-3" /></button>
                                      <button onClick={(e) => { e.stopPropagation(); setCategoryToDeleteId(cat.id); setIsDeleteCategoryModalOpen(true); }} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-3 h-3" /></button>
                                      {subCats.length > 0 && (
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                      )}
                                    </div>
                                  </div>

                                  <AnimatePresence>
                                    {isExpanded && subCats.length > 0 && (
                                      <motion.div 
                                        initial={{ height: 0, opacity: 0 }} 
                                        animate={{ height: 'auto', opacity: 1 }} 
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20"
                                      >
                                        <div className="p-2 px-8 space-y-1">
                                          <Reorder.Group 
                                            axis="y" 
                                            values={subCats} 
                                            onReorder={(newSubOrder) => handleReorderCategories(newSubOrder, cat.id)}
                                            className="space-y-1"
                                          >
                                            {subCats.map(sub => (
                                              <Reorder.Item key={sub.id} value={sub} className="flex items-center justify-between p-2 px-4 hover:bg-white dark:hover:bg-slate-800 rounded-xl group/sub transition-all">
                                                <div className="flex items-center gap-3">
                                                  <GripVertical className="w-3 h-3 text-slate-200 opacity-0 group-hover/sub:opacity-100" />
                                                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{sub.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                  <button onClick={() => { setEditingCategory(sub); setIsCategoryModalOpen(true); }} className="p-1 text-slate-300 hover:text-[#19727d]"><Edit2 className="w-2.5 h-2.5" /></button>
                                                  <button onClick={() => { setCategoryToDeleteId(sub.id); setIsDeleteCategoryModalOpen(true); }} className="p-1 text-slate-300 hover:text-rose-500"><Trash2 className="w-2.5 h-2.5" /></button>
                                                </div>
                                              </Reorder.Item>
                                            ))}
                                          </Reorder.Group>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </Reorder.Item>
                            );
                          })}
                      </Reorder.Group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Modais Globais para a View de Contas */}
        <AnimatePresence>
          {isAccountModalOpen && <AccountModal onClose={() => setIsAccountModalOpen(false)} onSave={saveAccount} account={editingAccount} />}
          {isCategoryModalOpen && <CategoryModal onClose={() => setIsCategoryModalOpen(false)} onSave={async (cat) => { await saveCategory(cat); setIsCategoryModalOpen(false); }} category={editingCategory} categories={categories} defaultType={categoryTypeFilter} />}
          {isDeleteCategoryModalOpen && categoryToDeleteId && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteCategoryModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2"><Trash2 className="w-8 h-8" /></div>
                <div className="space-y-2"><h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-tight">Excluir Categoria?</h3><p className="text-xs font-medium text-slate-400">Esta ação não pode ser desfeita. Todas as subcategorias vinculadas também serão removidas.</p></div>
                <div className="flex gap-4"><button onClick={() => setIsDeleteCategoryModalOpen(false)} className="flex-1 px-6 py-4 bg-slate-50 text-slate-400 text-[10px] font-black rounded-2xl uppercase tracking-widest">Cancelar</button><button onClick={async () => { await deleteCategory(categoryToDeleteId); setIsDeleteCategoryModalOpen(false); setCategoryToDeleteId(null); }} className="flex-1 px-6 py-4 bg-rose-500 text-white text-[10px] font-black rounded-2xl shadow-lg shadow-rose-500/20 uppercase tracking-widest">Confirmar</button></div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- VIEW PADRÃO / DASHBOARD ORIGINAL ---
  return (
    <div className="flex flex-col h-[calc(100vh-20px)] bg-[#f8fafc] dark:bg-slate-950 overflow-hidden text-slate-800 dark:text-slate-100">
      <div className="bg-[#19727d] text-white p-5 md:px-10 md:py-6 rounded-b-[32px] shadow-2xl relative overflow-hidden shrink-0 border-b-2 border-[#145d66]/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
          <div className="space-y-1"><h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-none">Dashboard Financeiro</h1><p className="text-cyan-100 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-80 flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5" /> Controle Inteligente de Fluxo de Caixa</p></div>
          <div className="flex items-center gap-3"><button onClick={() => setIsTransactionModalOpen(true)} className="px-5 py-2.5 bg-white text-[#19727d] text-[10px] font-black rounded-xl hover:bg-cyan-50 transition-all shadow-lg active:scale-95 flex items-center gap-2"><LayoutGrid className="w-3.5 h-3.5" />NOVO LANÇAMENTO</button><div className="flex items-center bg-white/10 backdrop-blur-xl rounded-xl p-1 border border-white/10"><button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/10 rounded-lg transition-all"><ChevronLeft className="w-4 h-4" /></button><span className="px-5 font-black text-[10px] uppercase tracking-widest min-w-[120px] text-center">{monthName}</span><button onClick={handleNextMonth} className="p-1.5 hover:bg-white/10 rounded-lg transition-all"><ChevronRight className="w-4 h-4" /></button></div></div>
        </div>
      </div>

      <div className="px-8 md:px-12 mt-[-20px] shrink-0 z-10">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800/50 p-1 flex items-center gap-1 overflow-x-auto">
          {['Visão Geral', 'Lançamentos', 'Contas', 'Configurações'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#19727d] text-white shadow-lg' : 'text-slate-400 hover:text-[#19727d] hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#19727d transparent' }}>
        {activeTab === 'Visão Geral' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><StatCard label="RECEITAS" value={totalReceitas} color="emerald" icon={<TrendingUp className="w-3.5 h-3.5" />} /><StatCard label="DESPESAS" value={totalDespesas} color="rose" icon={<TrendingDown className="w-3.5 h-3.5" />} /><StatCard label="SALDO PERÍODO" value={saldoPeriodo} color="cyan" icon={<Wallet className="w-3.5 h-3.5" />} isBalance /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><StatCard label="ATIVOS" value={ativos} color="emerald" icon={<ArrowUpRight className="w-3.5 h-3.5" />} /><StatCard label="DESPESAS MENSAIS" value={totalDespesasRecorrentes} color="rose" icon={<ArrowDownRight className="w-3.5 h-3.5" />} /><StatCard label="BALANÇO PATRIMONIAL" value={ativos - passivos} color="indigo" icon={<CreditCard className="w-3.5 h-3.5" />} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2"><ChartCard title="Despesas por Categoria" subtitle="Situação projetada" icon={<TrendingDown className="w-12 h-12 opacity-10" />} /><ChartCard title="Receitas por Categoria" subtitle="Situação projetada" icon={<TrendingUp className="w-12 h-12 opacity-10" />} /></div>
          </motion.div>
        )}

        {/* LANÇAMENTOS, CONTAS E CONFIGS ORIGINAIS (Omitido para brevidade, mas seguem o mesmo padrão) */}
      </div>

      {/* Modais da View Padrão */}
      <AnimatePresence>
        {isTransactionModalOpen && <FinancialTransactionModal onClose={() => { setIsTransactionModalOpen(false); setEditingTransaction(null); }} onSave={saveTransaction} accounts={accounts} categories={categories} initialTransaction={editingTransaction} />}
        {isCategoryModalOpen && <CategoryModal onClose={() => setIsCategoryModalOpen(false)} onSave={async (cat) => { await saveCategory(cat); setIsCategoryModalOpen(false); }} category={editingCategory} categories={categories} defaultType={categoryTypeFilter} />}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, color, icon, isBalance }: any) {
  const iconBgMap: any = { emerald: 'bg-emerald-500/10 text-emerald-500', rose: 'bg-rose-500/10 text-rose-500', cyan: 'bg-cyan-500/10 text-cyan-500', indigo: 'bg-[#19727d]/10 text-[#19727d]' };
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between min-h-[90px]">
      <div className="flex items-center justify-between"><span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span><div className={`p-1 rounded-md ${iconBgMap[color]}`}>{icon}</div></div>
      <div className={`text-lg font-black tracking-tight ${isBalance ? (value < 0 ? 'text-rose-500' : (value > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100')) : (color === 'rose' ? 'text-rose-500' : (color === 'emerald' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'))}`}><NumericFormat value={value} displayType="text" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale /></div>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, icon, emptyMessage }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm min-h-[220px] flex flex-col">
      <div className="px-5 py-4 border-b border-gray-50 dark:border-slate-800/50 flex justify-between items-start"><div><h3 className="text-[11px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight">{title}</h3><p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{subtitle}</p></div><div className="flex items-center gap-2 text-gray-300"><BarChart3 className="w-3.5 h-3.5" /><Check className="w-3.5 h-3.5" /><ChevronUp className="w-3.5 h-3.5" /></div></div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-300"><div className="relative group/icon"><div className="absolute inset-0 bg-gray-100 dark:bg-slate-800 rounded-full scale-150 blur-xl opacity-0 group-hover/icon:opacity-50 transition-all" />{icon}</div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">{emptyMessage || `Nenhum registro no período`}</p></div>
    </div>
  );
}

function StatusListCard({ title, total, color, emptyMessage, icon, items = [] }: any) {
  const textColor = color === 'rose' ? 'text-rose-500' : 'text-emerald-500';
  const bgColor = color === 'rose' ? 'bg-rose-500/5' : 'bg-emerald-500/5';
  return (
    <div className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 border-l-[4px] ${color === 'rose' ? 'border-l-rose-500' : 'border-l-emerald-500'} rounded-2xl shadow-sm flex flex-col overflow-hidden h-auto min-h-[220px]`}>
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50 dark:border-slate-800/50"><div className="flex items-center gap-2"><div className={`p-1.5 rounded-lg ${bgColor} ${textColor}`}>{icon}</div><h3 className="text-[11px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight">{title}</h3></div><span className={`text-[13px] font-black ${textColor}`}><NumericFormat value={total} displayType="text" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale /></span></div>
      <div className="flex-1">{items.length === 0 ? (<div className="h-full flex flex-col items-center justify-center p-6 text-center"><div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3"><AlertCircle className="w-5 h-5 text-slate-300" /></div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{emptyMessage || `Nenhum registro`}</p></div>) : (<div className="divide-y divide-gray-50 dark:divide-slate-800/50">{items.map((item: any) => (<div key={item.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"><div className="flex flex-col min-w-0"><span className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{item.description}</span><div className="flex items-center gap-2 mt-0.5"><Calendar className="w-3 h-3 text-slate-300" /><span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{new Date(item.dueDate || item.createdAt).toLocaleDateString('pt-BR')}</span></div></div><span className={`text-[11px] font-black whitespace-nowrap ml-4 ${color === 'rose' ? 'text-rose-500' : 'text-emerald-500'}`}><NumericFormat value={item.amount} displayType="text" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale /></span></div>))}</div>)}</div>
    </div>
  );
}
