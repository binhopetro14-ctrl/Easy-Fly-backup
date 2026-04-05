'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, TrendingUp, TrendingDown, ArrowRightLeft, Wallet, 
  Tag, DollarSign, FileText, Calendar, 
  Repeat, Bell, CheckCircle2, Paperclip, ChevronDown,
  Plus, Search, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NumericFormat } from 'react-number-format';
import { addMonths, format, parseISO } from 'date-fns';
import { FinancialAccount, FinancialTransaction, FinancialCategory } from '../types';
import { GripVertical } from 'lucide-react';

interface FinancialTransactionModalProps {
  onClose: () => void;
  onSave: (transaction: Partial<FinancialTransaction>) => Promise<any>;
  accounts: FinancialAccount[];
  categories: FinancialCategory[];
  initialTransaction?: Partial<FinancialTransaction> | null;
}

export function FinancialTransactionModal({ onClose, onSave, accounts, categories, initialTransaction }: FinancialTransactionModalProps) {
  const [type, setType] = useState<'Receita' | 'Despesa' | 'Transferência'>('Despesa');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [accountId, setAccountId] = useState('');
  const [category, setCategory] = useState('');
  const [competenceDate, setCompetenceDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [recurrence, setRecurrence] = useState('Única');
  const [reminder, setReminder] = useState(false);
  const [status, setStatus] = useState<'Pago' | 'Pendente'>('Pendente');
  const [observations, setObservations] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [installmentsCount, setInstallmentsCount] = useState(12);
  
  const [isSaving, setIsSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type || 'Despesa');
      setDescription(initialTransaction.description || '');
      setAmount(initialTransaction.amount?.toString() || '');
      setAccountId(initialTransaction.accountId || '');
      setCategory(initialTransaction.category || '');
      setCompetenceDate(initialTransaction.competenceDate || new Date().toISOString().split('T')[0]);
      setPaymentDate(initialTransaction.paymentDate || new Date().toISOString().split('T')[0]);
      setRecurrence(initialTransaction.recurrence || 'Única');
      setReminder(initialTransaction.reminder || false);
      setStatus(initialTransaction.status === 'Pago' ? 'Pago' : 'Pendente');
      setObservations(initialTransaction.observations || '');
      setAttachments(initialTransaction.attachments || []);
    }
  }, [initialTransaction]);

  const filteredCategories = useMemo(() => {
    // Filter by type (Income/Expense) and search term
    const baseCategories = categories.filter(cat => 
      cat.type === (type === 'Receita' ? 'Receita' : 'Despesa') &&
      (!cat.parentId || categories.some(p => p.id === cat.parentId))
    );

    const filtered = baseCategories.filter(cat => 
      cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // Group parents and children
    const parents = filtered.filter(cat => !cat.parentId);
    const result: FinancialCategory[] = [];

    parents.forEach(p => {
      result.push(p);
      const children = filtered.filter(cat => cat.parentId === p.id);
      result.push(...children);
    });

    // Handle orphans if searching
    if (categorySearch) {
      const orphans = filtered.filter(cat => cat.parentId && !result.some(r => r.id === cat.id));
      result.push(...orphans);
    }

    return result;
  }, [type, categories, categorySearch]);

  const selectedCategoryName = useMemo(() => {
    const cat = categories.find(c => c.id === category || c.name === category);
    return cat ? cat.name : category || 'Buscar categoria...';
  }, [category, categories]);

  const handleSave = async () => {
    if (!description || !amount || !accountId) {
      alert('Por favor, preencha a descrição, valor e conta.');
      return;
    }

    try {
      setIsSaving(true);
      const baseData = {
        type,
        description,
        amount: parseFloat(amount),
        accountId,
        category,
        reminder,
        status: (status === 'Pago' ? 'Pago' : 'Pendente') as 'Pago' | 'Pendente',
        observations,
        attachments
      };

      if (recurrence === 'Parcelado' && !initialTransaction) {
        // Geração de Parcelas
        const totalParcelas = parseInt(installmentsCount.toString());
        for (let i = 0; i < totalParcelas; i++) {
          setSavingProgress(Math.round(((i + 1) / totalParcelas) * 100));
          const nextPaymentDate = addMonths(parseISO(paymentDate), i);
          const nextCompetenceDate = addMonths(parseISO(competenceDate), i);
          const formattedPayment = format(nextPaymentDate, 'yyyy-MM-dd');
          const formattedCompetence = format(nextCompetenceDate, 'yyyy-MM-dd');

          await onSave({
            ...baseData,
            description: `${description} (${(i + 1).toString().padStart(2, '0')}/${totalParcelas.toString().padStart(2, '0')})`,
            paymentDate: formattedPayment,
            dueDate: formattedPayment,
            competenceDate: formattedCompetence,
            recurrence: 'Parcelado'
          });
        }
      } else {
        // Salvamento Normal ou Edição
        await onSave({
          ...baseData,
          id: initialTransaction?.id,
          competenceDate,
          paymentDate,
          recurrence,
          dueDate: paymentDate
        });
      }
      
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      alert('Erro ao salvar transação.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[8px]" 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
        className="relative bg-white dark:bg-slate-950 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col min-h-[400px] max-h-[90vh]"
      >
        {isSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Sucesso!</h3>
              <p className="text-sm font-medium text-slate-400">
                Lançamento(s) criado(s) com êxito.<br/>
                Lembre-se de verificar o mês correspondente no filtro de data para visualizá-los.
              </p>
            </div>
          </div>
        ) : isSaving ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" fill="none" />
                <circle 
                  cx="48" cy="48" r="40" 
                  className="stroke-cyan-500" 
                  strokeWidth="8" 
                  strokeDasharray={2 * Math.PI * 40} 
                  strokeDashoffset={(2 * Math.PI * 40) * (1 - savingProgress / 100)} 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-slate-700 dark:text-white">{savingProgress}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Processando Parcelas</h3>
              <p className="text-[10px] font-bold text-slate-400">Isso pode levar alguns segundos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* HEADER */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${type === 'Receita' ? 'bg-emerald-50 text-emerald-500' : type === 'Despesa' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-500'}`}>
              {type === 'Receita' ? <TrendingUp className="w-5 h-5" /> : type === 'Despesa' ? <TrendingDown className="w-5 h-5" /> : <ArrowRightLeft className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white leading-tight">
                {initialTransaction ? 'Editar' : 'Nova'} {type}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Controle Financeiro</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {/* TIPO DE LANÇAMENTO */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <DollarSign className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase tracking-widest">Tipo de Lançamento</h3>
            </div>
            <div className="flex p-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              {(['Receita', 'Despesa', 'Transferência'] as const).map(t => (
                <button 
                  key={t} 
                  onClick={() => setType(t)} 
                  className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
                    type === t 
                      ? (t === 'Receita' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : t === 'Despesa' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-600 text-white shadow-lg shadow-slate-500/20') 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t === 'Receita' ? <TrendingUp className="w-3.5 h-3.5" /> : t === 'Despesa' ? <TrendingDown className="w-3.5 h-3.5" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          {/* CONTA E CATEGORIA */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Wallet className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase tracking-widest">Conta e Classificação</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Conta</label>
                <div className="relative group">
                  <select 
                    value={accountId} 
                    onChange={e => setAccountId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-cyan-500/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all appearance-none outline-none"
                  >
                    <option value="">Selecione...</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-focus-within:text-cyan-500 transition-colors" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Categoria</label>
                <div className="relative">
                  <button 
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-cyan-500/20 hover:bg-white dark:hover:bg-slate-900 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-between outline-none"
                  >
                    <span className={category ? 'text-slate-700 dark:text-white' : 'text-slate-400'}>
                      {selectedCategoryName}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isCategoryDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-[110]" onClick={() => setIsCategoryDropdownOpen(false)} />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-[120] overflow-hidden"
                        >
                          <div className="p-2 border-b border-slate-50 dark:border-slate-800">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input 
                                autoFocus
                                value={categorySearch}
                                onChange={e => setCategorySearch(e.target.value)}
                                placeholder="Buscar categoria..."
                                className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-200 outline-none"
                              />
                            </div>
                          </div>
                          <div className="max-h-60 overflow-y-auto scrollbar-hide py-1">
                            {filteredCategories.length === 0 ? (
                              <div className="px-4 py-8 text-center">
                                <AlertCircle className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nenhuma categoria encontrada</p>
                              </div>
                            ) : (
                              filteredCategories.map(cat => {
                                const isParent = !cat.parentId;
                                const isSelected = category === cat.id || category === cat.name;
                                return (
                                  <button
                                    key={cat.id}
                                    onClick={() => {
                                      setCategory(cat.id);
                                      setIsCategoryDropdownOpen(false);
                                      setCategorySearch('');
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group ${isSelected ? 'bg-cyan-50/50 dark:bg-cyan-500/10' : ''}`}
                                  >
                                    {!isParent && <div className="w-4 h-4 shrink-0" />}
                                    <div className="w-2 h-2 rounded-full shrink-0 group-hover:scale-125 transition-transform" style={{ backgroundColor: cat.color || '#6366f1' }} />
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-[11px] truncate ${isParent ? 'font-black text-slate-700 dark:text-white uppercase tracking-tight' : 'font-bold text-slate-500 dark:text-slate-300'}`}>
                                        {cat.name}
                                      </p>
                                    </div>
                                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          {/* INFORMAÇÕES DO LANÇAMENTO */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <FileText className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase tracking-widest">Informações do Lançamento</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Valor</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">R$</span>
                  <NumericFormat 
                    value={amount} 
                    onValueChange={(vals) => setAmount(vals.value)}
                    thousandSeparator="." 
                    decimalSeparator=","
                    fixedDecimalScale
                    decimalScale={2}
                    placeholder="0,00"
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-cyan-500/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-black text-slate-800 dark:text-white transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Descrição</label>
                <input 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Descrição do lançamento"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-cyan-500/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Competência</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={competenceDate} 
                    onChange={e => setCompetenceDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-cyan-500/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-4 py-3.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Data de Pagamento</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={paymentDate} 
                    onChange={e => setPaymentDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-cyan-500/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-4 py-3.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* RECORRÊNCIA */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Repeat className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase tracking-widest">Recorrência</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Repetição</label>
                <div className="relative group">
                  <select 
                    value={recurrence} 
                    onChange={e => setRecurrence(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-cyan-500/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all appearance-none outline-none"
                  >
                    {['Única', 'Mensal', 'Semanal', 'Anual', 'Parcelado'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-focus-within:text-cyan-500 transition-colors" />
                </div>
              </div>

              {recurrence === 'Parcelado' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-1.5"
                >
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Número de Parcelas</label>
                  <div className="relative group">
                    <select 
                      value={installmentsCount} 
                      onChange={e => setInstallmentsCount(parseInt(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-cyan-500/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all appearance-none outline-none"
                    >
                      {Array.from({ length: 36 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}x</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-focus-within:text-cyan-500 transition-colors" />
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* LEMBRETE */}
          <section className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${reminder ? 'bg-cyan-50 text-cyan-500' : 'bg-slate-100 text-slate-400'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">Lembrete</span>
            </div>
            <button 
              onClick={() => setReminder(!reminder)}
              className={`w-12 h-6 rounded-full transition-all relative ${reminder ? 'bg-cyan-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${reminder ? 'left-7' : 'left-1'}`} />
            </button>
          </section>

          {/* STATUS E OBSERVAÇÕES */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">Status e Observações</h3>
              </div>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all"
              >
                <Paperclip className="w-3.5 h-3.5" />
                COMPROVANTES
              </button>
            </div>

            <div 
              onClick={() => setStatus(status === 'Pago' ? 'Pendente' : 'Pago')}
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 cursor-pointer group"
            >
              <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${status === 'Pago' ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 group-hover:border-emerald-500/50'}`}>
                {status === 'Pago' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">Pago</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Observações</label>
              <textarea 
                value={observations}
                onChange={e => setObservations(e.target.value)}
                placeholder="Observações adicionais (opcional)"
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-cyan-500/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all outline-none resize-none"
              />
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center gap-4 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-[1.5] py-4 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-black rounded-2xl shadow-xl shadow-rose-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            {isSaving ? 'Processando...' : initialTransaction ? 'Salvar Alterações' : `Criar ${type}`}
          </button>
        </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
