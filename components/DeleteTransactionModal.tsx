'use client';

import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DeleteTransactionModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  transactionDescription?: string;
}

export function DeleteTransactionModal({ onClose, onConfirm, transactionDescription }: DeleteTransactionModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Erro ao excluir lançamento:', error);
      alert('Erro ao excluir lançamento.');
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
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
            Excluir lançamento?
          </h2>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 mb-6">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Item a ser excluído:</p>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic">
            &quot;{transactionDescription || 'Lançamento financeiro'}&quot;
          </p>
        </div>

        <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Esta ação <span className="text-rose-500 underline decoration-rose-500/30">não pode ser desfeita</span> e o valor será removido permanentemente do seu fluxo de caixa.
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
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
