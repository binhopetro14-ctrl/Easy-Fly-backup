'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Users, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Group, Customer } from '@/types';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Group>) => void;
  group: Group | null;
  customers: Customer[];
}

export function GroupModal({ 
  isOpen, 
  onClose, 
  onSave, 
  group,
  customers
}: GroupModalProps) {
  const [formData, setFormData] = useState<Partial<Group>>({});
  const [isAddingMember, setIsAddingMember] = useState(false);

  useEffect(() => {
    // Adia o reset do formulário para o próximo tick para evitar renderização em cascata síncrona (lint error)
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        if (group) {
          setFormData({
            name: group.name || '',
            memberIds: [...(group.memberIds || [])]
          });
        } else {
          setFormData({
            name: '',
            memberIds: []
          });
        }
        setIsAddingMember(false);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [group, isOpen]);

  if (!isOpen) return null;

  const removeMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      memberIds: prev.memberIds?.filter(mId => mId !== id)
    }));
  };

  const addMember = (id: string) => {
    if (formData.memberIds?.includes(id)) return;
    setFormData(prev => ({
      ...prev,
      memberIds: [...(prev.memberIds || []), id]
    }));
    setIsAddingMember(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl overflow-hidden dark:border dark:border-slate-700/50 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-200">
          <h2 className="text-xl font-bold">{group ? 'Editar Grupo' : 'Cadastro de Grupo'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Dados do grupo</h3>
            
            <div className="p-6 border border-gray-100 dark:border-slate-700/50 rounded-2xl space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Nome</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white"
                  placeholder="Ex: Família Silva"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Integrantes</label>
                <div className="space-y-2">
                  {formData.memberIds?.map(mId => {
                    const customer = customers.find(c => c.id === mId);
                    return (
                      <div key={mId} className="flex items-center gap-2">
                        <div className="flex-1 flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white">
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase">{customer?.name}</span>
                          <button onClick={() => removeMember(mId)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isAddingMember ? (
                  <div className="relative">
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto z-10">
                      {customers
                        .filter(c => !formData.memberIds?.includes(c.id))
                        .map(c => (
                          <button
                            key={c.id}
                            onClick={() => addMember(c.id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 text-sm font-medium border-b border-gray-50 dark:border-slate-700/50 text-gray-900 dark:text-gray-200 last:border-0"
                          >
                            {c.name}
                          </button>
                        ))}
                      {customers.filter(c => !formData.memberIds?.includes(c.id)).length === 0 && (
                        <div className="p-4 text-center text-xs text-gray-400 dark:text-gray-500">Todos os clientes já foram adicionados</div>
                      )}
                    </div>
                    <button 
                      onClick={() => setIsAddingMember(false)}
                      className="text-sm font-bold text-cyan-500 flex items-center gap-2 hover:text-cyan-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAddingMember(true)}
                    className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:text-cyan-500 transition-colors"
                  >
                    Adicionar integrante <Plus className="w-4 h-4 p-0.5 bg-gray-100 dark:bg-slate-800 rounded-full" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-slate-700/50 flex justify-end gap-3 bg-gray-50/50 dark:bg-slate-800/50">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="px-8 py-2 bg-[#06B6D4] text-white font-bold rounded-xl hover:bg-[#0891B2] shadow-lg shadow-cyan-500/20 transition-all"
          >
            Salvar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
