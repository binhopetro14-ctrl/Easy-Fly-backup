'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, CreditCard, LayoutGrid, Plus, 
  ChevronLeft, ChevronRight, BarChart3, X, ArrowUpRight, ArrowDownRight, 
  Search, ArrowRight, Check, ChevronUp, AlertCircle, Plane
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinance } from '../hooks/useFinance';
import { useSales } from '../hooks/useSales';
import { NumericFormat } from 'react-number-format';
import { FinancialAccount, FinancialTransaction } from '../types';

export function FinancialView() {
  const { accounts, transactions, loading, saveTransaction, deleteTransaction } = useFinance();
  const { sales } = useSales();
  const [activeTab, setActiveTab] = useState('Visão Geral');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

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

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 overflow-hidden">
      {/* EASY FLY COLOR PALETTE HEADER */}
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

      {/* EASY FLY NAVIGATION TABS */}
      <div className="px-8 md:px-12 mt-[-20px] shrink-0 z-10">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800/50 p-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {['Visão Geral', 'Lançamentos', 'Contas', 'Faturas', 'Configurações'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-[#19727d] text-white shadow-lg' 
                  : 'text-gray-400 hover:text-[#19727d] hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>




      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
        {activeTab === 'Visão Geral' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            {/* LANÇAMENTOS DO PERÍODO */}
            <section className="space-y-3">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Lançamentos do Período</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="RECEITAS" value={totalReceitas} color="emerald" icon={<TrendingUp className="w-3.5 h-3.5" />} />
                <StatCard label="DESPESAS" value={totalDespesas} color="rose" icon={<TrendingDown className="w-3.5 h-3.5" />} />
                <StatCard label="SALDO PERÍODO" value={saldoPeriodo} color="cyan" icon={<Wallet className="w-3.5 h-3.5" />} isBalance />
              </div>
            </section>

            {/* CONTAS FINANCEIRAS */}
            <section className="space-y-3">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Contas Financeiras</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="ATIVOS" value={ativos} color="emerald" icon={<ArrowUpRight className="w-3.5 h-3.5" />} />
                <StatCard label="PASSIVOS" value={passivos} color="rose" icon={<ArrowDownRight className="w-3.5 h-3.5" />} />
                <StatCard label="BALANÇO PATRIMONIAL" value={ativos - passivos} color="indigo" icon={<CreditCard className="w-3.5 h-3.5" />} />
              </div>
            </section>

            {/* NEW GRID LAYOUT FROM IMAGE */}
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-50 dark:border-slate-800/50 flex justify-between items-center">
                <h3 className="text-xs font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight">Movimentações Recentes</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{transactions.length} registros</span>
             </div>
             <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-[11px] text-left">
                  <thead className="text-[9px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50/50 dark:bg-slate-800/30">
                    <tr>
                      <th className="px-6 py-3">Descrição</th>
                      <th className="px-6 py-3">Tipo</th>
                      <th className="px-6 py-3 text-right">Valor</th>
                      <th className="px-6 py-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                    {transactions.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-300 font-medium italic">Sem registros.</td></tr>
                    ) : (
                      transactions.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-3 font-bold text-gray-600 dark:text-gray-300">{t.description}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${t.type === 'Receita' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {t.type}
                            </span>
                          </td>
                          <td className={`px-6 py-3 text-right font-black ${t.type === 'Receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                             <NumericFormat value={t.amount} displayType="text" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale />
                          </td>
                          <td className="px-6 py-3 text-center">
                            <button onClick={() => deleteTransaction(t.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'Contas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-10">
            {accounts.map(account => (
              <div key={account.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${account.type === 'Ativo' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-600'}`}>
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{account.category}</span>
                </div>
                <div>
                  <h4 className="font-black text-[11px] text-gray-800 dark:text-gray-100 uppercase tracking-tight truncate">{account.name}</h4>
                  <p className="text-[8px] text-gray-400 font-bold uppercase">{account.type}</p>
                </div>
                <div className="pt-2 border-t border-gray-50 dark:border-slate-800/50 flex justify-between items-center">
                  <span className="text-[9px] text-gray-400 font-bold">SALDO</span>
                  <NumericFormat value={account.balance} displayType="text" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale className="text-xs font-black text-gray-900 dark:text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isTransactionModalOpen && (
          <TransactionModal 
            onClose={() => setIsTransactionModalOpen(false)}
            onSave={saveTransaction}
            accounts={accounts}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TransactionModal({ onClose, onSave, accounts }: any) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Despesa');
  const [acc, setAcc] = useState('');

  const handleSave = async () => {
    if (!desc || !amount) return;
    await onSave({
      description: desc,
      amount: parseFloat(amount.replace(/\./g, '').replace(',', '.')),
      type: type as any,
      category: 'Geral',
      accountId: acc || undefined,
      status: 'Pendente',
      dueDate: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight">Novo Lançamento</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div className="flex p-1 bg-gray-50 dark:bg-slate-800 rounded-xl">
            {['Receita', 'Despesa'].map(t => (
              <button key={t} onClick={() => setType(t)} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${type === t ? (t === 'Receita' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white') : 'text-gray-400'}`}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Descrição</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="Ex: Aluguel" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Valor</label>
              <NumericFormat value={amount} onValueChange={(vals) => setAmount(vals.value)} className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-black focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="0,00" thousandSeparator="." decimalSeparator="," />
            </div>
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Conta</label>
              <select value={acc} onChange={e => setAcc(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-[10px] font-bold focus:ring-1 focus:ring-cyan-500 transition-all appearance-none">
                <option value="">Selecione...</option>
                {accounts.map((a: any) => (<option key={a.id} value={a.id}>{a.name}</option>))}
              </select>
            </div>
          </div>

          <button onClick={handleSave} className="w-full py-4 bg-[#19727d] text-white font-black rounded-xl shadow-lg hover:bg-[#145d66] transition-all active:scale-95 text-xs uppercase tracking-widest mt-2">
            Salvar Lançamento
          </button>
        </div>
      </motion.div>
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
      <div className={`text-lg font-black tracking-tight ${value < 0 && !isBalance ? 'text-rose-500' : (value > 0 ? 'text-emerald-500' : 'text-gray-900 dark:text-gray-100')}`}>
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
          <BarChart3 className="w-3.5 h-3.5 hover:text-gray-500 cursor-pointer" />
          <Check className="w-3.5 h-3.5 hover:text-emerald-500 cursor-pointer" />
          <ChevronUp className="w-3.5 h-3.5 hover:text-gray-500 cursor-pointer" />
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
