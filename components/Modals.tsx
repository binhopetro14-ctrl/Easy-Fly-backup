'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Search, ChevronRight, ChevronDown, Settings, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Customer, Group } from '@/types';

interface SearchSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: { id: string; name: string; subtitle?: string; originalItem: any }[];
  onSelect: (id: string) => void;
  onAddNew?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

export function SearchSelectorModal({
  isOpen,
  onClose,
  title,
  items,
  onSelect,
  onAddNew,
  onEdit,
  onDelete
}: SearchSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1e293b] rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-gray-100 dark:border-slate-700/50">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between bg-white dark:bg-[#1e293b] sticky top-0 z-10">
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Plus className="w-6 h-6 rotate-45 text-gray-400 dark:text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              {filteredItems.map(item => (
                <div key={item.id} className="group flex items-center gap-2 pr-2 hover:bg-cyan-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all">
                  <button
                    onClick={() => {
                      onSelect(item.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-between p-3 text-left"
                  >
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">{item.name}</p>
                      {item.subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>}
                    </div>
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(item.originalItem);
                          onClose();
                        }}
                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-gray-400 dark:text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                        title="Editar"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(item.originalItem);
                          onClose();
                        }}
                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm">Nenhum resultado encontrado</p>
            </div>
          )}
        </div>

        {onAddNew && (
          <div className="p-4 bg-gray-50 dark:bg-[#1e293b] border-t border-gray-100 dark:border-slate-700/50">
            <button
              onClick={() => {
                onAddNew();
                onClose();
              }}
              className="w-full py-3 bg-white dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-gray-500 dark:text-gray-400 font-bold text-sm hover:border-cyan-500 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Novo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  customerName 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void, 
  customerName: string 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
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
        className="relative w-full max-w-md bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-700/50 rounded-3xl shadow-2xl p-6 text-center"
      >
        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirmar Exclusão</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Deseja realmente excluir <span className="font-bold text-gray-900 dark:text-white">{customerName}</span>? 
          Esta ação é permanente e não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all"
          >
            Excluir
          </button>
        </div>
      </motion.div>
    </div>
  );
}
