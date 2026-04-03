'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FinancialCategory } from '../types';

interface CategoryModalProps {
  onClose: () => void;
  onSave: (category: Partial<FinancialCategory>) => Promise<void>;
  category?: FinancialCategory;
  categories: FinancialCategory[];
  defaultType?: 'Receita' | 'Despesa';
}

const PRESET_COLORS = [
  '#ef4444', // Coral/Red
  '#f59e0b', // Orange
  '#10b981', // Teal/Green
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#14b8a6', // Cyan
  '#64748b'  // Slate
];

export function CategoryModal({ onClose, onSave, category, categories, defaultType = 'Despesa' }: CategoryModalProps) {
  const [mode, setMode] = useState<'category' | 'subcategory'>(category?.parentId ? 'subcategory' : 'category');
  const [formData, setFormData] = useState<Partial<FinancialCategory>>({
    name: '',
    type: defaultType,
    status: 'Ativo',
    color: PRESET_COLORS[0],
    parentId: undefined
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData(category);
      setMode(category.parentId ? 'subcategory' : 'category');
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    if (mode === 'subcategory' && !formData.parentId) return;
    
    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        parentId: mode === 'category' ? undefined : formData.parentId
      };
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const parentCategories = categories.filter(c => !c.parentId && c.id !== category?.id && c.type === formData.type);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 p-8 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            Nova Categoria
          </h2>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* MODO */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Modo</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <button
                type="button"
                onClick={() => setMode('category')}
                className={`py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                  mode === 'category' 
                    ? 'bg-purple-900 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Categoria
              </button>
              <button
                type="button"
                onClick={() => setMode('subcategory')}
                className={`py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                  mode === 'subcategory' 
                    ? 'bg-purple-900 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Subcategoria
              </button>
            </div>
          </div>

          {/* TIPO */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {mode === 'category' ? 'Tipo' : 'Tipo da categoria pai'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Despesa' })}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border border-slate-100 dark:border-slate-800 ${
                  formData.type === 'Despesa' 
                    ? 'bg-rose-500 text-white shadow-md border-rose-500' 
                    : 'bg-slate-50/50 dark:bg-slate-800/50 text-slate-400'
                }`}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Receita' })}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border border-slate-100 dark:border-slate-800 ${
                  formData.type === 'Receita' 
                    ? 'bg-emerald-500 text-white shadow-md border-emerald-500' 
                    : 'bg-slate-50/50 dark:bg-slate-800/50 text-slate-400'
                }`}
              >
                Receita
              </button>
            </div>
          </div>

          {/* GRUPO (SE MODO SUBCATEGORIA) */}
          <AnimatePresence>
            {mode === 'subcategory' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-3"
              >
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Categoria</label>
                <div className="relative group">
                  <select
                    value={formData.parentId || ''}
                    onChange={e => setFormData({ ...formData, parentId: e.target.value || undefined })}
                    className="w-full bg-slate-50/50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 focus:border-purple-300 dark:focus:border-purple-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none transition-all appearance-none cursor-pointer pr-10"
                    required
                  >
                    <option value="">Selecione a categoria...</option>
                    {parentCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* NOME */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {mode === 'category' ? 'Nome da categoria' : 'Nome da subcategoria'}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Marketing Digital"
              className="w-full bg-slate-50/50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 focus:border-purple-300 dark:focus:border-purple-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none transition-all"
              required
            />
          </div>

          {/* COR */}
          <div className="space-y-3 pb-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Cor</label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-all flex items-center justify-center border-2 ${
                    formData.color === color ? 'border-purple-200 dark:border-purple-900' : 'border-transparent'
                  }`}
                >
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                </button>
              ))}
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-purple-400 hover:bg-purple-500 text-white rounded-xl shadow-lg transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest disabled:opacity-50 min-w-[80px]"
            >
              {loading ? '...' : (category ? 'Salvar' : 'Criar')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
