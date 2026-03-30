'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Plane, Hotel, Shield, Car, Trash2, Layout, 
  Tag as TagIcon, Minus, Luggage, User, Baby, Clock,
  MapPin, Pencil, Search, ChevronDown, Target, Phone, Mail, FileText, Users, MessageCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NumericFormat } from 'react-number-format';
import { Lead, CRMStatus, Customer, Group, Supplier } from '@/types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  editingLead?: Lead | null;
  suppliers: Supplier[];
}

// FUNÇÃO PARA FORMATAR AS DATAS: "05 à 20 Out."
const formatDateRange = (start: string, end: string) => {
  if (!start || !end) return '';
  const months = ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'];
  const [sYear, sMonth, sDay] = start.split('-');
  const [eYear, eMonth, eDay] = end.split('-');
  if (!sDay || !eDay) return '';

  if (sMonth === eMonth) {
    return `${sDay} à ${eDay} ${months[parseInt(sMonth, 10) - 1]}`;
  } else {
    return `${sDay} ${months[parseInt(sMonth, 10) - 1]} à ${eDay} ${months[parseInt(eMonth, 10) - 1]}`;
  }
};

const STATUS_OPTIONS: { value: CRMStatus; label: string }[] = [
  { value: 'novo_contato', label: 'Novo Contato' },
  { value: 'em_cotacao', label: 'Em Cotação' },
  { value: 'proposta_enviada', label: 'Proposta Enviada' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'perdido', label: 'Perdido' },
];

const AIRLINES = ['LATAM','Gol','Azul','Avianca','TAP Portugal','British Airways','Iberia','Air France','KLM','Lufthansa','ITA Airways','Swiss Airlines','Turkish Airlines','Ryanair','easyJet','Vueling','Norwegian','Air Europa','Finnair','SAS','American Airlines','Delta Air Lines','United Airlines','Emirates','Qatar Airways','Copa Airlines','Aeromexico','Air Canada'];

