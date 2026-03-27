'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Settings, Trash2, Plus, Users,
  UserPlus, Plane, DollarSign, CreditCard,
  Upload, ChevronDown, ArrowUpDown
} from 'lucide-react';
import { Customer, Group } from '@/types';

interface CustomersViewProps {
  customers: Customer[];
  groups: Group[];
  onAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  currentUser: any;
  onAddGroup: () => void;
  onEditGroup: (group: Group) => void;
  onDeleteGroup: (id: string) => void;
  onCustomerClick: (customer: Customer) => void;
}

export function CustomersView({
  customers,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onCustomerClick,
  currentUser
}: CustomersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => {
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje.setDate(hoje.getDate() - 30));

    return {
      total: customers.length,
      novos: customers.filter(c => new Date(c.createdAt) >= trintaDiasAtras).length,
      emissoes: 0,
      faturamento: 0,
      emAberto: 0
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.cpfCnpj && c.cpfCnpj.includes(searchTerm))
    );
  }, [customers, searchTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Clientes" value={stats.total} icon={<Users className="w-4 h-4 text-purple-400" />} />
        <StatCard label="Novos" value={stats.novos} icon={<UserPlus className="w-4 h-4 text-purple-400" />} />
        <StatCard label="Emissões" value={stats.emissoes} icon={<Plane className="w-4 h-4 text-purple-400" />} />
        <StatCard label="Faturamento" value={formatCurrency(stats.faturamento)} icon={<DollarSign className="w-4 h-4 text-purple-400" />} />
        <StatCard label="Em Aberto" value={formatCurrency(stats.emAberto)} icon={<CreditCard className="w-4 h-4 text-green-400" />} />
      </div>

      <div className="bg-white dark:bg-[#1e293b] p-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col xl:flex-row items-center gap-3">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800/50 dark:text-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50">
            <Upload className="w-4 h-4" /> Importar
          </button>
          <button
            onClick={onAddCustomer}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-50 dark:border-slate-700/50 bg-white dark:bg-[#1e293b]/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Nome ↑</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Telefone</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Emissões</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Faturamento</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Passaporte</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Emissor</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3 text-left">
                    <button
                      onClick={() => onCustomerClick(customer)}
                      className="text-sm font-bold text-gray-900 dark:text-gray-100 hover:text-[#8B5CF6] transition-colors cursor-pointer"
                    >
                      {customer.name}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{customer.phone}</td>
                  <td className="px-6 py-3 text-sm text-center dark:text-gray-300">0</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">R$ 0,00</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`text-sm font-bold ${
                      customer.passportExpiry && customer.passportExpiry.startsWith(new Date().getFullYear().toString())
                        ? 'text-red-500 animate-pulse' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {customer.passportExpiry ? new Date(customer.passportExpiry + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded uppercase tracking-wider">
                      {customer.emissor || 'Sistema'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {(currentUser?.role === 'Administrador' || customer.emissor === `${currentUser?.name} ${currentUser?.lastName || ''}`.trim()) && (
                        <>
                          <button onClick={() => onEditCustomer(customer)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-purple-600 transition-colors"><Settings className="w-4 h-4" /></button>
                          <button onClick={() => onDeleteCustomer(customer)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm flex justify-between items-start">
      <div>
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className="p-1 bg-gray-50 dark:bg-slate-800/50 rounded-lg">{icon}</div>
    </div>
  );
}