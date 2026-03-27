'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Settings,
  Trash2,
  Plus,
  Building2,
  Users,
  Plane,
  DollarSign,
  Clock,
  Upload,
  ChevronDown
} from 'lucide-react';
import { Supplier } from '@/types';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier: () => void;
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplier: Supplier) => void;
  currentUser: any;
}

export function SuppliersView({
  suppliers,
  onAddSupplier,
  onEditSupplier,
  onDeleteSupplier,
  currentUser
}: SuppliersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // --- Lógica de CRUD & Cálculos (Derivados do Supabase) ---
  const stats = useMemo(() => {
    return {
      total: suppliers.length,
      ativos: suppliers.length, // Pode ser filtrado se houver campo 'status'
      emissoes: 0, // Integração futura com tabela de vendas
      gastoTotal: 0, // Integração futura com financeiro
      emAberto: 0
    };
  }, [suppliers]);

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cnpj.includes(searchTerm);
    return matchesSearch;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="w-full space-y-6">

      {/* 1. Cards de Indicadores (Dashboard superior) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Fornecedores</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <Building2 className="w-5 h-5 text-purple-300" />
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Ativos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.ativos}</p>
          </div>
          <Users className="w-5 h-5 text-purple-300" />
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Emissões</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.emissoes}</p>
          </div>
          <Plane className="w-5 h-5 text-purple-300" />
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Total Gasto</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.gastoTotal)}</p>
          </div>
          <DollarSign className="w-5 h-5 text-purple-300" />
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Em Aberto</p>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(stats.emAberto)}</p>
          </div>
          <DollarSign className="w-5 h-5 text-purple-300" />
        </div>
      </div>

      {/* 2. Barra de Busca e Ações Primárias */}
      <div className="bg-white dark:bg-[#1e293b] p-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col md:flex-row items-center gap-3">
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

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-gray-50 dark:bg-slate-800/50 border-none rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
            >
              <option>Todos</option>
              <option>Ativos</option>
              <option>Inativos</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-gray-100 dark:border-slate-700/50">
            <Upload className="w-4 h-4" /> Importar
          </button>

          <button
            onClick={onAddSupplier}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Novo Fornecedor
          </button>
        </div>
      </div>

      {/* 3. Tabela de Fornecedores */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-50 dark:border-slate-700/50 bg-white dark:bg-[#1e293b]/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500">Nome ↑</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500">CPF/CNPJ</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500">Tags</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500">Telefone</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500">Emissões ↑↓</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500">Total Gasto ↑↓</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500">Em Aberto ↑↓</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500 text-center">Emissor</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500">Status</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-3">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{supplier.name}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{supplier.cnpj || '-'}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold rounded uppercase">Fornecedor</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{supplier.phone || '-'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">0</td>
                  <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">R$ 0,00</td>
                  <td className="px-6 py-3 text-sm text-green-500 font-medium">R$ 0,00</td>
                  <td className="px-6 py-3 text-center">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded uppercase tracking-wider">
                      {supplier.emissor || 'Sistema'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 uppercase">
                      Ativo
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {(currentUser?.role === 'Administrador' || supplier.emissor === `${currentUser?.name} ${currentUser?.lastName || ''}`.trim()) && (
                        <>
                          <button onClick={() => onEditSupplier(supplier)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-purple-600 transition-colors"><Settings className="w-4 h-4" /></button>
                          <button onClick={() => onDeleteSupplier(supplier)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSuppliers.length === 0 && (
            <div className="p-20 text-center text-gray-400 text-sm">
              Nenhum fornecedor cadastrado
            </div>
          )}
        </div>
      </div>

    </div>
  );
}