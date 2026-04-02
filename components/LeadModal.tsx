'use client';

import React, { useState, useEffect } from 'react';

import { 

  X, Plus, Plane, Hotel, Shield, Car, Trash2, Layout, 

  Tag as TagIcon, Minus, Luggage, User, Baby, Clock,

  MapPin, Pencil, Search, ChevronDown, Target, Phone, Mail, FileText, Users, MessageCircle, Loader2, Star, CheckCircle, Calendar,

  CreditCard, Percent, LayoutGrid, Coffee

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

const AIRLINES = ['LATAM','Gol','Azul','Avianca','Aerolineas Argentinas','Sky Airline','Boliviana de Aviación','TAP Portugal','British Airways','Iberia','Air France','KLM','Lufthansa','ITA Airways','Swiss Airlines','Turkish Airlines','Ryanair','easyJet','Vueling','Norwegian','Air Europa','Finnair','SAS','American Airlines','Delta Air Lines','United Airlines','Emirates','Qatar Airways','Copa Airlines','Aeromexico','Air Canada'];

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

      if (y.length === 4) onChange(`${y}-${m}-${d}`);

    } else if (digits.length === 0) onChange('');

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

  const inp = "w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-[11px] font-bold text-gray-800 dark:text-white text-center focus:border-cyan-400 transition-colors";

  const sel = "w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-[11px] font-bold text-gray-800 dark:text-white appearance-none cursor-pointer text-center focus:border-cyan-400 transition-colors";

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

                 <button onClick={() => removeSegment(idx)} className="p-1 hover:bg-red-50 rounded text-red-300 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>

              </div>

            )}

            <div className="flex justify-center -mt-4 mb-3 px-4 relative z-10">

              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg shadow-cyan-500/5">

                <div className="space-y-0.5">

                   <label className="block text-[8px] font-black text-cyan-500 uppercase tracking-tighter text-center">Data</label>

                   <DateInput className="w-24 px-2 py-1 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-lg text-[10px] font-black text-center" value={segment.departureDate || ''} onChange={v => updateSegment(idx, { departureDate: v })} />

                </div>

                <div className="space-y-0.5">

                   <label className="block text-[8px] font-black text-cyan-500 uppercase tracking-tighter text-center">Nº Voo</label>

                   <input className="w-20 px-2 py-1 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase text-center" value={segment.flightNumber || ''} onChange={e => updateSegment(idx, { flightNumber: e.target.value.toUpperCase() })} />

                </div>

                <div className="pt-2.5">

                   <button type="button" onClick={() => lookupFlight(segment.flightNumber, segment.departureDate, !!isReturn, idx)} disabled={flightLookupLoading} className="w-7 h-7 flex items-center justify-center bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 shadow shadow-cyan-500/10 active:scale-95 disabled:opacity-50">

                     {flightLookupLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}

                   </button>

                </div>

              </div>

            </div>

            {flightLookupError && (

              <div className="flex justify-center -mt-2 mb-3">

                <p className="text-[9px] font-black text-red-500 bg-red-50 px-4 py-1.5 rounded-full border border-red-100 animate-in fade-in slide-in-from-top-1 duration-300">âš ï¸ {flightLookupError}</p>

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

              <div className="flex justify-between items-center bg-gray-50/80 dark:bg-slate-900/40 p-2 rounded-xl border border-gray-100 dark:border-slate-700/50">

                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Bagagens:</span>

                <div className="flex gap-4">

                  {[

                    { key: 'personalItem', label: 'Item Pes.' },

                    { key: 'carryOn', label: 'C. Mão' },

                    { key: 'checkedBag23kg', label: '23kg' }

                  ].map(bag => (

                    <div key={bag.key} className="flex items-center gap-1.5">

                      <button type="button" onClick={() => updateSegment(idx, { [bag.key]: Math.max(0, (segment[bag.key] || 0) - 1) })} className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center font-black text-xs hover:bg-red-50 hover:text-red-500 transition-all">-</button>

                      <div className="flex flex-col items-center min-w-[12px]">

                        <span className="text-[10px] font-black text-gray-700 dark:text-white leading-none">{segment[bag.key] ?? (bag.key === 'checkedBag23kg' ? 0 : 1)}</span>

                        <span className="text-[7px] font-bold text-gray-400 uppercase leading-none mt-0.5">{bag.label}</span>

                      </div>

                      <button type="button" onClick={() => updateSegment(idx, { [bag.key]: (segment[bag.key] || 0) + 1 })} className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center font-black text-xs hover:bg-cyan-50 hover:text-cyan-500 transition-all">+</button>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        ))}

        <button type="button" onClick={addSegment} className="w-full py-2 border-2 border-dashed border-gray-200 hover:border-cyan-300 rounded-xl text-[10px] font-black text-gray-400 hover:text-cyan-500 transition-all flex items-center justify-center gap-2 bg-gray-50/50 hover:bg-cyan-50 group">

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

      inboundSegments: type === 'ida_volta' 

        ? (prev.inboundSegments?.length > 0 ? prev.inboundSegments : [{ origin: '', destination: '', flightNumber: '', departureDate: '', airline: '', flightClass: 'Econômica', personalItem: 1, carryOn: 1, checkedBag23kg: 0 }])

        : []

    }));

  };

  return (

    <div className="space-y-3 animate-in fade-in duration-300">

      <div className="flex bg-gray-100 dark:bg-slate-900 p-0.5 rounded-lg w-fit">

        <button type="button" onClick={() => toggleFlightType('ida')} className={`px-4 py-1 rounded-md text-[10px] font-bold transition-all ${props.currentItem.flightType === 'ida' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400'}`}>Ida</button>

        <button type="button" onClick={() => toggleFlightType('ida_volta')} className={`px-4 py-1 rounded-md text-[10px] font-bold transition-all ${props.currentItem.flightType === 'ida_volta' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400'}`}>Ida e Volta</button>

      </div>

      <TrechoCard label="Trecho 1 — Ida" {...props} />

      {props.currentItem.flightType === 'ida_volta' && <TrechoCard label="Trecho 2 — Volta" isReturn {...props} />}

    </div>

  );

}

