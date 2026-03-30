'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Users, Mail, AlertCircle, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Customer, Address } from '@/types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Customer>) => void;
  customer: Customer | null;
}

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <div className="flex items-center gap-2 py-2 border-b border-gray-100 dark:border-slate-700/50 mb-4 mt-6 first:mt-0">
    <div className="text-cyan-500">{icon}</div>
    <h3 className="text-sm font-bold text-[#19727d] dark:text-cyan-400">{title}</h3>
  </div>
);

export function CustomerModal({ 
  isOpen, 
  onClose, 
  onSave, 
  customer 
}: CustomerModalProps) {
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (customer) {
          setFormData({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            cpfCnpj: customer.cpfCnpj,
            rg: customer.rg,
            passportNumber: customer.passportNumber,
            passportExpiry: customer.passportExpiry,
            birthDate: customer.birthDate,
            notes: customer.notes,
            address: { ...customer.address }
          });
        } else {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            cpfCnpj: '',
            rg: '',
            passportNumber: '',
            passportExpiry: '',
            birthDate: '',
            notes: '',
            address: {
              cep: '',
              street: '',
              number: '',
              complement: '',
              neighborhood: '',
              city: '',
              state: '',
            }
          });
        }
        setError(null);
      }, 0);
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      setError('É necessário preencher os campos marcados com *');
      return;
    }
    onSave(formData);
  };

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
        className="relative w-full max-w-2xl bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 dark:border-slate-700/50"
      >
        <div className="p-4 border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-200">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{customer ? 'Editar Cliente' : 'Novo Cliente'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-bold"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <div>
            <SectionHeader icon={<Users className="w-4 h-4" />} title="Identificação" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Nome *</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Primeiro nome"
                  value={formData.firstName}
                  onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Sobrenome *</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Sobrenome"
                  value={formData.lastName}
                  onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div>
            <SectionHeader icon={<Mail className="w-4 h-4" />} title="Contato" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Telefone *</label>
                <input 
                  required
                  type="tel" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div>
            <SectionHeader icon={<AlertCircle className="w-4 h-4" />} title="Documentos" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">CPF / CNPJ</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="000.000.000-00"
                  value={formData.cpfCnpj}
                  onChange={e => setFormData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">RG</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="00.000.000-0"
                  value={formData.rg}
                  onChange={e => setFormData(prev => ({ ...prev, rg: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Número do Passaporte</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="AB123456"
                  value={formData.passportNumber}
                  onChange={e => setFormData(prev => ({ ...prev, passportNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Validade do Passaporte</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  value={formData.passportExpiry}
                  onChange={e => setFormData(prev => ({ ...prev, passportExpiry: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div>
            <SectionHeader icon={<AlertCircle className="w-4 h-4" />} title="Informações Adicionais" />
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Data de Aniversário</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  value={formData.birthDate}
                  onChange={e => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Observações</label>
                <textarea 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm min-h-[100px] text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Observações sobre o cliente"
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div>
            <SectionHeader icon={<MapPin className="w-4 h-4" />} title="Endereço para NF" />
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500">CEP</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="00000-000"
                  value={formData.address?.cep}
                  onChange={e => setFormData(prev => ({ ...prev, address: { ...prev.address!, cep: e.target.value } }))}
                />
              </div>
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-bold text-gray-500">Logradouro</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Rua, Avenida..."
                  value={formData.address?.street}
                  onChange={e => setFormData(prev => ({ ...prev, address: { ...prev.address!, street: e.target.value } }))}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500">Número</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="123"
                  value={formData.address?.number}
                  onChange={e => setFormData(prev => ({ ...prev, address: { ...prev.address!, number: e.target.value } }))}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500">Complemento</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Apto, Sala..."
                  value={formData.address?.complement}
                  onChange={e => setFormData(prev => ({ ...prev, address: { ...prev.address!, complement: e.target.value } }))}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500">Bairro</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Bairro"
                  value={formData.address?.neighborhood}
                  onChange={e => setFormData(prev => ({ ...prev, address: { ...prev.address!, neighborhood: e.target.value } }))}
                />
              </div>
              <div className="md:col-span-5 space-y-1">
                <label className="text-xs font-bold text-gray-500">Cidade</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Cidade"
                  value={formData.address?.city}
                  onChange={e => setFormData(prev => ({ ...prev, address: { ...prev.address!, city: e.target.value } }))}
                />
              </div>
              <div className="md:col-span-1 space-y-1">
                <label className="text-xs font-bold text-gray-500">UF</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="RJ"
                  value={formData.address?.state}
                  onChange={e => setFormData(prev => ({ ...prev, address: { ...prev.address!, state: e.target.value } }))}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-gray-100 dark:border-slate-700/50 flex justify-end gap-3 bg-gray-50/50 dark:bg-[#1e293b]">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={() => handleSubmit()}
            className="px-8 py-2 bg-[#06B6D4] text-white font-bold rounded-xl hover:bg-[#0891B2] shadow-lg shadow-cyan-500/20 transition-all"
          >
            Salvar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
