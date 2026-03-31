'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Plane, Hotel, Shield, Car, Trash2, Layout, 
  Tag as TagIcon, Minus, Luggage, User, Baby, Clock,
  MapPin, Pencil, Search, ChevronDown, Target, Phone, Mail, FileText, Users, MessageCircle, Loader2, Star, CheckCircle, Calendar,
  CreditCard, Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NumericFormat } from 'react-number-format';
import Image from 'next/image';
import { Lead, CRMStatus, Customer, Group, Supplier } from '@/types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  editingLead?: Lead | null;
  suppliers: Supplier[];
}

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

function DateInput({ value, onChange, className, placeholder }: {
  value: string;
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
    let digits = val.replace(/\D/g, '').slice(0, 8);
    
    let formatted = digits;
    if (digits.length > 2) formatted = digits.slice(0, 2) + '/' + digits.slice(2);
    if (digits.length > 4) formatted = formatted.slice(0, 5) + '/' + digits.slice(4);
    
    setDisplay(formatted);

    if (digits.length >= 6) {
      const d = digits.slice(0, 2);
      const m = digits.slice(2, 4);
      let y = digits.slice(4);
      if (y.length === 2) y = '20' + y;
      if (y.length === 4) {
        onChange(`${y}-${m}-${d}`);
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
      placeholder={placeholder || 'DD/MM/AAAA'}
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

function TrechoCard({ label, isReturn, currentItem, setCurrentItem, flightLookupLoading, flightLookupError, lookupFlight }: any) {
  const segments = isReturn ? (currentItem.inboundSegments || []) : (currentItem.outboundSegments || []);
  
  const updateSegment = (idx: number, data: any) => {
    const newSegs = segments.map((s: any, i: number) => i === idx ? { ...s, ...data } : s);
    setCurrentItem((prev: any) => ({
      ...prev,
      [isReturn ? 'inboundSegments' : 'outboundSegments']: newSegs
    }));
  };

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
    setCurrentItem((prev: any) => ({
      ...prev,
      [isReturn ? 'inboundSegments' : 'outboundSegments']: segments.filter((_: any, i: number) => i !== idx)
    }));
  };

  const inp = "w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-[11px] font-bold text-gray-800 dark:text-white text-center";
  const sel = "w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-[11px] font-bold text-gray-800 dark:text-white appearance-none cursor-pointer text-center";
  const lbl = "block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-0.5 text-center";

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 shadow-sm">
      <div className="px-4 py-2.5 bg-gray-50 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
        <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="p-3 space-y-4">
        {segments.map((segment: any, idx: number) => (
          <div key={idx} className={`relative p-3 rounded-xl border-dashed border-2 ${idx > 0 ? 'border-gray-100 dark:border-slate-700/50 mt-2 bg-gray-50/30' : 'border-transparent'}`}>
            {idx > 0 && (
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-slate-700/50 pb-2">
                 <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Conexão {idx}</span>
                 <button onClick={() => removeSegment(idx)} className="p-1 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
              </div>
            )}
            <div className="flex justify-center -mt-4 mb-3 px-4 relative z-10">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg">
                <div className="space-y-0.5">
                   <label className="block text-[8px] font-black text-cyan-500 uppercase text-center">Data</label>
                   <DateInput className="w-24 px-2 py-1 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-lg text-[10px] font-black text-center" value={segment.departureDate || ''} onChange={v => updateSegment(idx, { departureDate: v })} />
                </div>
                <div className="space-y-0.5">
                   <label className="block text-[8px] font-black text-cyan-500 uppercase text-center">Nº Voo</label>
                   <input className="w-20 px-2 py-1 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase text-center" value={segment.flightNumber || ''} onChange={e => updateSegment(idx, { flightNumber: e.target.value.toUpperCase() })} />
                </div>
                <div className="pt-2.5">
                   <button type="button" onClick={() => lookupFlight(segment.flightNumber, segment.departureDate, !!isReturn, idx)} className="w-7 h-7 flex items-center justify-center bg-cyan-600 text-white rounded-lg"><Search className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
            {flightLookupError && (
              <div className="flex justify-center -mt-2 mb-3">
                <p className="text-[9px] font-black text-red-500 bg-red-50 px-4 py-1.5 rounded-full border border-red-100">{flightLookupError}</p>
              </div>
            )}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><label className={lbl}>Origem</label><input className={inp} placeholder="ORG" value={segment.origin || ''} onChange={e => updateSegment(idx, { origin: e.target.value.toUpperCase() })} /></div>
                <div className="space-y-1"><label className={lbl}>Destino</label><input className={inp} placeholder="DST" value={segment.destination || ''} onChange={e => updateSegment(idx, { destination: e.target.value.toUpperCase() })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={lbl}>📅 Partida</label>
                  <div className="flex gap-1.5"><DateInput className={inp} value={segment.departureDate || ''} onChange={v => updateSegment(idx, { departureDate: v })} /><input type="time" className={`${inp} w-24`} value={segment.departureTime || ''} onChange={e => updateSegment(idx, { departureTime: e.target.value })} /></div>
                </div>
                <div className="space-y-1">
                  <label className={lbl}>📅 Chegada</label>
                  <div className="flex gap-1.5"><DateInput className={inp} value={segment.arrivalDate || ''} onChange={v => updateSegment(idx, { arrivalDate: v })} /><input type="time" className={`${inp} w-24`} value={segment.arrivalTime || ''} onChange={e => updateSegment(idx, { arrivalTime: e.target.value })} /></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                 <div className="space-y-1"><label className={lbl}>Duração</label><input className={inp} placeholder="--" value={segment.duration || ''} onChange={e => updateSegment(idx, { duration: e.target.value })} /></div>
                 <div className="space-y-1">
                    <label className={lbl}>Cia Aérea</label>
                    <select className={sel} value={segment.airline || ''} onChange={e => updateSegment(idx, { airline: e.target.value })}>
                      <option value="">Selecione</option>{AIRLINES.map(a => <option key={a}>{a}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className={lbl}>Classe</label>
                    <select className={sel} value={segment.flightClass || 'Econômica'} onChange={e => updateSegment(idx, { flightClass: e.target.value })}>
                      <option>Econômica</option><option>Premium Economy</option><option>Executiva</option><option>Primeira Classe</option>
                    </select>
                 </div>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addSegment} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-black text-gray-400 hover:text-cyan-500 flex items-center justify-center gap-2">
          <Clock className="w-3.5 h-3.5" /> ADICIONAR CONEXÃO
        </button>
      </div>
    </div>
  );
}

function PassagemForm(props: any) {
  const toggleFlightType = (type: 'ida' | 'ida_volta') => {
    props.setCurrentItem((prev: any) => ({
      ...prev,
      flightType: type,
      inboundSegments: type === 'ida_volta' ? (prev.inboundSegments?.length > 0 ? prev.inboundSegments : [{}]) : []
    }));
  };
  return (
    <div className="space-y-3">
      <div className="flex bg-gray-100 dark:bg-slate-900 p-0.5 rounded-lg w-fit">
        <button type="button" onClick={() => toggleFlightType('ida')} className={`px-4 py-1 rounded-md text-[10px] font-bold ${props.currentItem.flightType === 'ida' ? 'bg-white text-gray-700' : 'text-gray-400'}`}>Ida</button>
        <button type="button" onClick={() => toggleFlightType('ida_volta')} className={`px-4 py-1 rounded-md text-[10px] font-bold ${props.currentItem.flightType === 'ida_volta' ? 'bg-white text-gray-700' : 'text-gray-400'}`}>Ida e Volta</button>
      </div>
      <TrechoCard label="Trecho 1 — Ida" {...props} />
      {props.currentItem.flightType === 'ida_volta' && <TrechoCard label="Trecho 2 — Volta" isReturn {...props} />}
    </div>
  );
}

export function LeadModal({ isOpen, onClose, onSave, editingLead, suppliers }: LeadModalProps) {
  const [activeItemType, setActiveItemType] = useState('passagem');
  const [formData, setFormData] = useState<Partial<Lead>>({
    title: '', name: '', status: 'novo_contato', tags: [], adults: 1, children: 0, babies: 0, items: [], fees_type: 'interest_free', fees_installments: 10
  });
  const [currentItem, setCurrentItem] = useState<any>({ type: 'passagem', flightType: 'ida', outboundSegments: [{}], inboundSegments: [], value: 0, cost: 0 });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [flightLookupLoading, setFlightLookupLoading] = useState(false);
  const [flightLookupError, setFlightLookupError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && editingLead) {
      setFormData({ ...editingLead, items: editingLead.items || [], fees_type: editingLead.fees_type || 'interest_free', fees_installments: editingLead.fees_installments || 10 });
    } else if (isOpen) {
      setFormData({ title: '', name: '', status: 'novo_contato', tags: [], adults: 1, children: 0, babies: 0, items: [], fees_type: 'interest_free', fees_installments: 10 });
    }
  }, [isOpen, editingLead]);

  const lookupFlight = async (fn: string, dt: string, isReturn: boolean, idx: number) => {
    if (!fn || !dt) return;
    setFlightLookupLoading(true);
    setFlightLookupError(null);
    try {
      const res = await fetch(`/api/lookup-flight?flight=${encodeURIComponent(fn)}&date=${dt}`);
      const data = await res.json();
      if (!res.ok) { setFlightLookupError(data.error); return; }
      const key = isReturn ? 'inboundSegments' : 'outboundSegments';
      setCurrentItem((prev: any) => {
        const segs = [...(prev[key] || [])];
        segs[idx] = { ...segs[idx], ...data, flightNumber: fn };
        return { ...prev, [key]: segs };
      });
    } catch (e) { setFlightLookupError('Erro na busca'); } finally { setFlightLookupLoading(false); }
  };

  const handleAddItem = () => {
    const newItem = { ...currentItem, id: editingItemId || Math.random().toString(36).substr(2, 9) };
    const newItems = [...(formData.items || []).filter((i:any) => i.id !== newItem.id), newItem];
    setFormData({ ...formData, items: newItems, value: newItems.reduce((sum, i) => sum + (i.value || 0), 0) });
    setEditingItemId(null);
    setCurrentItem({ type: activeItemType, flightType: 'ida', outboundSegments: [{}], inboundSegments: [], value: 0, cost: 0 });
  };

  if (!isOpen) return null;

  const estimatedCost = formData.items?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
  const lucro = (formData.value || 0) - estimatedCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-50 dark:bg-[#1e293b] w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="shrink-0 px-6 py-4 bg-white dark:bg-slate-800 border-b border-gray-100 flex justify-between items-center">
           <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">Nova Venda</h2>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row gap-6 p-5">
          <div className="flex-1 space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Título da Viagem" className="px-4 py-2 bg-gray-50 rounded-xl font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <input placeholder="Nome do Cliente" className="px-4 py-2 bg-gray-50 rounded-xl font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>

            <div className="flex gap-2 p-1 bg-gray-200 rounded-xl w-fit">
              {['passagem', 'hospedagem'].map(t => (
                <button key={t} onClick={() => setActiveItemType(t)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase ${activeItemType === t ? 'bg-white shadow-sm text-cyan-600' : 'text-gray-500'}`}>{t}</button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100">
              {activeItemType === 'passagem' && <PassagemForm currentItem={currentItem} setCurrentItem={setCurrentItem} flightLookupLoading={flightLookupLoading} flightLookupError={flightLookupError} lookupFlight={lookupFlight} />}
              {activeItemType === 'hospedagem' && <div className="p-4 text-center text-gray-400 italic text-xs">Formulário de hospedagem em construção...</div>}
              
              <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
                 <NumericFormat placeholder="Venda" className="px-4 py-2 bg-gray-50 rounded-xl font-bold" value={currentItem.value} onValueChange={v => setCurrentItem({...currentItem, value: v.floatValue})} />
                 <NumericFormat placeholder="Custo" className="px-4 py-2 bg-gray-50 rounded-xl font-bold" value={currentItem.cost} onValueChange={v => setCurrentItem({...currentItem, cost: v.floatValue})} />
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={handleAddItem} className="px-6 py-2 bg-cyan-600 text-white rounded-xl font-black text-[10px] uppercase">{editingItemId ? 'Atualizar' : 'Incluir'}</button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[300px] flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 space-y-3">
              <div className="flex justify-between font-black text-xs uppercase"><span>Total:</span> <span className="text-cyan-600">R$ {formData.value?.toLocaleString()}</span></div>
              <div className="flex justify-between font-black text-xs uppercase opacity-50"><span>Custo:</span> <span>R$ {estimatedCost.toLocaleString()}</span></div>
              <div className="pt-2 border-t flex justify-between font-black text-sm uppercase"><span>Lucro:</span> <span className={lucro >= 0 ? 'text-green-600' : 'text-red-600'}>R$ {lucro.toLocaleString()}</span></div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-amber-100 space-y-3">
               <label className="font-black text-[9px] uppercase text-amber-600">Parcelamento</label>
               <div className="grid grid-cols-1 gap-2">
                 {['interest_free', 'with_interest'].map(type => (
                   <button key={type} onClick={() => setFormData({...formData, fees_type: type as any})} className={`p-2 border rounded-xl text-[10px] font-bold ${formData.fees_type === type ? 'border-amber-500 bg-amber-50' : 'border-gray-100'}`}>{type === 'interest_free' ? 'Sem Juros' : 'Com Juros'}</button>
                 ))}
               </div>
               <select className="w-full p-2 bg-gray-50 rounded-xl text-[10px] font-bold" value={formData.fees_installments} onChange={e => setFormData({...formData, fees_installments: parseInt(e.target.value)})}>
                 {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}x</option>)}
               </select>
            </div>

            <div className="flex flex-col gap-2">
               <button onClick={() => onSave(formData)} className="w-full py-3 bg-[#0f172a] text-white rounded-2xl font-black text-xs uppercase tracking-widest">Salvar Alterações</button>
            </div>

            <AnimatePresence>
              {formData.items && formData.items.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[9px] font-black uppercase text-gray-400">Itens Atuais</h3>
                  {formData.items.map((item: any) => (
                    <div key={item.id} className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between items-center">
                       <span className="text-[10px] font-bold text-gray-700">{item.description || item.type}</span>
                       <button onClick={() => setFormData({...formData, items: formData.items?.filter((i:any)=>i.id !== item.id)})} className="text-red-300"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {editingLead?.id && (
          <div className="px-5 py-3 bg-gray-50 dark:bg-slate-900 border-t flex justify-end">
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/cotacao/${editingLead.id}`); setLinkCopied(true); setTimeout(()=>setLinkCopied(false),3000); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${linkCopied ? 'bg-green-500 text-white' : 'bg-cyan-600 text-white'}`}>
              {linkCopied ? 'Link Copiado!' : 'Copiar Link da Cotação'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