export function LeadModal({ isOpen, onClose, onSave, editingLead, suppliers }: LeadModalProps) {

  const [activeItemType, setActiveItemType] = useState('passagem');

  const [tagInput, setTagInput] = useState('');

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [linkCopied, setLinkCopied] = useState(false);

  const [flightLookupLoading, setFlightLookupLoading] = useState(false);

  const [flightLookupError, setFlightLookupError] = useState<string | null>(null);

  const [hotelSuggestions, setHotelSuggestions] = useState<any[]>([]);

  const [showHotelSuggestions, setShowHotelSuggestions] = useState(false);

  const [hotelLookupLoading, setHotelLookupLoading] = useState(false);

  const [isManualTyping, setIsManualTyping] = useState(false);

  const [hotelLookupError, setHotelLookupError] = useState<string | null>(null);

  const [availableRooms, setAvailableRooms] = useState<any[]>([]);

  const [allPhotos, setAllPhotos] = useState<any[]>([]);

  const [hotelDescription, setHotelDescription] = useState('');

  const [hotelFacilities, setHotelFacilities] = useState<string[]>([]);

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Lead>({

    id: '', 

    title: '', name: '', phone: '', status: 'novo_contato', tags: [], adults: 1, children: 0, babies: 0, luggage23kg: 0,

    items: [], fees_type: 'interest_free', fees_installments: 10, value: 0, markup: 10, taxes: 0, cost: 0, notes: '',

    markup_type: 'percentage', usd_rate: 0, eur_rate: 0, gbp_rate: 0, createdAt: '', updatedAt: '', emissor: ''

  });

  const [currentItem, setCurrentItem] = useState<any>({

    type: 'passagem', flightType: 'ida', outboundSegments: [{}], inboundSegments: [], 

    value: 0, cost: 0, vendor: '', hotelName: '', address: '', checkInDate: '', checkOutDate: '', roomType: '', stars: '',

    hasBreakfast: false

  });

  useEffect(() => {

    if (isOpen && editingLead) {

      setFormData({ ...editingLead, items: editingLead.items || [], fees_type: editingLead.fees_type || 'interest_free', fees_installments: editingLead.fees_installments || 12 });

    } else if (isOpen) {
      setFormData({ 
        ...formData, 
        id: '', 
        title: '', 
        name: '', 
        phone: '', 
        status: 'novo_contato', 
        tags: [], 
        adults: 1, 
        children: 0, 
        babies: 0, 
        luggage23kg: 0, 
        items: [], 
        value: 0, 
        cost: 0, 
        fees_type: 'interest_free', 
        fees_installments: 12 
      });
    }

  }, [isOpen, editingLead]);

  useEffect(() => {

    const timer = setTimeout(async () => {

      const name = currentItem.hotelName;

      if (activeItemType === 'hospedagem' && name && name.length >= 3 && isManualTyping) {

        setHotelLookupLoading(true);

        try {

          const res = await fetch(`/api/lookup-hotel?type=search&name=${encodeURIComponent(name)}`);

          const data = await res.json();

          if (res.ok) { 

            setHotelSuggestions(data.suggestions || []); 

            setShowHotelSuggestions(true); 

            setIsManualTyping(false);

          }

        } catch (e) { console.error('Hotel search error', e); } finally { setHotelLookupLoading(false); }

      }

    }, 600);

    return () => clearTimeout(timer);

  }, [currentItem.hotelName, activeItemType, isManualTyping]);

  const selectHotelSuggestion = async (suggestion: any) => {

    setCurrentItem({ 

      ...currentItem, 

      hotelName: suggestion.name, 

      address: suggestion.address,

      stars: suggestion.rating || '' 

    });

    setShowHotelSuggestions(false);

    setSelectedRoomId(null);

    setHotelLookupLoading(true);

    setAvailableRooms([]);

    try {

      const res = await fetch(`/api/lookup-hotel?type=details&hotelId=${suggestion.hotelId}`);

      const data = await res.json();

      if (res.ok) { setAllPhotos(data.photos || []); }

      const resRooms = await fetch(`/api/lookup-hotel?type=rooms&hotelId=${suggestion.hotelId}`);

      const dataRooms = await resRooms.json();

      if (resRooms.ok) { setAvailableRooms(dataRooms.rooms || []); }

      const resFac = await fetch(`/api/lookup-hotel?type=facilities&hotelId=${suggestion.hotelId}`);

      const dataFac = await resFac.json();

      if (resFac.ok) { setHotelDescription(dataFac.description); setHotelFacilities(dataFac.facilities); }

    } catch (e) { setHotelLookupError('Erro ao buscar detalhes completos'); } finally { setHotelLookupLoading(false); }

  };

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

        // Automação: Tentar encontrar a cia aérea na lista ou usar a vinda da API

        let airline = data.airline || '';

        const found = AIRLINES.find(a => airline.toLowerCase().includes(a.toLowerCase()));

        if (found) airline = found;

        segs[idx] = { ...segs[idx], ...data, airline, flightNumber: fn };

        return { ...prev, [key]: segs };

      });

    } catch (e) { setFlightLookupError('Erro na busca'); } finally { setFlightLookupLoading(false); }

  };

  const handleAddItem = () => {

    const desc = currentItem.type === 'passagem' 
      ? (currentItem.outboundSegments?.[0]?.origin + ' → ' + currentItem.outboundSegments?.[currentItem.outboundSegments.length-1]?.destination) 
      : (currentItem.type === 'hospedagem' ? (currentItem.hotelName || 'Hospedagem') : (currentItem.type === 'seguro' ? 'Seguro Viagem' : 'Carro'));

    const hotelMetaData = currentItem.type === 'hospedagem' ? {

      hotelImages: allPhotos,

      hotelAmenities: hotelFacilities,

      hotelDescription: hotelDescription

    } : {};

    const newItem = { 

      ...currentItem, 

      ...hotelMetaData,

      id: editingItemId || Math.random().toString(36).substr(2,9), 

      description: desc 

    };

    const newItems = editingItemId 

      ? formData.items?.map((i: any) => i.id === editingItemId ? newItem : i)

      : [...(formData.items || []), newItem];

    const totalVenda = (newItems || []).reduce((sum: number, i: any) => sum + (i.value || 0), 0);

    const totalCusto = (newItems || []).reduce((sum: number, i: any) => sum + (i.cost || 0), 0);

    setFormData({ ...formData, items: newItems, value: totalVenda, cost: totalCusto });

    // Reset form

    setEditingItemId(null);

    setCurrentItem({ 

      type: activeItemType, 

      flightType: 'ida', 

      outboundSegments: [{}], 

      inboundSegments: [], 

      value: 0, 

      cost: 0, 

      hotelName: '', 

      hasBreakfast: false 

    });

    setAvailableRooms([]);

    setAllPhotos([]);

    setHotelDescription('');

    setHotelFacilities([]);

  };

  const handleEditItem = (item: any) => {

    setEditingItemId(item.id);

    setActiveItemType(item.type);

    setCurrentItem({ ...item });

    if (item.type === 'hospedagem') {

      setAllPhotos(item.hotelImages || []);

      setHotelFacilities(item.hotelAmenities || []);

      setHotelDescription(item.hotelDescription || '');

      // Note: availableRooms might not be available without a new lookup, 

      // but we have the selected room type in currentItem.roomType

    }

  };

  const cancelEdit = () => {

    setEditingItemId(null);

    setCurrentItem({ 

      type: 'passagem', 

      flightType: 'ida', 

      outboundSegments: [{}], 

      inboundSegments: [], 

      value: 0, 

      cost: 0, 

      hotelName: '', 

      hasBreakfast: false 

    });

    setAvailableRooms([]);

    setAllPhotos([]);

    setHotelDescription('');

    setHotelFacilities([]);

  };

  const handleCounter = (field: keyof Lead, delta: number) => {

    setFormData(prev => ({ ...prev, [field]: Math.max(0, (prev[field] as number || 0) + delta) }));

  };

  const estimatedCost = formData.items?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;

  const lucro = (formData.value || 0) - estimatedCost - (formData.taxes || 0);

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-50 dark:bg-[#1e293b] w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        <div className="shrink-0 px-6 py-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700/50 flex justify-between items-center z-20">

           <div className="flex items-center gap-4">

             <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center"><Target className="w-5 h-5 text-cyan-600" /></div>

             <div>

               <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter leading-none">Nova Cotação</h2>

               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gestão de Lead e Cotação</p>

             </div>

           </div>

           <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-5 h-5" /></button>

        </div>

        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row gap-6 p-5">

          <div className="flex-1 space-y-4">

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-5 animate-in slide-in-from-left-4 duration-500">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="space-y-1.5">

                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Título da Viagem</label>

                  <input placeholder="Ex: Lua de Mel Maldivas" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-transparent dark:border-slate-700 rounded-xl outline-none font-bold text-gray-800 dark:text-white focus:border-cyan-400 transition-all shadow-sm text-center" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />

                </div>

                <div className="space-y-1.5">

                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Nome do Cliente</label>

                  <input placeholder="Nome do Lead" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-transparent dark:border-slate-700 rounded-xl outline-none font-bold text-gray-800 dark:text-white focus:border-cyan-400 transition-all shadow-sm text-center" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />

                </div>

                <div className="space-y-1.5">

                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">WhatsApp</label>

                  <div className="relative group">

                    <input 

                      placeholder="(00) 00000-0000" 

                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-transparent dark:border-slate-700 rounded-xl outline-none font-bold text-gray-800 dark:text-white focus:border-cyan-400 transition-all shadow-sm text-center pl-10" 

                      value={formData.phone || ''} 

                      onChange={e => setFormData({...formData, phone: e.target.value})} 

                    />

                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50/50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-slate-700/50">

                 {[

                   { id: 'adults', label: 'Adultos', icon: Users },

                   { id: 'children', label: 'Crianças', icon: User },

                   { id: 'babies', label: 'Bebês', icon: Baby },

                   { id: 'luggage23kg', label: 'Malas 23kg', icon: Luggage }

                 ].map(c => (

                   <div key={c.id} className="flex flex-col items-center gap-2">

                     <div className="flex items-center gap-1.5 min-h-[14px]">

                        <c.icon className="w-3 h-3 text-cyan-600/60" />

                        <span className="text-[11px] font-black text-gray-500/80 uppercase tracking-tighter">{c.label}</span>

                     </div>

                     <div className="flex items-center gap-3">

                       <button onClick={() => handleCounter(c.id as any, -1)} className="w-[26px] h-[26px] rounded-lg bg-white dark:bg-slate-800 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">-</button>

                       <span className="text-sm font-black text-gray-800 dark:text-white min-w-[12px] text-center">{formData[c.id as keyof Lead] || 0}</span>

                       <button onClick={() => handleCounter(c.id as any, 1)} className="w-[26px] h-[26px] rounded-lg bg-white dark:bg-slate-800 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 transition-all shadow-sm">+</button>

                     </div>

                   </div>

                 ))}

              </div>

                            <div className="grid grid-cols-4 gap-5">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Status do Lead</label>
                  <select className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl font-bold text-xs shadow-sm focus:border-cyan-400 transition-all" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as CRMStatus})}>
                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Tags</label>
                  <div className="h-11 flex gap-1.5 items-center bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl px-1 py-1 shadow-sm focus-within:border-cyan-400 transition-all">
                    <input 
                      placeholder="DIGITE A TAG" 
                      className="flex-1 px-3 py-1.5 bg-transparent border-none outline-none font-bold text-xs uppercase text-gray-800 dark:text-white" 
                      value={tagInput} 
                      onChange={e => setTagInput(e.target.value)} 
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (tagInput.trim()) {
                            setFormData({...formData, tags: [...(formData.tags || []), tagInput.trim().toUpperCase()]});
                            setTagInput('');
                          }
                        }
                      }} 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if(tagInput.trim()) { 
                          setFormData({...formData, tags: [...(formData.tags || []), tagInput.trim().toUpperCase()]}); 
                          setTagInput(''); 
                        }
                      }} 
                      className="w-8 h-8 flex items-center justify-center bg-cyan-600 text-white rounded-lg shadow-md hover:bg-cyan-700 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Duração</label>
                  <div className="relative">
                    <input 
                      placeholder="Qtd. dias" 
                      className="w-full h-11 px-3 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl font-bold text-xs shadow-sm pr-7 text-center focus:border-cyan-400 transition-all" 
                      value={formData.duration || ''} 
                      onChange={e => setFormData({...formData, duration: e.target.value})} 
                    />
                    <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[20px] mt-2 ml-1">
                {formData.tags?.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 text-[9px] font-black rounded-lg border border-cyan-100 dark:border-cyan-500/20 group animate-in fade-in zoom-in-95 duration-200">
                    {tag}
                    <button type="button" onClick={() => setFormData({...formData, tags: formData.tags?.filter((_, index) => index !== i)})} className="hover:text-red-500 opacity-60 hover:opacity-100">×</button>
                  </span>
                ))}
              </div>

            </div>

            <div className="flex gap-2 p-1 bg-gray-200 dark:bg-slate-800/80 rounded-xl w-fit">

              {['passagem', 'hospedagem', 'seguro', 'carro'].map(t => (

                <button key={t} onClick={() => { setActiveItemType(t); if (!editingItemId) { setCurrentItem(prev => ({ ...prev, type: t })); } }} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeItemType === t ? 'bg-white dark:bg-slate-700 shadow-sm text-cyan-600 dark:text-cyan-400' : 'text-gray-500 hover:text-gray-600'}`}>{t}</button>

              ))}

            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm animate-in zoom-in-95 duration-500">

              {activeItemType === 'passagem' && (

                <PassagemForm 

                  currentItem={currentItem} 

                  setCurrentItem={setCurrentItem} 

                  flightLookupLoading={flightLookupLoading} 

                  flightLookupError={flightLookupError} 

                  lookupFlight={lookupFlight} 

                />

              )}

              {activeItemType === 'hospedagem' && (

                <div className="space-y-6 animate-in fade-in duration-500 pb-2">

                  <div className="space-y-5">

                    <div className="relative group/search">

                       <label className="text-[10px] font-black text-orange-500 uppercase ml-1 tracking-widest flex items-center gap-1.5 mb-1.5">

                         <Hotel className="w-3.5 h-3.5" /> Nome do Hotel

                       </label>

                       <div className="relative">

                         <input 

                           placeholder="Qual o nome do hotel?" 

                           className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-700/50 rounded-2xl font-black text-xs uppercase text-gray-800 dark:text-white outline-none focus:border-orange-400 focus:bg-white transition-all shadow-sm pl-11" 

                           value={currentItem.hotelName} 

                           onChange={e => {

                             setCurrentItem({...currentItem, hotelName: e.target.value});

                             setIsManualTyping(true);

                           }} 

                         />

                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/search:text-orange-400 transition-colors" />

                         {hotelLookupLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-orange-500" />}

                       </div>

                       <AnimatePresence>

                         {showHotelSuggestions && hotelSuggestions.length > 0 && (

                           <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl shadow-2xl max-h-80 overflow-y-auto custom-scrollbar border-t-4 border-t-orange-500">

                              <div className="p-2 space-y-1">

                                {hotelSuggestions.map(s => (

                                  <button key={s.hotelId} onClick={() => selectHotelSuggestion(s)} className="w-full px-5 py-4 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-left rounded-2xl border-b border-gray-50 dark:border-slate-700/50 last:border-none flex items-center gap-4 group/item">

                                     <div className="flex-1 min-w-0">

                                        <p className="text-[13px] font-black text-gray-800 dark:text-white uppercase leading-tight mb-1">{s.name}</p>

                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase leading-tight mb-3">{s.address}</p>

                                        <div className="flex items-center gap-1.5">

                                           <div className="flex items-center gap-0.5">

                                              {[...Array(5)].map((_, i) => (

                                                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(s.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-100 dark:fill-slate-700/50'}`} />

                                              ))}

                                           </div>

                                           <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 ml-1">({s.rating || '0.0'})</span>

                                        </div>

                                     </div>

                                  </button>

                                ))}

                              </div>

                           </motion.div>

                         )}

                       </AnimatePresence>

                    </div>

                    <div className="space-y-1.5">

                      <label className="text-[10px] font-black text-cyan-500 uppercase ml-1 tracking-widest flex items-center gap-1.5 mb-1.5">

                        <LayoutGrid className="w-3.5 h-3.5" /> Seleção do Quarto

                      </label>

                      <select 

                        className="w-full px-5 py-3 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700/50 rounded-2xl font-black text-xs uppercase text-gray-800 dark:text-white outline-none focus:border-cyan-400 transition-all shadow-sm appearance-none"

                        value={selectedRoomId || ""}

                        onChange={e => {

                          const rId = e.target.value;

                          const r = availableRooms.find(rm => String(rm.id) === rId);

                          if (r) {

                            setSelectedRoomId(r.id);

                            setCurrentItem({

                              ...currentItem, 

                              roomType: r.name, 

                              value: r.price, 

                              cost: r.price * 0.9 

                            });

                          }

                        }}

                      >

                        <option value="" disabled>{availableRooms.length > 0 ? "— Escolha um tipo de quarto —" : "Pesquise um hotel primeiro"}</option>

                        {availableRooms.map(r => (

                          <option key={r.id} value={r.id}>

                            {(r.name || "Acomodação").toUpperCase()} (MÃX {r.maxOccupancy || 2} PERS.)

                          </option>

                        ))}

                      </select>

                    </div>

                    <div className="space-y-1.5">

                       <label className="text-[10px] font-black text-orange-500 uppercase ml-1 tracking-widest flex items-center gap-1.5 mb-1.5">

                         <MapPin className="w-3.5 h-3.5" /> Endereço da Hospedagem

                       </label>

                       <input 

                         placeholder="Localização automática" 

                         className="w-full px-5 py-3 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-700/50 rounded-2xl font-black text-xs uppercase text-gray-500 dark:text-gray-400 outline-none transition-all shadow-sm" 

                         value={currentItem.address}

                         readOnly

                       />

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

                      <div className="md:col-span-8 space-y-1.5">

                        <label className="text-[10px] font-black text-orange-500 uppercase ml-1 tracking-widest flex items-center gap-1.5 mb-1.5">

                           <Calendar className="w-3.5 h-3.5" /> Datas (Check-in / Out)

                        </label>

                        <div className="flex gap-2">

                          <DateInput 

                            placeholder="Check-in"

                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-700/50 rounded-2xl font-black text-[10px] shadow-sm text-center focus:border-orange-400 focus:bg-white transition-all uppercase" 

                            value={currentItem.checkInDate} 

                            onChange={v => setCurrentItem({...currentItem, checkInDate: v})} 

                          />

                          <DateInput 

                            placeholder="Check-out"

                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-700/50 rounded-2xl font-black text-[10px] shadow-sm text-center focus:border-orange-400 focus:bg-white transition-all uppercase" 

                            value={currentItem.checkOutDate} 

                            onChange={v => setCurrentItem({...currentItem, checkOutDate: v})} 

                          />

                        </div>

                      </div>

                      <div className="md:col-span-4 space-y-1.5">

                        <label className="text-[10px] font-black text-orange-500 uppercase ml-1 tracking-widest flex items-center gap-1.5 mb-1.5">

                           <Star className="w-3.5 h-3.5" /> Estrelas

                        </label>

                        <input 

                          placeholder="Ex: 5 ★"

                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-700/50 rounded-2xl font-black text-xs uppercase text-gray-400 dark:text-gray-500 outline-none transition-all shadow-sm"

                          value={currentItem.stars ? `${currentItem.stars} ★` : ''}

                          readOnly

                        />

                      </div>

                    </div>

                    <div className="flex items-center gap-3 p-4 bg-orange-50/30 dark:bg-orange-500/5 rounded-2xl border border-orange-100/50 dark:border-orange-500/10">

                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentItem.hasBreakfast ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-gray-100 text-gray-400 dark:bg-slate-800'}`}>

                         <Coffee className="w-5 h-5" />

                      </div>

                      <div className="flex-1">

                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none mb-1">Café da Manhã</p>

                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Opcional incluso no voucher</p>

                      </div>

                      <button 

                        type="button"

                        onClick={() => setCurrentItem({...currentItem, hasBreakfast: !currentItem.hasBreakfast})}

                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${currentItem.hasBreakfast ? 'bg-orange-600 text-white' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400'}`}

                      >

                        {currentItem.hasBreakfast ? 'REMOVER CAFÉ' : 'ADICIONAR CAFÉ'}

                      </button>

                    </div>

                  </div>

                   {/* INFO PANEL: PHOTOS, DESC, FACILITIES */}

                   {(allPhotos.length > 0 || hotelDescription) && (

                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50/10 dark:bg-slate-900/10 rounded-[32px] border border-gray-100/50 dark:border-slate-700/30 overflow-hidden">

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">

                           {/* Left: Photos Carousel (Mini) */}

                           <div className="md:col-span-1 p-4 border-r border-gray-100 dark:border-slate-700/30 bg-white/50 dark:bg-slate-800/50 flex flex-col items-center justify-center">

                              {allPhotos.length > 0 ? (

                                <div className="space-y-3 w-full">

                                   <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-md group/photo border-2 border-white dark:border-slate-700">

                                      <Image src={allPhotos[0]?.url || allPhotos[0]} fill className="object-cover group-hover/photo:scale-110 transition-transform duration-700" alt="Hotel main" />

                                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] font-black text-orange-600">FOTO PRINCIPAL</div>

                                   </div>

                                   <div className="flex gap-1.5 justify-center">

                                      {allPhotos.slice(1, 4).map((p: any, i: number) => (

                                        <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600 relative shrink-0">

                                          <Image src={p?.url || p} fill className="object-cover" alt="Thumb" />

                                        </div>

                                      ))}

                                      {allPhotos.length > 4 && (

                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black text-gray-400">+{allPhotos.length - 4}</div>

                                      )}

                                   </div>

                                </div>

                              ) : (

                                <div className="w-full aspect-square bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center"><Hotel className="w-12 h-12 text-gray-200" /></div>

                              )}

                           </div>

                           {/* Center: Description & Facilities */}

                           <div className="md:col-span-3 p-5 flex flex-col gap-5">

                              <div className="flex-1">

                                 <h4 className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2 mb-2 tracking-widest">

                                   <FileText className="w-3 h-3" /> Detalhes do Hotel

                                 </h4>

                                 <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 italic">

                                    {hotelDescription || "Descrição não disponível para este hotel."}

                                 </p>

                              </div>

                              <div>

                                 <h4 className="text-[10px] font-black text-cyan-500 uppercase flex items-center gap-2 mb-3 tracking-widest">

                                   <Shield className="w-3 h-3" /> Amenidades & Serviços

                                 </h4>

                                 <div className="flex flex-wrap gap-1.5">

                                    {hotelFacilities.length > 0 ? hotelFacilities.slice(0, 15).map((f: any, i: number) => (

                                      <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-500 text-[8px] font-black uppercase rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm transition-all hover:border-cyan-200 hover:text-cyan-500">

                                        {f}

                                      </span>

                                    )) : (

                                       <span className="text-[9px] font-black text-gray-300 uppercase">Consultar amenidades no voucher</span>

                                    )}

                                 </div>

                              </div>

                           </div>

                        </div>

                     </motion.div>

                   )}

                  </div>

              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 dark:border-slate-700 pt-6 mt-2 items-end">

                 <div className="grid grid-cols-2 gap-4">

                    <div className="space-y-1.5">

                      <label className="text-[10px] font-black text-cyan-500 uppercase ml-1 tracking-widest">Preço Venda (R$)</label>

                      <NumericFormat className="w-full px-5 py-3 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700/50 rounded-2xl font-black text-sm text-gray-800 dark:text-white shadow-sm focus:border-cyan-400 outline-none transition-all text-center" value={currentItem.value} onValueChange={v => setCurrentItem({...currentItem, value: v.floatValue})} thousandSeparator="." decimalSeparator="," prefix="R$ " />

                    </div>

                    <div className="space-y-1.5">

                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Preço Custo (R$)</label>

                      <NumericFormat className="w-full px-5 py-3 bg-gray-50/50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-700/50 rounded-2xl font-black text-sm text-gray-400 dark:text-gray-500 shadow-sm focus:border-gray-200 outline-none transition-all text-center" value={currentItem.cost} onValueChange={v => setCurrentItem({...currentItem, cost: v.floatValue})} thousandSeparator="." decimalSeparator="," prefix="R$ " />

                    </div>

                 </div>

                  <div className="flex justify-end gap-3">

                    {editingItemId && (

                      <button 

                        onClick={() => { setEditingItemId(null); setCurrentItem({ type: "passagem", flightType: "ida", outboundSegments: [{}], inboundSegments: [], value: 0, cost: 0, travelers: [], adults: 1, children: 0, babies: 0, bags23kg: 0, cabin: "Y", airline: "" }); }}

                        className="px-8 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-sm"

                      >

                        Cancelar

                      </button>

                    )}

                    <button 

                      onClick={handleAddItem} 

                      className={`w-full md:w-auto px-10 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${editingItemId ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20' : 'bg-[#0f172a] hover:bg-black text-white shadow-slate-900/10 hover:shadow-cyan-500/10'}`}

                    >

                      {editingItemId ? <Pencil className="w-4 h-4" /> : <Plus className="w-5 h-5" />}

                      {editingItemId ? 'Atualizar Item' : 'Incluir no Orçamento'}

                    </button>

                  </div>

              </div>

            </div>

          </div>

          <div className="w-full md:w-[320px] flex flex-col gap-5 shrink-0 animate-in slide-in-from-right-4 duration-500">

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-4">

              <h3 className="font-black text-[10px] uppercase text-gray-400 tracking-widest border-b border-gray-50 dark:border-slate-700/50 pb-3">Resumo Financeiro</h3>

              <div className="space-y-3">

                <div className="flex justify-between font-black text-xs uppercase"><span>Total Itens:</span> <span className="text-cyan-600">R$ {formData.value?.toLocaleString()}</span></div>

                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase border-t pt-2 opacity-60"><span>Custo Total:</span> <span>R$ {estimatedCost.toLocaleString()}</span></div>

                <div className="pt-3 border-t-2 border-dashed border-gray-50 flex justify-between items-end">

                   <div>

                     <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Valor Venda</p>

                     <p className="text-2xl font-black text-gray-800 dark:text-white leading-none">R$ {(formData.value || 0).toLocaleString()}</p>

                   </div>

                   <div className="text-right">

                     <p className="text-[10px] font-black text-green-500 uppercase leading-none mb-1">Lucro</p>

                     <p className="text-sm font-black text-green-600 leading-none">R$ {lucro.toLocaleString()}</p>

                   </div>

                </div>

              </div>

            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-3xl border border-amber-100/50 dark:border-amber-500/10 space-y-4">

               <div className="flex items-center gap-2 mb-1">

                 <CreditCard className="w-4 h-4 text-amber-600" />

                 <label className="font-black text-[10px] uppercase text-amber-600 tracking-widest">Parcelamento na Cotação</label>

               </div>

               <div className="grid grid-cols-2 gap-2">

                 <button onClick={() => setFormData({...formData, fees_type: 'interest_free'})} className={`py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${formData.fees_type === 'interest_free' ? 'bg-amber-600 text-white shadow-lg' : 'bg-white text-amber-600 border border-amber-200'}`}>Sem Juros</button>

                 <button onClick={() => setFormData({...formData, fees_type: 'with_interest'})} className={`py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${formData.fees_type === 'with_interest' ? 'bg-amber-600 text-white shadow-lg' : 'bg-white text-amber-600 border border-amber-200'}`}>Com Juros</button>

               </div>

               <div className="flex items-center justify-between bg-white/60 dark:bg-slate-900/40 p-2.5 rounded-2xl">

                  <span className="text-[10px] font-black text-amber-700 uppercase">Limite:</span>

                  <select className="bg-transparent border-none outline-none font-black text-xs text-amber-800 dark:text-amber-400" value={formData.fees_installments} onChange={e => setFormData({...formData, fees_installments: parseInt(e.target.value)})}>

                    {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}x</option>)}

                  </select>

               </div>

            </div>

            <div className="mt-auto pt-2">

               <button 
                 onClick={() => {
                   if (!formData.name?.trim()) {
                     alert('Por favor, informe o nome do cliente antes de salvar.');
                     return;
                   }
                   onSave(formData);
                 }} 
                 className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 active:scale-95 transition-all"
               >
                 Salvar Projeto de Viagem
               </button>

            </div>

            <AnimatePresence>

              {formData.items && formData.items.length > 0 && (

                <div className="space-y-2 mt-4">

                  <h3 className="text-[9px] font-black uppercase text-gray-400 tracking-widest pl-1">Itens Adicionados ({formData.items.length})</h3>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">

                    {formData.items.map((item: any) => (

                      <motion.div 

                        initial={{ opacity:0, x:10 }} 

                        animate={{ opacity:1, x:0 }} 

                        exit={{ opacity:0, scale:0.9 }} 

                        key={item.id} 

                        onClick={() => handleEditItem(item)}

                        className={`p-3 rounded-xl border flex justify-between items-center group cursor-pointer transition-all ${editingItemId === item.id ? 'bg-cyan-50 border-cyan-200 shadow-md ring-2 ring-cyan-500/20' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700'}`}

                      >

                        <div className="flex items-center gap-3 overflow-hidden">

                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'passagem' ? 'bg-cyan-50 text-cyan-600' : 'bg-orange-50 text-orange-600'}`}>

                             {item.type === 'passagem' ? <Plane className="w-4 h-4" /> : <Hotel className="w-4 h-4" />}

                          </div>

                          <div className="min-w-0">

                            <p className="text-[10px] font-black text-gray-800 dark:text-white uppercase leading-tight truncate">{item.description}</p>

                            <div className="flex items-center gap-2 mt-1">

                               <p className="text-[8px] font-black text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded-md">R$ {item.value?.toLocaleString()}</p>

                               {item.type === 'hospedagem' && item.checkInDate && (

                                 <p className="text-[7px] font-bold text-gray-400 uppercase truncate">

                                   {new Date(item.checkInDate).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})} 

                                   {item.checkOutDate && ` – ${new Date(item.checkOutDate).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})}`}

                                 </p>

                               )}

                               {item.type === 'passagem' && item.outboundSegments?.[0]?.departureDate && (

                                 <p className="text-[7px] font-bold text-gray-400 uppercase">

                                   {new Date(item.outboundSegments[0].departureDate).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})}

                                 </p>

                               )}

                            </div>

                            {item.roomType && (

                              <p className="text-[7px] font-bold text-gray-400 uppercase mt-1 truncate opacity-70">

                                {item.roomType}

                              </p>

                            )}

                          </div>

                        </div>

                        <div className="flex items-center gap-1">

                          <div className="p-1 px-2 text-[8px] font-black text-cyan-600 bg-cyan-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">EDITAR</div>

                          <button 

                            onClick={(e) => {

                              e.stopPropagation();

                              if (editingItemId === item.id) cancelEdit();

                              setFormData({...formData, items: formData.items?.filter((i:any)=>i.id !== item.id)});

                            }} 

                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"

                          >

                            <Trash2 className="w-3.5 h-3.5" />

                          </button>

                        </div>

                      </motion.div>

                    ))}

                  </div>

                </div>

              )}

            </AnimatePresence>

          </div>

        </div>

        {editingLead?.id && (

          <div className="px-6 py-4 bg-gray-50/80 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 flex justify-end items-center gap-4">

            <span className="text-[10px] font-bold text-gray-400 italic">Cotação gerada no dia {new Date().toLocaleDateString('pt-BR')}</span>

            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/cotacao/${editingLead.id}`); setLinkCopied(true); setTimeout(()=>setLinkCopied(false),3000); }} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2 ${linkCopied ? 'bg-green-500 text-white' : 'bg-[#19727d] text-white hover:bg-[#145d66]'}`}>

              {linkCopied ? <><CheckCircle className="w-3.5 h-3.5" /> Link Copiado!</> : <><Search className="w-3.5 h-3.5" /> Copiar Link da Cotação</>}

            </button>

          </div>

        )}

      </motion.div>

    </div>

  );

}

