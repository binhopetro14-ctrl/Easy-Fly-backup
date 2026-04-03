'use client';

import React, { useState } from 'react';
import { X, Wallet, Building, CreditCard, Banknote, PiggyBank, TrendingUp, Coins, DollarSign, Info, Palette, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FinancialAccount } from '../types';
import { NumericFormat } from 'react-number-format';

interface AccountModalProps {
  onClose: () => void;
  onSave: (account: Partial<FinancialAccount>) => Promise<any>;
  account?: FinancialAccount;
}

export function AccountModal({ onClose, onSave, account }: AccountModalProps) {
  const [name, setName] = useState(account?.name || '');
  const [type, setType] = useState<'Ativo' | 'Passivo'>(account?.type || 'Ativo');
  const [category, setCategory] = useState(account?.category || 'Conta Corrente');
  const [balance, setBalance] = useState(account?.balance || 0);
  const [selectedColor, setSelectedColor] = useState(account?.color || '#3b82f6');
  const [selectedIcon, setSelectedIcon] = useState(account?.icon || 'Wallet');
  const [isSaving, setIsSaving] = useState(false);

  const colors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#6366f1'
  ];

  const icons = [
    { name: 'Building', icon: Building },
    { name: 'CreditCard', icon: CreditCard },
    { name: 'Wallet', icon: Wallet },
    { name: 'Banknote', icon: Banknote },
    { name: 'PiggyBank', icon: PiggyBank },
    { name: 'TrendingUp', icon: TrendingUp },
    { name: 'Coins', icon: Coins },
    { name: 'DollarSign', icon: DollarSign },
  ];

  const categories = [
    'Conta Corrente', 'Poupança', 'Investimentos', 'Caixa', 
    'Cartão de Crédito', 'Empréstimos', 'Outros'
  ];

  const handleSave = async () => {
    if (!name) {
      alert('Por favor, preencha o nome da conta.');
      return;
    }

    try {
      setIsSaving(true);
      await onSave({
        ...account,
        name,
        type,
        category,
        balance,
        color: selectedColor,
        icon: selectedIcon,
        status: account?.status || 'Ativo'
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      alert('Erro ao salvar conta.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
        className="relative bg-[#f8fafc] dark:bg-slate-950 w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* HEADER */}
        <div className="px-8 py-6 flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-slate-900 text-purple-600 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <Wallet className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            {account ? 'Editar Conta' : 'Nova Conta'}
          </h2>
          <button onClick={onClose} className="ml-auto p-2 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-8 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* SEÇÃO INFORMAÇÕES BÁSICAS */}
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800/50 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-lg">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Informações Básicas</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nome da conta</label>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Nubank, Bradesco..."
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-purple-500/10 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tipo</label>
                <div className="relative">
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-purple-500/10 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all outline-none appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronUp className="w-4 h-4 rotate-180" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Saldo inicial</label>
                <NumericFormat 
                  value={balance}
                  onValueChange={(values) => setBalance(values.floatValue || 0)}
                  placeholder="R$ 0,00"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-purple-500/10 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO PERSONALIZAÇÃO */}
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800/50 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-500 rounded-lg">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Personalização</h3>
              </div>
              <ChevronUp className="w-4 h-4 text-slate-300" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Cor</label>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl flex flex-wrap gap-3">
                {colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition-all border-4 ${selectedColor === color ? 'border-indigo-100 dark:border-indigo-900 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Ícone</label>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl grid grid-cols-8 gap-2">
                {icons.map(({ name, icon: Icon }) => (
                  <button 
                    key={name}
                    onClick={() => setSelectedIcon(name)}
                    className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${selectedIcon === name ? 'bg-white dark:bg-slate-800 text-purple-600 shadow-md border border-purple-100 dark:border-purple-800 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 flex items-center justify-end gap-3 bg-white/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onClose}
            className="px-8 py-3.5 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-10 py-3.5 bg-purple-900 hover:bg-purple-950 disabled:opacity-50 text-white text-[11px] font-black rounded-2xl shadow-xl shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            {isSaving ? 'Salvando...' : (account ? 'Salvar' : 'Criar')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
