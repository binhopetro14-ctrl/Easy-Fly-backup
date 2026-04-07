import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MessageCircle, Handshake, Flame, RefreshCcw } from 'lucide-react';
import { Lead } from '@/types';

interface AcoesDoDiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
}

export function AcoesDoDiaModal({ isOpen, onClose, leads }: AcoesDoDiaModalProps) {
  const [filter, setFilter] = useState<'todos' | 'recentes' | 'atrasados'>('todos');

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

  // Filtrar apenas leads em proposta não respondida
  const followUps = useMemo(() => {
    const raw = leads.filter(l => l.status === 'proposta_enviada' && !l.responded);
    
    return raw.map(lead => {
      const start = new Date(lead.updatedAt || lead.createdAt).getTime();
      const diffMs = new Date().getTime() - start;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const formattedHours = hours < 1 ? '< 1h' : `${hours.toString().padStart(2, '0')}h`;

      let category: 'recente' | 'pendente' | 'urgente' = 'recente';
      let msg = "Conseguiu dar uma olhada? 🙂";
      let btnLabel = "Relembrar";
      let btnIcon = <MessageCircle className="w-3.5 h-3.5" />;
      let badgeLabel = "RECENTE";
      let badgeStyle = "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      let btnStyle = "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20";
      let subLabel = "Sugestão de msg pronta";

      if (hours >= 24 && hours < 48) {
        category = 'pendente';
        msg = "Ficou com alguma dúvida? Posso ajudar algo pra você";
        btnLabel = "Ajudar decisão";
        btnIcon = <Handshake className="w-3.5 h-3.5" />;
        badgeLabel = "PENDENTE";
        badgeStyle = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
        btnStyle = "bg-amber-400 hover:bg-amber-500 text-amber-900 shadow-amber-500/20";
        subLabel = "Última tentativa";
      } else if (hours >= 48) {
        category = 'urgente';
        msg = "Você ainda tem interesse nessa viagem ou prefere que eu te envie outras opções?";
        btnLabel = "Cobrar cliente";
        btnIcon = <Flame className="w-3.5 h-3.5" />;
        badgeLabel = "URGENTE";
        badgeStyle = "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
        btnStyle = "bg-[#f43f5e] hover:bg-[#e11d48] text-white shadow-red-500/20";
        subLabel = "Última tentativa";
      }

      return {
        ...lead,
        hours,
        formattedHours,
        category,
        msg,
        btnLabel,
        btnIcon,
        badgeLabel,
        badgeStyle,
        btnStyle,
        subLabel
      };
    }).sort((a, b) => b.hours - a.hours); // Prioridade para os mais atrasados
  }, [leads]);

  const filtered = useMemo(() => {
    if (filter === 'recentes') return followUps.filter(f => f.category === 'recente');
    if (filter === 'atrasados') return followUps.filter(f => f.category !== 'recente');
    return followUps;
  }, [followUps, filter]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <span className="text-yellow-500">⚡</span> Ações do Dia
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-header Controls */}
          <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-800/50">
            {followUps.length > 0 ? (
              <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-lg border border-red-100 dark:border-red-500/20">
                <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-black text-white">
                  {followUps.length}
                </span>
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  follow-ups pendentes hoje
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Nenhum follow-up pendente
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
              <button 
                onClick={() => setFilter('todos')} 
                className={`hover:text-gray-600 dark:hover:text-gray-200 uppercase tracking-widest transition-colors ${filter === 'todos' ? 'text-gray-800 dark:text-white font-black' : ''}`}
              >
                Todos
              </button>
              <span>•</span>
              <button 
                onClick={() => setFilter('recentes')} 
                className={`hover:text-gray-600 dark:hover:text-gray-200 uppercase tracking-widest transition-colors ${filter === 'recentes' ? 'text-gray-800 dark:text-white font-black' : ''}`}
              >
                Recentes
              </button>
              <span>•</span>
              <button 
                onClick={() => setFilter('atrasados')} 
                className={`hover:text-gray-600 dark:hover:text-gray-200 uppercase tracking-widest transition-colors ${filter === 'atrasados' ? 'text-gray-800 dark:text-white font-black' : ''}`}
              >
                Atrasados
              </button>
              <button onClick={() => setFilter('todos')} title="Atualizar / Mostrar Todos" className="p-1 ml-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-md transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const route = getRouteInfo(item);
                return (
                <div key={item.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative">
                  
                  {/* Top info row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex gap-3">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex flex-shrink-0 items-center justify-center text-xs font-black text-white ${item.category === 'recente' ? 'bg-emerald-500' : item.category === 'pendente' ? 'bg-amber-400' : 'bg-[#f43f5e]'}`}>
                        L
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[14px] font-bold text-gray-900 dark:text-white truncate pr-2">
                          {item.title || 'Cotação em andamento'}
                        </h4>
                        
                        <div className="flex flex-col mt-1">
                          {/* Name and Route */}
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            <span className="truncate">{item.name}</span>
                            {route && (
                              <>
                                <span className="text-gray-300 dark:text-gray-600">•</span>
                                <span className="truncate text-blue-600 dark:text-blue-400">
                                  {route.origin} <span className="opacity-70 px-0.5">✈️</span> {route.destination}
                                </span>
                              </>
                            )}
                          </div>
                          
                          {/* Emissor and tags */}
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-wide mt-1">
                            <span className="truncate">{item.emissor || 'Sem dono'}</span>
                            {item.emissor && <span className="text-gray-300 dark:text-gray-600">•</span>}
                            {item.tags && item.tags[0] && (
                              <span className="truncate">{item.tags[0]}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Badge right */}
                    <div className={`px-2 py-0.5 rounded flex items-center justify-center border font-black text-[9px] tracking-wide uppercase shrink-0 ${item.badgeStyle}`}>
                      {item.badgeLabel}
                    </div>
                  </div>

                  {/* Bottom section: Message and Action side-by-side */}
                  <div className="flex items-end justify-between gap-4 mt-1 border-t border-gray-50 dark:border-slate-700/50 pt-3">
                    {/* Left: Time and text msg */}
                    <div className="flex flex-col gap-2 flex-1 pb-1">
                      <div className="inline-flex max-w-fit items-center gap-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded border border-purple-100 dark:border-purple-500/20">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{item.formattedHours} sem resposta</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 pr-2">
                        {item.msg}
                      </p>
                    </div>

                    {/* Right: Button and Sublabel */}
                    <div className="flex flex-col items-end shrink-0">
                       <a
                          href={`https://wa.me/${item.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(item.msg)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg font-black text-xs uppercase shadow-sm hover:shadow-md transition-all focus:ring-2 ${item.btnStyle}`}
                       >
                          {item.btnIcon}
                          {item.btnLabel}
                          <span className="ml-1 opacity-70 text-[10px]">&gt;</span>
                       </a>
                       <div className="mt-1.5 mr-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">
                         {item.subLabel}
                       </div>
                    </div>
                  </div>

                </div>
              );
            })
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-500">
                <span className="text-3xl mb-2">🎉</span>
                <p className="text-sm font-medium">Você está com tudo em dia!</p>
              </div>
            )}
          </div>

          {/* Footer Link */}
          <div className="p-3 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <button onClick={onClose} className="text-xs font-bold text-[#19727d] dark:text-cyan-500 hover:underline">
              Fechar painel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
