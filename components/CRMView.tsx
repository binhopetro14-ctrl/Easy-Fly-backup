'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Settings, Plus, MoreHorizontal, 
  ChevronDown, Pencil, Columns, Filter,
  Phone, Mail, Calendar, User, DollarSign,
  GripVertical, Plane, Hotel, Shield, Car, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, CRMStatus, TeamMember } from '@/types';
import { useLeads } from '@/hooks/useLeads';

interface CRMViewProps {
  currentUser?: TeamMember | null;
  onAddLead: () => void;
  onEditLead: (lead: Lead) => void;
}

const COLUMNS: { id: CRMStatus; title: string; color: string; borderColor: string; bgColor: string }[] = [
  { id: 'novo_contato', title: 'Novo Contato', color: 'text-purple-600', borderColor: 'border-purple-500', bgColor: 'bg-purple-50' },
  { id: 'em_cotacao', title: 'Em Cotação', color: 'text-blue-600', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' },
  { id: 'proposta_enviada', title: 'Proposta Enviada', color: 'text-orange-600', borderColor: 'border-orange-500', bgColor: 'bg-orange-50' },
  { id: 'aprovado', title: 'Aprovado', color: 'text-green-600', borderColor: 'border-green-500', bgColor: 'bg-green-50' },
  { id: 'perdido', title: 'Perdido', color: 'text-red-600', borderColor: 'border-red-500', bgColor: 'bg-red-50' },
];

export function CRMView({ currentUser, onAddLead, onEditLead }: CRMViewProps) {
  const { leads, loading, updateLeadStatus, deleteLead, fetchLeads } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');

  // Sincroniza dados ao montar
  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone?.includes(searchTerm) ||
      l.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getColumnStats = (status: CRMStatus) => {
    const columnLeads = filteredLeads.filter(l => l.status === status);
    const totalValue = columnLeads.reduce((acc, l) => acc + l.value, 0);
    return { count: columnLeads.length, totalValue };
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      
      {/* 1. HEADER (Idêntico à imagem) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
             <div className="p-1 border border-gray-200 rounded">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-sm"></div>
                </div>
             </div>
             <span className="font-bold text-gray-800 dark:text-white">Funil Comercial</span>
             <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border-none rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm">
            <Columns className="w-4 h-4" />
            <span>Colunas</span>
          </button>
          <button 
            onClick={onAddLead}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Cotação</span>
          </button>
        </div>
      </div>

      {/* 2. KANBAN BOARD */}
      <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
        <div className="flex gap-4 min-w-full h-full pb-2">
          {COLUMNS.map((col) => {
            const { count, totalValue } = getColumnStats(col.id);
            const columnLeads = filteredLeads.filter(l => l.status === col.id);

            return (
              <div key={col.id} className="flex-1 min-w-[260px] max-w-[400px] flex flex-col h-full rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
                {/* Status Line At the Top */}
                <div className={`h-1.5 w-full ${col.borderColor.replace('border-', 'bg-')}`} />
                
                {/* Column Header */}
                <div className={`p-4 bg-white dark:bg-slate-800 border-b ${col.borderColor} dark:border-slate-700/50`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${col.color}`}>{col.title}</span>
                      <span className="bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                      {formatCurrency(totalValue)}
                    </span>
                  </div>
                </div>

                {/* Column Body */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                  {columnLeads.length > 0 ? (
                    columnLeads.map((lead) => (
                      <div 
                        key={lead.id}
                        onClick={() => onEditLead(lead)}
                        className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-500/30 transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-purple-600 transition-colors">
                            {lead.name}
                          </h4>
                          <button className="p-1 text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                            {formatCurrency(lead.value)}
                          </span>
                          {lead.items && lead.items.length > 0 && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 dark:bg-slate-700/50 rounded-md border border-gray-100 dark:border-slate-700">
                              <div className="flex gap-1">
                                {Array.from(new Set(lead.items.map(i => i.type))).map(type => (
                                  <React.Fragment key={type}>
                                    {type === 'passagem' && <Plane className="w-3 h-3 text-blue-400" />}
                                    {type === 'hospedagem' && <Hotel className="w-3 h-3 text-orange-400" />}
                                    {type === 'seguro' && <Shield className="w-3 h-3 text-green-400" />}
                                    {type === 'aluguel' && <Car className="w-3 h-3 text-purple-400" />}
                                    {type === 'adicionais' && <LayoutGrid className="w-3 h-3 text-gray-400" />}
                                  </React.Fragment>
                                ))}
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">{lead.items.length} ITENS</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-700">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border-2 border-white dark:border-slate-800">
                              <User className="w-3 h-3 text-purple-600" />
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                            {lead.emissor}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-gray-300 dark:text-slate-700 text-center px-4">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 dark:border-slate-800 flex items-center justify-center mb-4">
                        <Plus className="w-6 h-6 opacity-20" />
                      </div>
                      <p className="text-xs font-medium italic">Sem leads nesta etapa</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
