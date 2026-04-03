'use client';

import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DeleteAccountModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAccountModal({ onClose, onConfirm }: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }} 
        className="relative bg-white dark:bg-slate-950 w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden p-8"
      >
        <div className="flex items-start gap-4 mb-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
            Excluir conta permanentemente?
          </h2>
        </div>

        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
          Esta ação <span className="font-extrabold text-slate-800 dark:text-white underline decoration-rose-500/30">não pode ser desfeita</span>.
        </p>

        <div className="p-6 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-800/30 mb-6">
          <p className="text-sm font-bold text-rose-500 dark:text-rose-400 leading-relaxed">
            Atenção: Todos os lançamentos vinculados a esta conta também serão excluídos permanentemente.
          </p>
        </div>

        <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Se deseja manter os lançamentos, considere apenas desativar a conta.
        </p>

        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-all border border-slate-100 dark:border-slate-800"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-[1.5] py-3.5 bg-[#e55353] hover:bg-[#d44343] disabled:opacity-50 text-white text-[11px] font-black rounded-2xl shadow-xl shadow-rose-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir conta e lançamentos'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
