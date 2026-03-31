'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Settings, Plus, MoreHorizontal, 
  ChevronDown, Pencil, Columns, Filter,
  Phone, Mail, Calendar, User, DollarSign,
  GripVertical, Plane, Hotel, Shield, Car, LayoutGrid,
  Trash2, Luggage, Baby, ArrowRight, Clock, Users, MessageCircle, CheckCircle2,
  AlertCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, CRMStatus, TeamMember } from '@/types';
import { useLeads } from '@/hooks/useLeads';

interface CRMViewProps {
  leads: Lead[];
  loading: boolean;
  updateLeadStatus: (id: string, newStatus: CRMStatus) => Promise<any>;
  onUpdateLead: (lead: Partial<Lead>) => Promise<any>;
  fetchLeads: (params?: any) => Promise<void>;
  currentUser?: TeamMember | null;
  onAddLead: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
}

const COLUMNS: { id: CRMStatus; title: string; color: string; borderColor: string; bgColor: string; headerBg: string }[] = [
  { id: 'novo_contato', title: 'Novo Contato', color: 'text-purple-600', borderColor: 'border-purple-500', bgColor: 'bg-purple-50', headerBg: 'bg-purple-500' },
  { id: 'em_cotacao', title: 'Em Cotação', color: 'text-blue-600', borderColor: 'border-blue-500', bgColor: 'bg-blue-50', headerBg: 'bg-blue-500' },
  { id: 'proposta_enviada', title: 'Proposta Enviada', color: 'text-orange-600', borderColor: 'border-orange-500', bgColor: 'bg-orange-50', headerBg: 'bg-orange-500' },
  { id: 'aprovado', title: 'Aprovado', color: 'text-green-600', borderColor: 'border-green-500', bgColor: 'bg-green-50', headerBg: 'bg-green-500' },
  { id: 'perdido', title: 'Perdido', color: 'text-red-600', borderColor: 'border-red-500', bgColor: 'bg-red-50', headerBg: 'bg-red-500' },
];

