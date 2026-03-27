'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Plane, Hotel, Shield, Car, Trash2, Layout, 
  Tag as TagIcon, Minus, Luggage, User, Baby, Clock,
  MapPin, Pencil, Search, ChevronDown, Target, Phone, Mail, FileText, Users, MessageCircle
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
    notes: ''
  });

  const [currentItem, setCurrentItem] = useState<any>({
    type: 'passagem',
    flightType: 'ida', 
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    hotelName: '',
    hotelAddress: '',
    checkInDate: '',
    checkInTime: '14:00',
    checkOutDate: '',
    checkOutTime: '12:00',
    dailyNights: '',
    rooms: '1',
    roomType: 'Não informado',
    stars: 'Não informado',
    boardBasis: 'Não informado',
    value: 0,
    cost: 0,
    vendor: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (editingLead) {
        setFormData({
          ...editingLead,
          title: editingLead.title || '',
          name: editingLead.name || '',
          adults: editingLead.adults || 1,
          children: editingLead.children || 0,
          babies: editingLead.babies || 0,
          luggage23kg: editingLead.luggage23kg || 0,
          items: editingLead.items || [],
          tags: editingLead.tags || []
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
          notes: ''
        });
      }
      setEditingItemId(null);
    }
  }, [editingLead, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim().toUpperCase())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim().toUpperCase()] });
      setTagInput('');
    }
  };

  const handleAddItem = () => {
    let itemDescription = 'Serviço';
    if (currentItem.type === 'passagem') {
      itemDescription = currentItem.origin && currentItem.destination ? `${currentItem.origin} → ${currentItem.destination}` : 'Passagem Aérea';
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
    setCurrentItem({ 
      type: currentItem.type, 
      flightType: 'ida', origin: '', destination: '', departureDate: '', returnDate: '', 
      hotelName: '', hotelAddress: '', checkInDate: '', checkInTime: '14:00', checkOutDate: '', checkOutTime: '12:00', dailyNights: '', rooms: '1', roomType: 'Não informado', stars: 'Não informado', boardBasis: 'Não informado',
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
        className="bg-white dark:bg-[#1e293b] w-full max-w-4xl rounded-[24px] overflow-hidden flex flex-col max-h-[95vh] shadow-2xl border border-gray-100 dark:border-slate-700/50"
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
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex bg-gray-100 dark:bg-slate-900 p-0.5 rounded-lg w-fit">
                      <button onClick={() => setCurrentItem({...currentItem, flightType: 'ida'})} className={`px-4 py-1 rounded-md text-[10px] font-bold transition-all ${currentItem.flightType === 'ida' ? 'bg-white dark:bg-slate-700 text-gray-700 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}>Ida</button>
                      <button onClick={() => setCurrentItem({...currentItem, flightType: 'ida_volta'})} className={`px-4 py-1 rounded-md text-[10px] font-bold transition-all ${currentItem.flightType === 'ida_volta' ? 'bg-white dark:bg-slate-700 text-gray-700 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}>Ida e Volta</button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-tight">Origem</label>
                      <input placeholder="Ex: GIG - Rio..." className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-xs font-bold text-gray-800 dark:text-white" value={currentItem.origin} onChange={e => setCurrentItem({...currentItem, origin: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-tight">Destino</label>
                      <input placeholder="Ex: MCO - Orlando..." className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-xs font-bold text-gray-800 dark:text-white" value={currentItem.destination} onChange={e => setCurrentItem({...currentItem, destination: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-tight">Ida</label>
                      <input type="date" className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-xs font-bold text-gray-800 dark:text-white" value={currentItem.departureDate} onChange={e => setCurrentItem({...currentItem, departureDate: e.target.value})} />
                    </div>
                    {currentItem.flightType === 'ida_volta' && (
                      <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-tight">Volta</label>
                        <input type="date" className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-xs font-bold text-gray-800 dark:text-white" value={currentItem.returnDate} onChange={e => setCurrentItem({...currentItem, returnDate: e.target.value})} />
                      </div>
                    )}
                  </div>
                </div>
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
                      <input type="date" className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-xs font-bold text-gray-800 dark:text-white" value={currentItem.checkInDate} onChange={e => setCurrentItem({...currentItem, checkInDate: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-tight">Check-out</label>
                      <input type="date" className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl outline-none text-xs font-bold text-gray-800 dark:text-white" value={currentItem.checkOutDate} onChange={e => setCurrentItem({...currentItem, checkOutDate: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              {/* Campos Financeiros Gerais do Item */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-slate-700 pt-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-cyan-500 uppercase ml-1 tracking-tight">Venda por Pessoa</label>
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
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Venda Total</span>
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
            
            <button 
              onClick={() => onSave(formData)} 
              disabled={!formData.title}
              className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/10 active:scale-95 ${
                formData.title ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {editingLead ? 'SALVAR ALTERAÇÕES' : 'CRIAR ORÇAMENTO'}
            </button>

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
      </motion.div>
    </div>
  );
}