// Campo de data com digitação livre no formato DD/MM/AAAA
function DateInput({ value, onChange, className, placeholder }: {
  value: string;       // recebe e emite no formato YYYY-MM-DD
  onChange: (iso: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const toDisplay = (iso: string) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    if (!d || !m || !y) return '';
    return `${d}/${m}/${y}`;
  };

  const [display, setDisplay] = React.useState(() => toDisplay(value));

  React.useEffect(() => {
    setDisplay(toDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Se o usuário está apagando (backspace), limpamos apenas o estado de exibição sem formatar
    // para não travar o cursor se ele apagar uma barra
    let digits = val.replace(/\D/g, '').slice(0, 8);
    
    let formatted = digits;
    if (digits.length > 2) formatted = digits.slice(0, 2) + '/' + digits.slice(2);
    if (digits.length > 4) formatted = formatted.slice(0, 5) + '/' + digits.slice(4);
    
    setDisplay(formatted);

    if (digits.length >= 6) {
      const d = digits.slice(0, 2);
      const m = digits.slice(2, 4);
      const y = digits.slice(4);
      
      // Se tivermos o ano completo (4 dígitos), validamos e enviamos
      if (y.length === 4) {
        if (parseInt(y) >= 1900 && parseInt(y) <= 2100) {
          onChange(`${y}-${m}-${d}`);
        }
      }
    } else if (digits.length === 0) {
      onChange('');
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck="false"
      value={display}
      onChange={handleChange}
      placeholder={placeholder || 'Dia/Mês/Ano (Ex: 29032026)'}
      maxLength={10}
      className={className}
    />
  );
}

interface PassagemFormProps {
  currentItem: any;
  setCurrentItem: (v: any) => void;
  showFlightExtra: boolean;
  setShowFlightExtra: (fn: (v: boolean) => boolean) => void;
  flightLookupLoading: boolean;
  flightLookupError: string | null;
  lookupFlight: (flight: string, date: string, isReturn: boolean, index: number) => void;
}

function TrechoCard({ label, isReturn, currentItem, setCurrentItem, showFlightExtra, setShowFlightExtra, flightLookupLoading, flightLookupError, lookupFlight }: PassagemFormProps & { label: string; isReturn?: boolean }) {
  const segments = isReturn ? (currentItem.inboundSegments || []) : (currentItem.outboundSegments || []);
  
  const addSegment = () => {
    const lastSeg = segments[segments.length - 1];
    const newSeg = {
      origin: lastSeg?.destination || '',
      destination: '',
      flightNumber: '',
      departureDate: lastSeg?.arrivalDate || lastSeg?.departureDate || '',
      departureTime: '',
      arrivalDate: '',
      arrivalTime: '',
      airline: lastSeg?.airline || '',
      duration: '',
      flightClass: lastSeg?.flightClass || 'Econômica',
      personalItem: lastSeg?.personalItem ?? 1,
      carryOn: lastSeg?.carryOn ?? 1,
      checkedBag23kg: lastSeg?.checkedBag23kg ?? 0
    };
    
    setCurrentItem((prev: any) => ({
      ...prev,
      [isReturn ? 'inboundSegments' : 'outboundSegments']: [...segments, newSeg]
    }));
  };

  const removeSegment = (idx: number) => {
    if (segments.length <= 1) return;
    const newSegs = segments.filter((_: any, i: number) => i !== idx);
    setCurrentItem((prev: any) => ({
      ...prev,
      [isReturn ? 'inboundSegments' : 'outboundSegments']: newSegs
    }));
  };

  const updateSegment = (idx: number, data: any) => {
    const newSegs = segments.map((s: any, i: number) => i === idx ? { ...s, ...data } : s);
    setCurrentItem((prev: any) => ({
      ...prev,
      [isReturn ? 'inboundSegments' : 'outboundSegments']: newSegs
    }));
  };

  const inp = "w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-[11px] font-bold text-gray-800 dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-600 focus:border-cyan-400 transition-colors text-center";
  const sel = "w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-[11px] font-bold text-gray-800 dark:text-white appearance-none cursor-pointer focus:border-cyan-400 transition-colors text-center";
  const lbl = "block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-0.5 text-center";

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 shadow-sm transition-all duration-300">
      <div className="px-4 py-2.5 bg-gray-50 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
        <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</span>
        {segments.length > 1 && (
          <span className="text-[9px] font-black text-cyan-500 uppercase px-2 py-0.5 bg-cyan-50 dark:bg-cyan-500/10 rounded-full border border-cyan-100 dark:border-cyan-500/20">{segments.length} Segmentos</span>
        )}
      </div>

      <div className="p-3 space-y-4">
        {segments.map((segment: any, idx: number) => (
          <div key={idx} className={`relative p-3 rounded-xl border-dashed border-2 ${idx > 0 ? 'border-gray-100 dark:border-slate-700/50 mt-2 bg-gray-50/30' : 'border-transparent'}`}>
            {idx > 0 && (
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-slate-700/50 pb-2">
                 <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Conexão {idx}</span>
                 <button onClick={() => removeSegment(idx)} className="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded text-red-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3 h-3" />
                 </button>
              </div>
            )}

      {/* Header segment lookup — COMPACTO E CENTRALIZADO */}
      <div className="flex justify-center -mt-4 mb-3 px-4 relative z-10">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg shadow-cyan-500/5">
          <div className="space-y-0.5">
             <label className="block text-[8px] font-black text-cyan-500 uppercase tracking-tighter text-center">Data Partida</label>
             <DateInput
                className="w-24 px-2 py-1 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-lg text-[10px] font-black text-gray-700 dark:text-gray-300 outline-none focus:border-cyan-400 text-center"
                placeholder="00/00/0000"
                value={segment.departureDate || ''}
                onChange={v => updateSegment(idx, { departureDate: v })}
              />
          </div>
          <div className="space-y-0.5">
             <label className="block text-[8px] font-black text-cyan-500 uppercase tracking-tighter text-center">Nº do Voo</label>
             <input
                placeholder="LA791"
                className="w-20 px-2 py-1 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-lg text-[10px] font-black font-mono text-gray-700 dark:text-gray-300 outline-none focus:border-cyan-400 uppercase text-center"
                value={segment.flightNumber || ''}
                onChange={e => updateSegment(idx, { flightNumber: e.target.value.toUpperCase() })}
                onKeyDown={e => e.key === 'Enter' && lookupFlight(segment.flightNumber, segment.departureDate, !!isReturn, idx)}
              />
          </div>
          <div className="pt-2.5">
             <button
                type="button"
                onClick={() => lookupFlight(segment.flightNumber, segment.departureDate, !!isReturn, idx)}
                disabled={flightLookupLoading}
                className="w-7 h-7 flex items-center justify-center bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all shadow shadow-cyan-500/10 active:scale-95 disabled:opacity-50"
              >
                {flightLookupLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              </button>
          </div>
        </div>
      </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={lbl}>Origem</label>
                  <input className={inp} placeholder="ORG" value={segment.origin || ''} onChange={e => updateSegment(idx, { origin: e.target.value.toUpperCase() })} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Destino</label>
                  <input className={inp} placeholder="DST" value={segment.destination || ''} onChange={e => updateSegment(idx, { destination: e.target.value.toUpperCase() })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={lbl}>📅 Partida</label>
                  <div className="flex gap-1.5">
                    <DateInput className={inp} value={segment.departureDate || ''} onChange={v => updateSegment(idx, { departureDate: v })} />
                    <input type="time" className={`${inp} w-24`} value={segment.departureTime || ''} onChange={e => updateSegment(idx, { departureTime: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={lbl}>📅 Chegada</label>
                  <div className="flex gap-1.5">
                    <DateInput className={inp} value={segment.arrivalDate || ''} onChange={v => updateSegment(idx, { arrivalDate: v })} />
                    <input type="time" className={`${inp} w-24`} value={segment.arrivalTime || ''} onChange={e => updateSegment(idx, { arrivalTime: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                 <div className="space-y-1">
                    <label className={lbl}>Duração</label>
                    <input className={inp} placeholder="--" value={segment.duration || ''} onChange={e => updateSegment(idx, { duration: e.target.value })} />
                 </div>
                 <div className="space-y-1">
                    <label className={lbl}>Cia Aérea</label>
                    <select className={sel} value={segment.airline || ''} onChange={e => updateSegment(idx, { airline: e.target.value })}>
                      <option value="">Selecione</option>
                      {AIRLINES.map(a => <option key={a}>{a}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className={lbl}>Classe</label>
                    <select className={sel} value={segment.flightClass || 'Econômica'} onChange={e => updateSegment(idx, { flightClass: e.target.value })}>
                      <option>Econômica</option><option>Premium Economy</option><option>Executiva</option><option>Primeira Classe</option>
                    </select>
                 </div>
              </div>

              {/* Bagagens Compactas por Trecho */}
              <div className="flex justify-between items-center bg-gray-50/80 dark:bg-slate-900/40 p-2 rounded-xl border border-gray-100 dark:border-slate-700/50">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Bagagens:</span>
                <div className="flex gap-4">
                  {[
                    { key: 'personalItem', label: 'Item Pes.' },
                    { key: 'carryOn', label: 'C. Mão' },
                    { key: 'checkedBag23kg', label: '23kg' }
                  ].map(bag => (
                    <div key={bag.key} className="flex items-center gap-1.5">
                      <button type="button" onClick={() => updateSegment(idx, { [bag.key]: Math.max(0, (segment[bag.key] || 0) - 1) })} className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 font-black text-xs hover:bg-red-50 hover:text-red-500 transition-all">-</button>
                      <div className="flex flex-col items-center min-w-[12px]">
                        <span className="text-[10px] font-black text-gray-700 dark:text-white leading-none">{segment[bag.key] ?? (bag.key === 'checkedBag23kg' ? 0 : 1)}</span>
                        <span className="text-[7px] font-bold text-gray-400 uppercase leading-none mt-0.5">{bag.label}</span>
                      </div>
                      <button type="button" onClick={() => updateSegment(idx, { [bag.key]: (segment[bag.key] || 0) + 1 })} className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 font-black text-xs hover:bg-cyan-50 hover:text-cyan-500 transition-all">+</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex flex-col gap-3">
          <button 
            type="button" 
            onClick={addSegment}
            className="w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500 rounded-xl text-[10px] font-black text-gray-400 hover:text-cyan-500 transition-all flex items-center justify-center gap-2 bg-gray-50/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/5 group"
          >
            <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 group-hover:border-cyan-400 flex items-center justify-center transition-all">
                <Plus className="w-3 h-3" />
            </div>
            ADICIONAR CONEXÃO
          </button>
        </div>
      </div>
    </div>
  );
}

function PassagemForm({ currentItem, setCurrentItem, showFlightExtra, setShowFlightExtra, flightLookupLoading, flightLookupError, lookupFlight }: PassagemFormProps) {
  const sharedProps = { currentItem, setCurrentItem, showFlightExtra, setShowFlightExtra, flightLookupLoading, flightLookupError, lookupFlight };
  const toggleFlightType = (type: 'ida' | 'ida_volta') => {
    setCurrentItem((prev: any) => ({
      ...prev,
      flightType: type,
      inboundSegments: type === 'ida_volta' && prev.inboundSegments?.length === 0 
        ? [{ origin: '', destination: '', flightNumber: '', departureDate: '', departureTime: '', arrivalDate: '', arrivalTime: '', airline: '', duration: '' }]
        : prev.inboundSegments
    }));
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      <div className="flex bg-gray-100 dark:bg-slate-900 p-0.5 rounded-lg w-fit">
        <button type="button" onClick={() => toggleFlightType('ida')} className={`px-4 py-1 rounded-md text-[10px] font-bold transition-all ${currentItem.flightType === 'ida' ? 'bg-white dark:bg-slate-700 text-gray-700 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}>Ida</button>
        <button type="button" onClick={() => toggleFlightType('ida_volta')} className={`px-4 py-1 rounded-md text-[10px] font-bold transition-all ${currentItem.flightType === 'ida_volta' ? 'bg-white dark:bg-slate-700 text-gray-700 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}>Ida e Volta</button>
      </div>
      <TrechoCard label="Trecho 1 — Ida" {...sharedProps} />
      {currentItem.flightType === 'ida_volta' && (
        <TrechoCard label="Trecho 2 — Volta" isReturn {...sharedProps} />
      )}
    </div>
  );
}

export function LeadModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingLead,
  suppliers
}: LeadModalProps) {
  const [activeItemType, setActiveItemType] = useState('passagem');
  const [tagInput, setTagInput] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showFlightExtra, setShowFlightExtra] = useState(false);
  const [flightLookupLoading, setFlightLookupLoading] = useState(false);
  const [flightLookupError, setFlightLookupError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Lead>>({
    title: '',
    name: '',
    status: 'novo_contato',
    tags: [],
    duration: '',
    adults: 1,
    children: 0,
    babies: 0,
    luggage23kg: 0,
    items: [],
    value: 0,
    notes: '',
    usd_rate: 0,
    eur_rate: 0,
    gbp_rate: 0
  });

  const [currentItem, setCurrentItem] = useState<any>({
    type: 'passagem',
    flightType: 'ida',
    outboundSegments: [{
       origin: '', destination: '', flightNumber: '', departureDate: '', departureTime: '',
       arrivalDate: '', arrivalTime: '', airline: '', duration: '',
       flightClass: 'Econômica', personalItem: 1, carryOn: 1, checkedBag23kg: 0
    }],
    inboundSegments: [],
    checkinNotif: 'Check-in 24h antes',
    hotelName: '', hotelAddress: '',
    checkInDate: '', checkInTime: '14:00',
    checkOutDate: '', checkOutTime: '12:00',
    dailyNights: '', rooms: '1',
    roomType: 'Não informado', stars: 'Não informado', boardBasis: 'Não informado',
    value: 0, cost: 0, vendor: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (editingLead) {
        // Garantir retrocompatibilidade com leads antigos (migrar campos simples para arrays de segmentos)
        const migrateSegments = (lead: any) => {
          let outbound = lead.outboundSegments;
          let inbound = lead.inboundSegments;

          if (!outbound && lead.items) {
            // Se estiver editando um item específico, a lógica é diferente, mas aqui lidamos com o lead de entrada
          }
          return lead;
        };

        setFormData({
          ...editingLead,
          title: editingLead.title || '',
          name: editingLead.name || '',
          adults: editingLead.adults || 1,
          children: editingLead.children || 0,
          babies: editingLead.babies || 0,
          luggage23kg: editingLead.luggage23kg || 0,
          items: editingLead.items?.map((item: any) => {
             if (item.type === 'passagem') {
                const outbound = item.outboundSegments || [{
                  origin: item.origin, destination: item.destination,
                  flightNumber: item.flightNumber, departureDate: item.departureDate,
                  departureTime: item.departureTime, arrivalDate: item.arrivalDate,
                  arrivalTime: item.arrivalTime, airline: item.airline, duration: item.duration,
                  flightClass: item.flightClass || 'Econômica',
                  personalItem: item.personalItem ?? 1,
                  carryOn: item.carryOn ?? 1,
                  checkedBag23kg: item.checkedBag23kg ?? 0
                }];
                const inbound = (item.flightType === 'ida_volta') ? (item.inboundSegments || [{
                  origin: item.destination, destination: item.origin,
                  flightNumber: item.returnFlightNumber, departureDate: item.returnDate,
                  departureTime: item.returnTime, arrivalDate: item.returnArrivalDate,
                  arrivalTime: item.returnArrivalTime, airline: item.airline, duration: item.returnDuration,
                  flightClass: item.flightClass || 'Econômica',
                  personalItem: item.personalItem ?? 1,
                  carryOn: item.carryOn ?? 1,
                  checkedBag23kg: item.checkedBag23kg ?? 0
                }]) : [];
                return { ...item, outboundSegments: outbound, inboundSegments: inbound };
             }
             return item;
          }) || [],
          tags: editingLead.tags || [],
          usd_rate: editingLead.usd_rate || 0,
          eur_rate: editingLead.eur_rate || 0,
          gbp_rate: editingLead.gbp_rate || 0
        });
      } else {
        setFormData({
          title: '',
          name: '',
          status: 'novo_contato',
          tags: [],
          duration: '',
          adults: 1,
          children: 0,
          babies: 0,
          luggage23kg: 0,
          items: [],
          value: 0,
          notes: '',
          usd_rate: 0,
          eur_rate: 0,
          gbp_rate: 0
        });
      }
      setEditingItemId(null);
    }
  }, [editingLead, isOpen]);

  // CAPTURA DO CÂMBIO NO MOMENTO DA GERAÇÃO
  useEffect(() => {
    if (isOpen && !formData.usd_rate) {
      const fetchRates = async () => {
        try {
          const res = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL');
          const data = await res.json();
          if (data) {
            setFormData(prev => ({
              ...prev,
              usd_rate: parseFloat(data.USDBRL?.bid || '0'),
              eur_rate: parseFloat(data.EURBRL?.bid || '0'),
              gbp_rate: parseFloat(data.GBPBRL?.bid || '0')
            }));
          }
        } catch (err) {
          console.error('Erro ao capturar câmbio:', err);
        }
      };
      fetchRates();
    }
  }, [isOpen, formData.usd_rate]);

  if (!isOpen) return null;

  const lookupFlight = async (flightNumber: string, date: string, isReturn: boolean, segmentIndex: number) => {
    const fn = flightNumber?.trim();
    const dt = date?.trim();
    if (!fn || !dt) {
      setFlightLookupError('Preencha o nº do voo e a data primeiro');
      return;
    }
    setFlightLookupLoading(true);
    setFlightLookupError(null);
    try {
      const res = await fetch(`/api/lookup-flight?flight=${encodeURIComponent(fn)}&date=${dt}`);
      const data = await res.json();
      if (!res.ok) {
        setFlightLookupError(data.error || 'Voo não encontrado');
        return;
      }
      
      const segmentKey = isReturn ? 'inboundSegments' : 'outboundSegments';
      
      setCurrentItem((prev: any) => {
        const segments = [...(prev[segmentKey] || [])];
        if (segments[segmentIndex]) {
          segments[segmentIndex] = {
            ...segments[segmentIndex],
            origin: data.origin || segments[segmentIndex].origin,
            destination: data.destination || segments[segmentIndex].destination,
            airline: data.airline || segments[segmentIndex].airline,
            departureDate: data.departureDate || segments[segmentIndex].departureDate,
            departureTime: data.departureTime,
            arrivalDate: data.arrivalDate,
            arrivalTime: data.arrivalTime,
            duration: data.duration,
            flightNumber: fn
          };
        }
        return { ...prev, [segmentKey]: segments };
      });
      
      setShowFlightExtra(true); 
    } catch (error) {
      setFlightLookupError('Erro ao buscar informações do voo');
    } finally {
      setFlightLookupLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim().toUpperCase())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim().toUpperCase()] });
      setTagInput('');
    }
  };

  const handleAddItem = () => {
    let itemDescription = 'Serviço';
    if (currentItem.type === 'passagem') {
      const out = currentItem.outboundSegments || [];
      const first = out[0]?.origin || '?';
      const last = out[out.length - 1]?.destination || '?';
      itemDescription = `${first} → ${last}`;
    } else if (currentItem.type === 'hospedagem') {
      itemDescription = currentItem.hotelName ? `Hotel: ${currentItem.hotelName}` : 'Hospedagem';
    } else if (currentItem.type === 'seguro') {
      itemDescription = 'Seguro Viagem';
    } else if (currentItem.type === 'carro') {
      itemDescription = 'Aluguel de Carro';
    }

    const newItem = {
      ...currentItem,
      id: editingItemId || Math.random().toString(36).substr(2, 9),
      description: itemDescription
    };

    const newItems = [...(formData.items || []).filter((i:any) => i.id !== newItem.id), newItem];
    
    setFormData({
      ...formData,
      items: newItems,
      value: newItems.reduce((sum, i) => sum + (i.value || 0), 0)
    });

    setEditingItemId(null);
    setShowFlightExtra(false);
    setCurrentItem({
      type: currentItem.type,
      flightType: 'ida',
      outboundSegments: [{
         origin: '', destination: '', flightNumber: '', departureDate: '', departureTime: '',
         arrivalDate: '', arrivalTime: '', airline: '', duration: '',
         flightClass: 'Econômica', personalItem: 1, carryOn: 1, checkedBag23kg: 0
      }],
      inboundSegments: [],
      checkinNotif: 'Check-in 24h antes',
      personalItem: 1, carryOn: 1, checkedBag23kg: 0,
      hotelName: '', hotelAddress: '',
      checkInDate: '', checkInTime: '14:00',
      checkOutDate: '', checkOutTime: '12:00',
      dailyNights: '', rooms: '1',
      roomType: 'Não informado', stars: 'Não informado', boardBasis: 'Não informado',
      value: 0, cost: 0, vendor: ''
    });
  };

  const handleEditItem = (itemToEdit: any) => {
    setEditingItemId(itemToEdit.id);
    setCurrentItem(itemToEdit);
    setActiveItemType(itemToEdit.type || 'passagem');
  };

  const updateCounter = (type: string, operation: 'add' | 'sub') => {
    setFormData((prev: any) => ({
      ...prev,
      [type]: operation === 'add' ? (prev[type] || 0) + 1 : Math.max(0, (prev[type] || 0) - 1)
    }));
  };

  const estimatedCost = formData.items?.reduce((sum, i) => sum + (i.cost || 0), 0) || 0;
  const profit = (formData.value || 0) - estimatedCost;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white dark:bg-[#1e293b] w-full max-w-4xl rounded-[24px] overflow-hidden flex flex-col max-h-[95vh] shadow-2xl border border-gray-100 dark:border-slate-700/50 relative"
      >
        
        {/* Header Ultra Clean */}
        <div className="p-4 px-6 bg-white dark:bg-[#1e293b] border-b border-gray-100 dark:border-slate-700/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center">
                <Layout className="w-4 h-4 text-cyan-500" />
             </div>
             <div>
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Novo Orçamento</h2>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">Gestão Interna Easy Fly</p>
             </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all">
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-6 flex flex-col md:flex-row gap-6 bg-[#f8fafc]/50 dark:bg-slate-900/50 custom-scrollbar">
          {/* COLUNA ESQUERDA (FORMULÁRIO) */}
          <div className="flex-1 space-y-4">
            
            {/* Bloco Superior (Dados Gerais) */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-4">
              
              {/* Título e Telefone do Cliente */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Título do Orçamento</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400" />
                    <input 
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-sm text-gray-800 dark:text-white font-bold placeholder:text-gray-400" 
                      placeholder="Ex: Férias Sr. João - Disney" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <MessageCircle className="w-2.5 h-2.5 fill-emerald-500/10" /> WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400" />
                    <input 
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-sm text-gray-800 dark:text-white font-bold placeholder:text-emerald-500/20" 
                      placeholder="(00) 00000-0000" 
                      value={formData.phone || ''} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cliente</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400" />
                    <input 
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-xs text-gray-800 dark:text-white font-bold placeholder:text-gray-400" 
                      placeholder="Nome do cliente..." 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Etapa</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple-400" />
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as CRMStatus })}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl text-xs font-bold text-gray-800 dark:text-white appearance-none outline-none focus:ring-1 focus:ring-cyan-500/20"
                    >
                      {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 border-t border-gray-50 dark:border-slate-700 pt-3">
                <div className="col-span-3 space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1.5 ml-1"><TagIcon className="w-2.5 h-2.5" /> Tags</label>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl text-xs outline-none text-gray-800 dark:text-white font-bold" 
                        placeholder="Tag..." 
                        value={tagInput} 
                        onChange={e => setTagInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                      />
                      <button onClick={handleAddTag} className="px-3 py-1.5 bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 rounded-lg font-black text-[9px] hover:bg-gray-200 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700/50 uppercase tracking-widest">Add</button>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1.5 ml-1"><Clock className="w-2.5 h-2.5" /> Dias</label>
                    <input 
                      className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl text-xs text-gray-800 dark:text-white font-bold outline-none" 
                      placeholder="Ex: 5" 
                      value={formData.duration} 
                      onChange={e => setFormData({...formData, duration: e.target.value})} 
                    />
                </div>
              </div>
              
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <AnimatePresence>
                    {formData.tags.map((tag: any) => (
                      <motion.span 
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} 
                        key={tag} 
                        className="px-2 py-0.5 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded text-[9px] font-black border border-cyan-100 dark:border-cyan-500/20 uppercase tracking-tight flex items-center gap-1.5"
                      >
                        {tag} 
                        <button onClick={() => setFormData({...formData, tags: formData.tags?.filter((t:any)=>t!==tag)})} className="opacity-60 hover:opacity-100 transition-opacity">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Contadores Globais Compactos */}
              <div className="flex gap-4 overflow-x-auto pt-3 border-t border-gray-50 dark:border-slate-700 scrollbar-hide shrink-0">
                {[
                  { label: 'Adultos', key: 'adults', ic: <User className="w-3 h-3" /> },
                  { label: 'Crianças', key: 'children', ic: <Users className="w-3 h-3" /> },
                  { label: 'Bebês', key: 'babies', ic: <Baby className="w-3 h-3" /> },
                  { label: 'Mala 23kg', key: 'luggage23kg', ic: <Luggage className="w-3 h-3" /> }
                ].map(p => (
                  <div key={p.key} className="space-y-1 flex-shrink-0">
                    <span className="text-[8px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter">{p.ic} {p.label}</span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateCounter(p.key, 'sub')} className="w-6 h-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm active:scale-90">-</button>
                      <span className="font-black text-[11px] w-3 text-center text-gray-800 dark:text-white">{(formData as any)[p.key] || 0}</span>
                      <button onClick={() => updateCounter(p.key, 'add')} className="w-6 h-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm active:scale-90">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seletor de Abas Pequeno */}
            <div className="flex gap-1.5">
              {[
                { id: 'passagem', label: 'PASSAGEM' },
                { id: 'hospedagem', label: 'HOSPEDAGEM' },
                { id: 'seguro', label: 'SEGURO' },
                { id: 'carro', label: 'CARRO' }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => {
                    setActiveItemType(tab.id);
                    setCurrentItem((prev: any) => ({ ...prev, type: tab.id }));
                  }}
                  className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest transition-all border ${
                    activeItemType === tab.id 
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm' 
                    : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-750'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* FORMULÁRIO DE ITEM REDEFINIDO */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-4">
              
              {activeItemType === 'passagem' && (
                <PassagemForm
                  currentItem={currentItem}
                  setCurrentItem={setCurrentItem}
                  showFlightExtra={showFlightExtra}
                  setShowFlightExtra={setShowFlightExtra}
                  flightLookupLoading={flightLookupLoading}
                  flightLookupError={flightLookupError}
                  lookupFlight={lookupFlight}
                />
              )}

              {activeItemType === 'hospedagem' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-tight">Hotel</label>
                      <input placeholder="Ex: Hilton..." className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-xs font-bold text-gray-800 dark:text-white" value={currentItem.hotelName} onChange={e => setCurrentItem({...currentItem, hotelName: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-tight">Localização</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input placeholder="Ex: Orlando, FL" className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-xs font-bold text-gray-800 dark:text-white" value={currentItem.hotelAddress} onChange={e => setCurrentItem({...currentItem, hotelAddress: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-tight">Check-in</label>
                      <DateInput className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-xs font-bold text-gray-800 dark:text-white" value={currentItem.checkInDate} onChange={v => setCurrentItem({...currentItem, checkInDate: v})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-tight">Check-out</label>
                      <DateInput className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-xs font-bold text-gray-800 dark:text-white" value={currentItem.checkOutDate} onChange={v => setCurrentItem({...currentItem, checkOutDate: v})} />
                    </div>
                  </div>
                </div>
              )}

              {/* Campos Financeiros Gerais do Item */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-slate-700 pt-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-cyan-500 uppercase ml-1 tracking-tight">Venda</label>
                  <NumericFormat 
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl text-xs font-black text-cyan-600 outline-none" 
                    placeholder="R$ 0,00" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale={true} 
                    value={currentItem.value} onValueChange={v => setCurrentItem({...currentItem, value: v.floatValue || 0})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-red-400 uppercase ml-1 tracking-tight">Custo Estimado por Pessoa</label>
                  <NumericFormat 
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl text-xs font-black text-red-500 outline-none" 
                    placeholder="R$ 0,00" prefix="R$ " thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale={true} 
                    value={currentItem.cost} onValueChange={v => setCurrentItem({...currentItem, cost: v.floatValue || 0})}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button 
                  onClick={handleAddItem}
                  className="px-6 py-2 bg-[#0f172a] dark:bg-slate-700 text-white rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-black dark:hover:bg-slate-600 transition-all shadow-md active:scale-95"
                >
                  {editingItemId ? 'ATUALIZAR ITEM' : 'INCLUIR NO ORÇAMENTO'}
                </button>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA (SIDEBAR E ITENS ADICIONADOS) */}
          <div className="w-full md:w-[280px] flex flex-col gap-5 shrink-0">
            
            {/* Resumo Financeiro Pequeno */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-4">
              <h3 className="font-black text-[9px] uppercase text-gray-400 tracking-widest border-b border-gray-50 dark:border-slate-700 pb-2">Resumo Financeiro</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Venda</span>
                    <p className="text-lg font-black text-gray-900 dark:text-white leading-none">R$ {(formData.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
                <div className="flex justify-between items-end pt-0.5">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-red-400/80 uppercase tracking-tighter">Custo Total</span>
                    <p className="text-sm font-bold text-red-500/90 leading-none">R$ {estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-50 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Lucro</span>
                  <p className="text-lg font-black text-emerald-500">R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
            
            {(() => {
              const isAprovadoAndInvalid = formData.status === 'aprovado' && ((formData.value || 0) <= 0 || estimatedCost <= 0);
              const canSave = formData.title && !isAprovadoAndInvalid;
              return (
                <div className="space-y-3">
                  {isAprovadoAndInvalid && (
                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-3 rounded-xl flex items-start gap-2.5 shadow-sm animate-in zoom-in-95 duration-200">
                      <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-amber-500 font-black text-[10px]">!</span>
                      </div>
                      <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 leading-tight">
                        Para mover para <strong className="text-amber-600 dark:text-amber-300">Aprovado</strong>, é obrigatório preencher <strong className="text-amber-600 dark:text-amber-300">Venda</strong> e <strong className="text-amber-600 dark:text-amber-300">Custo</strong> em Itens.
                      </p>
                    </div>
                  )}
                  <button 
                    onClick={() => onSave(formData)} 
                    disabled={!canSave}
                    className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/10 active:scale-95 ${
                      canSave ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isAprovadoAndInvalid ? 'PREENCHA VENDA E CUSTO' : (editingLead ? 'SALVAR ALTERAÇÕES' : 'CRIAR ORÇAMENTO')}
                  </button>
                </div>
              );
            })()}

            {/* ITENS ADICIONADOS COMPACTOS */}
            {formData.items && formData.items.length > 0 && (
              <div className="flex flex-col gap-2.5 mt-0.5">
                <h3 className="font-black text-[9px] uppercase text-gray-400 tracking-widest px-1">Itens ({formData.items.length})</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  <AnimatePresence>
                    {formData.items.map((item: any) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                        key={item.id} 
                        className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-xl shadow-sm hover:border-cyan-200 dark:hover:border-cyan-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                            item.type === 'hospedagem' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' : 
                            'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                          }`}>
                            {item.type === 'hospedagem' ? <Hotel className="w-4 h-4" /> : <Plane className="w-4 h-4" />}
                          </div>
                          <div className="flex flex-col truncate pr-1">
                            <p className="font-bold text-gray-900 dark:text-white text-[11px] truncate leading-tight">{item.description}</p>
                            <p className="text-[8px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-tighter truncate mt-0.5">
                              {item.type === 'passagem' ? (
                                `${item.adults || (formData as any).adults}A ${item.children || (formData as any).children}C ${item.babies || (formData as any).babies}B`
                              ) : (
                                formatDateRange(item.checkInDate, item.checkOutDate)
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-black text-gray-800 dark:text-white">
                            R$ {(item.value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                          </span>
                          
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditItem(item)} className="p-1 text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded transition-colors">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={() => setFormData({...formData, items: formData.items?.filter((i:any)=>i.id !== item.id)})} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* BOTÃO FLUTUANTE: COPIAR LINK DO ORÇAMENTO */}
        {editingLead?.id && (
          <div className="shrink-0 px-5 pb-4 pt-2 flex justify-end border-t border-gray-50 dark:border-slate-700/50 bg-white dark:bg-[#1e293b]">
            <button
              type="button"
              onClick={() => {
                const link = `${window.location.origin}/cotacao/${editingLead.id}`;
                navigator.clipboard.writeText(link).then(() => {
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 3000);
                });
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
                linkCopied
                  ? 'bg-green-500 text-white shadow-green-500/20'
                  : 'bg-[#19727d] text-white hover:bg-[#145d66] shadow-[#19727d]/20'
              }`}
            >
              {linkCopied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Link Copiado!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar link do orçamento
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