export function CRMView({ 
  leads, 
  loading, 
  updateLeadStatus, 
  onUpdateLead,
  fetchLeads, 
  currentUser, 
  onAddLead, 
  onEditLead, 
  onDeleteLead 
}: CRMViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [now, setNow] = useState(new Date());
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'warning' } | null>(null);

  // Fecha notificação após 3 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Atualiza o tempo atual a cada minuto para cores dinâmicas
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Sincroniza dados ao montar
  React.useEffect(() => {
    if (leads.length === 0) fetchLeads();
  }, [fetchLeads, leads.length]);

  const getUrgency = (slaStartAt: string | undefined, createdAt: string) => {
    const startTime = new Date(slaStartAt || createdAt);
    const diff = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
    const hours = Math.floor(diff / 60);
    const label = hours > 0 ? `${hours}h${diff % 60}m` : `${diff}m`;
    
    if (diff < 120) return { 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500', 
      border: 'border-emerald-500', 
      animate: '',
      label, 
      text: 'Agente Ágil' 
    };
    if (diff < 360) return { 
      color: 'text-amber-500', 
      bg: 'bg-amber-500', 
      border: 'border-amber-500', 
      animate: 'animate-pulse-slow',
      label, 
      text: 'Atenção' 
    };
    return { 
      color: 'text-red-500', 
      bg: 'bg-red-500', 
      border: 'border-red-500', 
      animate: 'animate-pulse-fast',
      label, 
      text: 'Urgente' 
    };
  };

  const canModifyLead = (lead: Lead) => {
    if (!currentUser) return false;
    // Admins e Gerentes podem tudo
    if (currentUser.role === 'Administrador' || currentUser.role === 'Gerente') return true;
    
    // Outros perfis (Vendedor, Representante, etc.) só podem se forem os donos
    const currentUserName = `${currentUser.name} ${currentUser.lastName || ''}`.trim();
    return lead.emissor === currentUserName || lead.emissor === currentUser.email;
  };

  const handleToggleResponded = async (lead: Lead) => {
    if (!canModifyLead(lead)) {
      setNotification({ message: "Você não tem permissão para alterar este orçamento.", type: 'warning' });
      return;
    }
    await onUpdateLead({ ...lead, responded: !lead.responded });
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((l: Lead) => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone?.includes(searchTerm) ||
      (l.title && l.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [leads, searchTerm]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getColumnStats = (status: CRMStatus) => {
    const colLeads = leads.filter((l: Lead) => l.status === status);
    return {
      count: colLeads.length,
      totalValue: colLeads.reduce((sum: number, l: Lead) => sum + (l.value || 0), 0)
    };
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: CRMStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        // SEGURANÇA: Verificar se o usuário pode mover este lead
        if (!canModifyLead(lead)) {
          setNotification({ message: "Você não tem permissão para mover este orçamento de outro vendedor.", type: 'warning' });
          return;
        }

        // Preparamos apenas os dados que realmente mudaram (Delta Update)
        // Regra Especial 1: Se mover para Aprovado, abre o modal para obrigar preenchimento de venda e custo
        if (newStatus === 'aprovado' && lead.status !== 'aprovado') {
          onEditLead({ ...lead, status: 'aprovado' });
          return;
        }

        const updateData: Partial<Lead> = { 
          id: lead.id, 
          status: newStatus, 
          responded: false 
        };
        
        // Regra Especial 2: Só reseta o tempo se estiver saindo de 'Proposta Enviada' para 'Em Cotação'
        if (lead.status === 'proposta_enviada' && newStatus === 'em_cotacao') {
          updateData.slaStartAt = new Date().toISOString();
        }

        await onUpdateLead(updateData);
      }
    }
  };

  // Helper para extrair origem/destino do primeiro item de voo
  const getRouteInfo = (lead: Lead) => {
    const flight = lead.items?.find(item => item.type === 'passagem');
    if (flight && flight.origin && flight.destination) {
      return { origin: flight.origin, destination: flight.destination };
    }
    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#f8fafc] dark:bg-slate-950 p-2 pt-1 pb-0 animate-in fade-in duration-500 relative">
      
      {/* 0. NOTIFICAÇÃO PREMIUM */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[200]"
          >
            <div className="bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-500/20 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight">Acesso Restrito</p>
                <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400">{notification.message}</p>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. HEADER DO CRM */}
      <div className="flex justify-between items-center gap-3 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          {/* Espaço vazio para manter alinhamento ou remover se preferir */}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-xs w-48 md:w-64 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
            />
          </div>
          <button 
            onClick={onAddLead}
            className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-black transition-all shadow-lg active:scale-95 whitespace-nowrap uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Cotação</span>
          </button>
        </div>
      </div>

      {/* 2. KANBAN BOARD */}
      <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
        <div className="flex gap-4 min-w-full h-full pb-4">
          {COLUMNS.map((col) => {
            const { count, totalValue } = getColumnStats(col.id);
            const columnLeads = filteredLeads.filter(l => l.status === col.id);

            return (
              <div 
                key={col.id} 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="flex-1 min-w-[300px] flex flex-col h-full rounded-2xl bg-gray-50/50 dark:bg-slate-900/40 border-2 border-gray-200 dark:border-slate-800 overflow-hidden relative"
              >
                {/* Status Line (Top only) */}
                <div className={`h-1.5 w-full ${col.headerBg} opacity-100`} />
                
                {/* Column Header */}
                <div className="p-3 bg-white/50 dark:bg-slate-800/50 border-b border-gray-100/50 dark:border-slate-700/50 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-black uppercase text-[11px] tracking-widest ${col.color}`}>{col.title}</span>
                      <span className="text-gray-400 text-[9px] font-bold">({count})</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-400">
                      {formatCurrency(totalValue)}
                    </span>
                  </div>
                </div>

                {/* Column Body - STRETCH TO BOTTOM */}
                <div className="flex-1 p-2 overflow-y-auto space-y-2.5 custom-scrollbar h-full">
                  {columnLeads.length > 0 ? (
                    columnLeads.map((lead: Lead) => {
                      const route = getRouteInfo(lead);
                      const urgency = getUrgency(lead.slaStartAt, lead.createdAt);
                      const stopBlinking = ['proposta_enviada', 'aprovado', 'perdido'].includes(lead.status);
                      const finalAnimate = stopBlinking ? '' : urgency.animate;
                      let finalBorder = urgency.border;
                      let borderWidth = 'border-2';
                      if (lead.status === 'aprovado') {
                        finalBorder = 'border-emerald-500 shadow-sm shadow-emerald-500/10';
                        borderWidth = 'border-[3px]';
                      } else if (stopBlinking) {
                        finalBorder = 'border-gray-200 dark:border-slate-700/50';
                      }

                      return (
                        <motion.div 
                          layout
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e as any, lead.id)}
                          className={`p-3 bg-white dark:bg-slate-800 rounded-xl ${borderWidth} ${finalBorder} ${finalAnimate} hover:brightness-95 transition-all cursor-grab active:cursor-grabbing group relative`}
                        >
                           {/* SLA Badge OR Responded Toggle */}
                           <div className="absolute top-2 right-12 flex items-center gap-1.5 transition-opacity">
                              {lead.status === 'aprovado' ? (
                                <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                  <span className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-tighter">Vendido</span>
                                </div>
                              ) : lead.status === 'proposta_enviada' ? (
                                <button 
                                 onClick={(e) => { e.stopPropagation(); handleToggleResponded(lead); }}
                                 className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all flex items-center gap-1 ${lead.responded ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500'}`}
                               >
                                 {lead.responded && <CheckCircle2 className="w-2 h-2" />}
                                 {lead.responded ? 'Respondido' : 'Marcar Resposta'}
                               </button>
                             ) : (
                               <>
                                 <div className={`relative flex h-3 w-3 items-center justify-center`}>
                                    {urgency.bg === 'bg-red-500' && !stopBlinking && (
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    )}
                                    <div className={`relative inline-flex rounded-full h-3 w-3 ${urgency.bg} shadow-sm border border-white/40`} />
                                 </div>
                                 <span className={`text-[11px] font-black uppercase tracking-tighter ${urgency.color}`}>
                                    {urgency.label}
                                 </span>
                               </>
                             )}
                          </div>

                          {/* Botões de Ação */}
                          {canModifyLead(lead) && (
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onEditLead(lead); }}
                                className="p-1 px-1.5 bg-white dark:bg-slate-700 text-blue-500 rounded-lg border border-gray-100 dark:border-slate-600 hover:bg-blue-50"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteLead(lead.id); }}
                                className="p-1 px-1.5 bg-white dark:bg-slate-700 text-red-500 rounded-lg border border-gray-100 dark:border-slate-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <div className="flex flex-col gap-1.5">
                            {/* Linha 1: Título */}
                            <h4 className="font-black text-gray-900 dark:text-white text-[13px] leading-tight pr-10">
                              {lead.title || lead.name}
                            </h4>
                            
                            {/* Linha 2: Cliente + Rota + DURAÇÃO */}
                            <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-gray-400 uppercase tracking-tighter truncate">
                              <span className="shrink-0">{lead.name}</span>
                              {lead.duration && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-md font-black text-gray-500 bg-gray-100 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/50 shadow-sm animate-in fade-in duration-300">
                                  {lead.duration}{lead.duration.toUpperCase().includes('D') ? '' : 'D'}
                                </span>
                              )}
                              {route && (
                                <>
                                  <div className="w-0.5 h-0.5 bg-gray-300 rounded-full shrink-0" />
                                  <div className="flex items-center gap-0.5 text-purple-500 font-black shrink-0">
                                    <span>{route.origin}</span>
                                    <ArrowRight className="w-2.5 h-2.5" />
                                    <span>{route.destination}</span>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Linha 3: Tags + Stats (Juntas) + Valor (Direita) */}
                            <div className="flex items-center justify-between gap-2 mt-1 pt-1.5 border-t border-gray-50 dark:border-slate-700/50">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                {/* Stats (Compactas) */}
                                <div className="flex items-center gap-1.5 opacity-60 mr-1.5 border-r border-gray-100 pr-1.5">
                                  <div className="flex items-center gap-0.5">
                                    <User className="w-2.5 h-2.5 text-gray-400" />
                                    <span className="text-[9px] font-black text-gray-700 dark:text-gray-300">{lead.adults || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-0.5">
                                    <Users className="w-2.5 h-2.5 text-gray-400" />
                                    <span className="text-[9px] font-black text-gray-700 dark:text-gray-300">{lead.children || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-0.5">
                                    <Baby className="w-2.5 h-2.5 text-gray-400" strokeWidth={3} />
                                    <span className="text-[9px] font-black text-gray-700 dark:text-gray-300">{lead.babies || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-0.5">
                                    <Luggage className="w-2.5 h-2.5 text-gray-400" />
                                    <span className="text-[9px] font-black text-gray-700 dark:text-gray-300">{lead.luggage23kg || 0}</span>
                                  </div>
                                </div>

                                {/* Tags (Flexível) */}
                                {lead.tags && lead.tags.length > 0 && (
                                  <div className="flex gap-0.5 overflow-hidden">
                                    {lead.tags.map((tag: string, idx: number) => (
                                      <span key={idx} className="px-1.5 py-0 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 text-[8px] font-black rounded border border-cyan-100/50 tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Valor */}
                              {(lead.value || 0) > 0 && (
                                <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 whitespace-nowrap">
                                  {formatCurrency(lead.value || 0)}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 h-40 opacity-20">
                      <LayoutGrid className="w-8 h-8 text-gray-400" />
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
