import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, MessageCircle, Handshake, Flame, RefreshCcw, CheckCircle2, Phone, User, Users, Baby, Luggage } from 'lucide-react';
import { Lead, TeamMember } from '@/types';

interface AcoesDoDiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onUpdateLead: (lead: Partial<Lead>) => Promise<any>;
  currentUser?: TeamMember | null;
}

export function AcoesDoDiaModal({ isOpen, onClose, leads, onUpdateLead, currentUser }: AcoesDoDiaModalProps) {
  const [filter, setFilter] = useState<'todos' | 'recentes' | 'atrasados'>('todos');
  const [activeTab, setActiveTab] = useState<'proposta' | 'resposta'>('resposta');
  const [lockedHint, setLockedHint] = useState<string | null>(null); // leadId_stageId


  // Helper para iniciais (Ex: Cleber Andrade -> CA)
  const getInitials = (name?: string, lastName?: string) => {
    if (!name) return '??';
    const first = name[0];
    const last = lastName ? lastName[0] : name[1] || '';
    return (first + last).toUpperCase();
  };

  // Helper para extrair origem/destino do lead
  const getRouteInfo = (lead: Lead) => {
    const flight = lead.items?.find((item: any) => item.type === 'passagem');
    if (!flight) return null;

    if (flight.origin && flight.destination) {
      return { origin: flight.origin, destination: flight.destination };
    }

    const segs = flight.outboundSegments;
    if (segs && segs.length > 0) {
      const origin = segs[0].origin;
      const destination = segs[segs.length - 1].destination;
      if (origin && destination) {
        return { origin, destination };
      }
    }
    return null;
  };

  // Definição dos estágios de follow-up
  const STAGES = [
    {
      id: 'relembrar',
      label: 'RELEMBRAR',
      hours: 6,
      msg: 'Conseguiu dar uma olhada? 🙂',
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30',
      badgeColor: 'text-emerald-700',
      icon: <MessageCircle />
    },
    {
      id: 'ajudarDecisao',
      label: 'AJUDAR DECISÃO',
      hours: 24,
      msg: 'Oi {nome}, ficou com alguma dúvida sobre a proposta? Se quiser, posso ajustar datas ou valores pra encaixar melhor pra você',
      color: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30',
      badgeColor: 'text-green-700',
      icon: <Handshake />
    },
    {
      id: 'cobrar',
      label: 'COBRAR CLIENTE',
      hours: 48,
      msg: 'Você ainda tem interesse nessa viagem ou prefere que eu te envie outras opções?',
      color: 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-emerald-700/30',
      badgeColor: 'text-emerald-800',
      icon: <Flame />
    }
  ];

  // Filtrar apenas leads em proposta enviada
  const followUps = useMemo(() => {
    const raw = leads.filter(l => {
      if (activeTab === 'proposta') {
        return l.status === 'novo_contato' || l.status === 'em_cotacao';
      }
      return l.status === 'proposta_enviada' && !l.responded;
    });

    return raw.map(lead => {
      // Tempo desde o envio da proposta (fallback para createdAt ou updatedAt)
      const startTime = new Date(lead.propostaEnviadaAt || lead.createdAt || lead.updatedAt).getTime();
      const diffMs = new Date().getTime() - startTime;
      const totalHoursElapsed = Math.floor(diffMs / (1000 * 60 * 60));

      const stagesWithData = STAGES.map(stage => {
        const isCompleted = lead.followUpHistory?.[stage.id]?.completed || false;
        const remainingHours = stage.hours - totalHoursElapsed;
        const isAvailable = remainingHours <= 0;

        let countdownLabel = '';
        if (isCompleted) {
          countdownLabel = 'Concluído';
        } else if (isAvailable) {
          countdownLabel = 'DISPONÍVEL\nAGORA';
        } else {
          countdownLabel = `em ${remainingHours}h`;
        }

        // Customizar mensagem com o nome do cliente
        const finalMsg = stage.msg.replace('{nome}', lead.name.split(' ')[0]);

        return {
          ...stage,
          isCompleted,
          isAvailable,
          countdownLabel,
          finalMsg,
          completedBy: lead.followUpHistory?.[stage.id]?.completedBy,
          completedAt: lead.followUpHistory?.[stage.id]?.completedAt
        };
      });

      const isUrgente = totalHoursElapsed >= 48 && !lead.followUpHistory?.cobrar?.completed;

      return {
        ...lead,
        totalHoursElapsed,
        stages: stagesWithData,
        isUrgente
      };
    }).sort((a, b) => b.totalHoursElapsed - a.totalHoursElapsed);
  }, [leads, activeTab]);

  const filtered = useMemo(() => {
    if (filter === 'recentes') return followUps.filter(f => f.totalHoursElapsed < 24);
    if (filter === 'atrasados') return followUps.filter(f => f.isUrgente);
    return followUps;
  }, [followUps, filter]);

  const handleToggleFollowUp = async (lead: Lead, stageId: string) => {
    const stage = lead.followUpHistory?.[stageId];
    const newHistory = { ...(lead.followUpHistory || {}) };

    if (stage?.completed) {
      // Desmarcar (opcional, mas vamos permitir para correções)
      delete newHistory[stageId];
    } else {
      // Marcar como concluído
      const initials = getInitials(currentUser?.name, currentUser?.lastName);
      newHistory[stageId] = {
        completed: true,
        completedBy: initials,
        completedAt: new Date().toISOString()
      };
    }

    await onUpdateLead({ id: lead.id, followUpHistory: newHistory });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white/90 dark:bg-slate-900/95 w-full max-w-[1200px] rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-white/20 dark:border-slate-800/50 overflow-hidden flex flex-col max-h-[92vh] backdrop-blur-3xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <span className="text-yellow-500">⚡</span> Ações do Dia
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sub-header Controls */}
          <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              {/* Novo Badge Fixo de Orçamento (Lado Esquerdo) */}
              {(() => {
                const count = leads.filter(l => l.status === 'novo_contato' || l.status === 'em_cotacao').length;
                if (count === 0) return null;
                return (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-100 dark:border-red-500/20 shadow-sm transition-all hover:scale-105">
                    <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm shadow-red-500/40">
                      {count}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.05em] text-red-600 dark:text-red-400">
                      Leads aguardando orçamento
                    </span>
                  </div>
                );
              })()}

              {/* Integrated Tabs */}
              <div className="flex bg-gray-100 dark:bg-slate-800/60 p-1 rounded-xl border border-gray-200/50 dark:border-slate-700/50">
                <button
                  onClick={() => setActiveTab('proposta')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === 'proposta'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-black'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-bold'
                  }`}
                >
                  Esperando Proposta
                </button>
                <button
                  onClick={() => setActiveTab('resposta')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === 'resposta'
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 font-black'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-bold'
                  }`}
                >
                  Esperando Resposta
                </button>
              </div>

              {/* Novo Badge Fixo de Acompanhamento (Lado Direito) */}
              {(() => {
                const count = leads.filter(l => l.status === 'proposta_enviada' && !l.responded).length;
                if (count === 0) return null;
                return (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-100 dark:border-red-500/20 shadow-sm transition-all hover:scale-105">
                    <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm shadow-red-500/40">
                      {count}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.05em] text-red-600 dark:text-red-400">
                      Propostas em acompanhamento
                    </span>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
              <button
                onClick={() => setFilter('todos')}
                className={`hover:text-gray-600 dark:hover:text-gray-200 transition-all ${filter === 'todos' ? 'text-[#19727d] dark:text-cyan-400 scale-105' : ''}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('recentes')}
                className={`hover:text-gray-600 dark:hover:text-gray-200 transition-all ${filter === 'recentes' ? 'text-[#19727d] dark:text-cyan-400 scale-105' : ''}`}
              >
                Recentes
              </button>
              <button
                onClick={() => setFilter('atrasados')}
                className={`hover:text-gray-600 dark:hover:text-gray-200 transition-all ${filter === 'atrasados' ? 'text-[#19727d] dark:text-cyan-400 scale-105' : ''}`}
              >
                Urgentes
              </button>
              <button onClick={() => setFilter('todos')} className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-400">
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
            {filtered.length > 0 ? (
              filtered.map((lead) => {
                const route = getRouteInfo(lead);
                return (
                  <div key={lead.id} className="bg-white/50 dark:bg-slate-800/40 border border-white dark:border-slate-700/50 rounded-xl p-3 md:p-3.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.1)] transition-all flex flex-col lg:flex-row gap-4 lg:gap-4.5 relative group backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/5">

                    {/* LADO ESQUERDO: INFOS DO LEAD */}
                    <div className="flex-[1.2] min-w-0">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex flex-shrink-0 items-center justify-center text-lg font-black text-white shadow-md transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 ${lead.isUrgente ? 'bg-rose-400' : 'bg-gradient-to-br from-[#19727d] to-cyan-600 shadow-cyan-500/10'}`}>
                          {lead.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <h4 className="text-[14px] font-black leading-tight text-slate-900 dark:text-white">
                            {lead.title || 'Cotação sem título'}
                          </h4>
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-2">
                            <span>{lead.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 flex flex-col gap-0.5">
                        {/* LINHA 1: ROTA + WHATSAPP */}
                        <div className="flex items-center gap-6">
                          {route && (
                            <div className="text-blue-600 dark:text-blue-400 text-[11px] font-black tracking-tight flex items-center gap-1 min-w-[110px]">
                              {route.origin} <span className="text-[10px] opacity-60">✈️</span> {route.destination}
                            </div>
                          )}
                          
                          {lead.phone && (
                            <a 
                              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="w-2.5 h-2.5" />
                              <span className="text-[10px] font-black tracking-tighter">{lead.phone}</span>
                            </a>
                          )}
                        </div>

                        {/* LINHA 2: EMISSOR + TEMPO */}
                        <div className="flex items-center gap-6">
                          <div className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wide min-w-[110px]">
                            {lead.emissor || 'Emissor não identificado'}
                          </div>

                          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-500">
                            <Clock className="w-3 h-3 opacity-80" />
                            <span className="text-[10.5px] font-black uppercase tracking-widest whitespace-nowrap">
                              {lead.totalHoursElapsed}H <span className="font-medium opacity-60 italic text-[9px]">SEM RESPOSTA</span>
                            </span>
                          </div>
                        </div>

                        {/* LINHA 3: PAX + AÉREO + TAGS */}
                        <div className="flex items-center gap-2 mt-1">
                          {/* PAX ICONS */}
                          <div className="flex items-center gap-1.5 opacity-60 shrink-0">
                            <div className="flex items-center gap-0.5">
                              <User className="w-2.5 h-2.5 text-slate-400" />
                              <span className="text-[9px] font-black text-slate-700 dark:text-slate-300">{lead.adults || 0}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Users className="w-2.5 h-2.5 text-slate-400" />
                              <span className="text-[9px] font-black text-slate-700 dark:text-slate-300">{lead.children || 0}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Baby className="w-2.5 h-2.5 text-slate-400" />
                              <span className="text-[9px] font-black text-slate-700 dark:text-slate-300">{lead.babies || 0}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Luggage className="w-2.5 h-2.5 text-slate-400" />
                              <span className="text-[9px] font-black text-slate-700 dark:text-slate-300">{lead.luggage23kg || 0}</span>
                            </div>
                          </div>

                          <span className="h-2 w-[1px] bg-slate-200 dark:bg-slate-800" />

                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="text-[8px] font-black text-blue-400/80 dark:text-cyan-500/70 uppercase tracking-[0.2em] shrink-0">
                              AÉREO
                            </div>
                            
                            {lead.tags && lead.tags.length > 0 && (
                              <div className="flex gap-1 overflow-hidden">
                                {lead.tags.map((tag, idx) => (
                                  <span key={idx} className="px-1.5 py-0 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 text-[8px] font-black rounded border border-blue-100 dark:border-blue-500/20 uppercase tracking-tighter whitespace-nowrap">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {lead.isUrgente && (
                          <div className="mt-1 inline-flex items-center gap-1 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">
                            <span>✨</span> URGENTE
                          </div>
                        )}
                      </div>
                    </div>

                    {/* LADO DIREITO: ESTÁGIOS DE FOLLOW-UP (Apenas para aba de Resposta) */}
                    {activeTab === 'resposta' && (
                      <div className="flex-4 flex flex-col gap-0 min-w-[320px]">
                        {lead.stages.map((stage) => (
                          <div key={stage.id} className="flex items-center gap-1 group/row bg-gray-50/100 dark:bg-slate-900/40 p-0.5 rounded-lg border border-transparent hover:border-gray-100 dark:hover:border-slate-700 transition-all">

                            <div className="bg-slate-50/80 dark:bg-slate-900/40 rounded-[1rem] p-2.5 lg:p-3 border border-slate-200/50 dark:border-slate-800/50 flex-1 relative group/msg">
                              <p className="text-[9px] md:text-[10px] text-slate-600 dark:text-slate-300 italic leading-snug">
                                {stage.finalMsg}
                              </p>
                              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-slate-50/80 dark:bg-slate-900/40 rotate-45 border-l border-b border-slate-200/50 dark:border-slate-800/50 hidden lg:block" />
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* BOTÃO WHATSAPP */}
                              <div className="relative flex">
                                <a
                                  href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(stage.finalMsg)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`group/btn inline-flex items-center justify-between gap-2 w-full lg:w-[170px] px-3 py-1.5 rounded-lg font-black text-[8px] md:text-[9px] uppercase tracking-widest transition-all shadow-md active:scale-95 border-t border-white/20 hover:brightness-110 ${stage.isCompleted ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50 grayscale' : stage.color}`}
                                >
                                  <span className="flex items-center gap-2 whitespace-nowrap">
                                    {stage.icon && React.cloneElement(stage.icon as any, { className: 'w-3.5 h-3.5' })}
                                    {stage.label}
                                  </span>

                                  <div className={`px-1 py-0.5 rounded-lg text-[6.5px] font-black bg-white shadow-sm whitespace-pre-line leading-[1.1] text-center flex items-center justify-center min-w-[50px] group-hover/btn:scale-105 transition-transform ${stage.badgeColor}`}>
                                    {stage.countdownLabel}
                                  </div>
                                </a>
                              </div>

                              {/* CÍRCULO DE CONCLUSÃO */}
                              <div className="flex flex-col items-center gap-0.5 min-w-[45px]">
                                {(stage.isCompleted || stage.isAvailable) && (
                                  <>
                                    {!stage.isCompleted ? (
                                      <button
                                        onClick={() => handleToggleFollowUp(lead, stage.id)}
                                        className="w-6 h-6 rounded-full border-[1px] border-emerald-500/50 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white hover:scale-110 shadow-md shadow-emerald-500/10 flex items-center justify-center transition-all shadow-sm"
                                      >
                                        <CheckCircle2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleToggleFollowUp(lead, stage.id)}
                                        className="flex items-center gap-1 animate-in zoom-in duration-300 group/undo relative"
                                        title="Clique para desmarcar"
                                      >
                                        <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-md shadow-black/20 group-hover/undo:bg-red-500 transition-colors">
                                          <span className="text-[9px] font-black group-hover/undo:hidden">{stage.completedBy}</span>
                                          <X className="w-4 h-4 hidden group-hover/undo:block" />
                                        </div>
                                      </button>
                                    )}
                                    <span className="text-[7px] font-black uppercase text-gray-400 tracking-tighter mt-0.5">
                                      {stage.isCompleted ? 'Concluído' : 'Já contatei'}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500 bg-white/50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.2em] opacity-60">🎉 Tudo em dia!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <button onClick={onClose} className="text-xs font-black uppercase tracking-[0.3em] text-[#19727d] dark:text-cyan-500 hover:text-cyan-600 transition-colors">
              Fechar painel de controle
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
