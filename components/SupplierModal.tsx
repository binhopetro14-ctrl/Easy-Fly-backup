'use client';

import React, { useState, useEffect } from 'react';
import { X, Truck, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Supplier } from '@/types';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Supplier>) => void;
  supplier: Supplier | null;
}

export function SupplierModal({ 
  isOpen, 
  onClose, 
  onSave, 
  supplier 
}: SupplierModalProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  useEffect(() => {
    if (isOpen) {
      if (supplier) {
        setFormData(supplier);
      } else {
        setFormData({
          name: '',
          cnpj: '',
          phone: '',
          email: '',
          address: '',
          description: '',
        });
      }
    }
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-[#1e293b] rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] dark:border dark:border-slate-700/50"
      >
        <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between bg-white dark:bg-[#1e293b] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-500/10 rounded-2xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-200 uppercase tracking-tight">
              {supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome *</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium text-gray-900 dark:text-white"
              placeholder="Nome do fornecedor"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">CNPJ</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium text-gray-900 dark:text-white"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={e => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Telefone</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium text-gray-900 dark:text-white"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">E-mail</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium text-gray-900 dark:text-white"
              placeholder="contato@fornecedor.com"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endereço</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium text-gray-900 dark:text-white"
              placeholder="Rua, número, cidade..."
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</label>
            <textarea 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium text-gray-900 dark:text-white min-h-[100px]"
              placeholder="Observações sobre o fornecedor..."
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-slate-700/50 flex justify-end gap-3 bg-gray-50/50 dark:bg-slate-800/50 -mx-8 -mb-8 mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-[#06B6D4] text-white font-bold rounded-xl hover:bg-[#0891B2] shadow-lg shadow-cyan-500/20 transition-all"
            >
              Salvar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
