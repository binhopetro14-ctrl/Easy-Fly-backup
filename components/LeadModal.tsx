'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Trash2, Search, ChevronDown, AlertCircle, 
  Plane, Hotel, Shield, Car, LayoutGrid, DollarSign,
  User as UserIcon, Users, Baby, Briefcase, FileText, Tag, Target,
  Phone, Mail
} from 'lucide-react';
import { Lead, CRMStatus, Customer, Group, Supplier, SaleItem, ItemType } from '@/types';
import { SearchSelectorModal } from './Modals';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  editingLead?: Lead | null;
  customers: Customer[];
  groups: Group[];
  suppliers: Supplier[];
  onAddCustomerClick: () => void;
  onEditCustomerClick: (customer: Customer) => void;
  onDeleteCustomerClick: (customer: Customer) => void;
}

const ITEM_TYPES: { id: ItemType; label: string }[] = [
  { id: 'passagem', label: 'Passagem' },
  { id: 'hospedagem', label: 'Hospedagem' },
  { id: 'seguro', label: 'Seguro' },
  { id: 'aluguel', label: 'Aluguel de Carro' },
  { id: 'adicionais', label: 'Adicionais' },
];

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
  customers,
  groups,
  suppliers,
  onAddCustomerClick,
  onEditCustomerClick,
  onDeleteCustomerClick
}: LeadModalProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    value: 0,
    status: 'novo_contato',
    phone: '',
    email: '',
    notes: '',
    source: '',
    items: []
  });

  const [activeItemType, setActiveItemType] = useState<ItemType>('passagem');
  const [leadTargetType, setLeadTargetType] = useState<'individual' | 'group'>('individual');
  const [isSearchSelectorOpen, setIsSearchSelectorOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [additionalCustomerIds, setAdditionalCustomerIds] = useState<string[]>([]);

  const [currentItem, setCurrentItem] = useState<Partial<SaleItem>>({
    type: 'passagem',
    flightType: 'ida_volta',
    adults: 1,
    children: 0,
    babies: 0,
    bags23kg: 0,
    valuePaidByCustomer: 0,
    emissionValue: 0,
    additionalCosts: 0,
    vendor: '',
    origin: '',
    destination: '',
    locator: '',
    emissionDate: '',
    departureDate: '',
    returnDate: '',
    checkIn: '',
    checkOut: '',
    hasBreakfast: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (editingLead) {
        setFormData(editingLead);
        setLeadTargetType('individual'); 
      } else {
        setFormData({
          name: '',
          value: 0,
          status: 'novo_contato',
          phone: '',
          email: '',
          notes: '',
          source: '',
          items: []
        });
        setLeadTargetType('individual');
      }
      setAdditionalCustomerIds([]);
      setError(null);
      setEditingItemId(null);
    }
  }, [editingLead, isOpen]);

  const handleAddItem = () => {
    const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || '';
    
    const primaryName = formData.name || '';
    const allNames = [
      primaryName,
      ...(additionalCustomerIds.map(id => getCustomerName(id)))
    ].filter((n): n is string => !!n).map(n => n.toUpperCase()).join(', ');

    if (!allNames && !formData.name) {
      setError('Informe o nome do cliente ou selecione um da lista.');
      return;
    }

    setError(null);

    const newItem: SaleItem = {
      ...currentItem,
      id: editingItemId || `temp_${Math.random().toString(36).substr(2, 9)}`,
      type: activeItemType,
      passengerName: allNames
    } as SaleItem;

    if (editingItemId) {
      setFormData(prev => ({
        ...prev,
        items: prev.items?.map(item => item.id === editingItemId ? newItem : item)
      }));
      setEditingItemId(null);
    } else {
      setFormData(prev => ({
        ...prev,
        items: [...(prev.items || []), newItem]
      }));
    }

    // Reset current item form
    setCurrentItem({
      type: activeItemType,
      flightType: 'ida_volta',
      adults: 1,
      children: 0,
      babies: 0,
      bags23kg: 0,
      valuePaidByCustomer: 0,
      emissionValue: 0,
      additionalCosts: 0,
      vendor: '',
      origin: '',
      destination: '',
      locator: '',
      emissionDate: '',
      departureDate: '',
      returnDate: '',
      checkIn: '',
      checkOut: '',
      hasBreakfast: false,
    });
    setAdditionalCustomerIds([]);
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== id)
    }));
  };

  const editItem = (item: SaleItem) => {
    setEditingItemId(item.id);
    setActiveItemType(item.type);
    setCurrentItem(item);
    document.getElementById('item-form-lead')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalValue = formData.items?.reduce((sum, item) => sum + (item.valuePaidByCustomer || 0) + (item.additionalCosts || 0), 0) || formData.value || 0;
    onSave({ ...formData, value: totalValue });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl bg-white dark:bg-[#1e293b] dark:border dark:border-slate-700/50 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between bg-white dark:bg-[#1e293b]">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {editingLead ? 'Editar Orçamento' : 'Novo Orçamento / Cotação'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Monte o roteiro para enviar ao cliente</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Selecione o Cliente</label>
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLeadTargetType('individual')}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                    leadTargetType === 'individual' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => setLeadTargetType('group')}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                    leadTargetType === 'group' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Grupo
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition-all text-sm appearance-none pr-12 outline-none"
                  value={leadTargetType === 'individual' ? (customers.find(c => c.name === formData.name)?.id || '') : (groups.find(g => g.name === formData.name)?.id || '')}
                  onChange={e => {
                    const item = leadTargetType === 'individual' 
                      ? customers.find(c => c.id === e.target.value) 
                      : groups.find(g => g.id === e.target.value);
                    setFormData(prev => ({ 
                      ...prev, 
                      name: item?.name || '',
                      phone: (item as Customer)?.phone || prev.phone,
                      email: (item as Customer)?.email || prev.email
                    }));
                  }}
                >
                  <option value="">{leadTargetType === 'individual' ? 'Pesquisar Cliente...' : 'Pesquisar Grupo...'}</option>
                  {leadTargetType === 'individual' 
                    ? customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    : groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)
                  }
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400">
                  <button type="button" onClick={() => setIsSearchSelectorOpen(true)} className="p-1 hover:bg-gray-200 rounded-md transition-colors"><Search className="w-3.5 h-3.5" /></button>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              <button type="button" onClick={onAddCustomerClick} className="p-2.5 bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-xl hover:bg-gray-200 transition-all">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {additionalCustomerIds.map((selectedId, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <select 
                      className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 text-sm appearance-none pr-10 outline-none"
                      value={selectedId}
                      onChange={e => {
                        const newIds = [...additionalCustomerIds];
                        newIds[idx] = e.target.value;
                        setAdditionalCustomerIds(newIds);
                      }}
                    >
                      <option value="">Selecione o cliente {idx + 2}...</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  <button type="button" onClick={() => setAdditionalCustomerIds(additionalCustomerIds.filter((_, i) => i !== idx))} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <div className="flex justify-start">
                <button type="button" onClick={() => setAdditionalCustomerIds([...additionalCustomerIds, ''])} className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-purple-600 uppercase tracking-widest transition-colors group">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-purple-50 transition-colors"><Plus className="w-3 h-3" /></div>
                  <span>Adicionar outro acompanhante</span>
                </button>
              </div>
            </div>
          </div>

          <SearchSelectorModal
            isOpen={isSearchSelectorOpen}
            onClose={() => setIsSearchSelectorOpen(false)}
            title={leadTargetType === 'individual' ? "Pesquisar Cliente" : "Pesquisar Grupo"}
            items={leadTargetType === 'individual' 
              ? customers.map(c => ({ id: c.id, name: c.name, subtitle: c.email, originalItem: c }))
              : groups.map(g => ({ id: g.id, name: g.name, subtitle: `${g.memberIds.length} membros`, originalItem: g }))
            }
            onSelect={(id) => {
              const item = leadTargetType === 'individual' 
                ? customers.find(c => c.id === id) 
                : groups.find(g => g.id === id);
              setFormData(prev => ({ 
                ...prev, 
                name: item?.name || '',
                phone: (item as Customer)?.phone || prev.phone,
                email: (item as Customer)?.email || prev.email
              }));
            }}
            onAddNew={leadTargetType === 'individual' ? onAddCustomerClick : undefined}
            onEdit={leadTargetType === 'individual' ? onEditCustomerClick : undefined}
            onDelete={leadTargetType === 'individual' ? onDeleteCustomerClick : undefined}
          />

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Etapa do Funil</label>
               <div className="relative">
                 <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                 <select
                   value={formData.status}
                   onChange={(e) => setFormData({ ...formData, status: e.target.value as CRMStatus })}
                   className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm appearance-none outline-none"
                 >
                   {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                 </select>
               </div>
             </div>
             <div className="space-y-1">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Origem</label>
               <div className="relative">
                 <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                 <input type="text" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none" placeholder="Ex: Instagram" />
               </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Telefone</label>
               <div className="relative">
                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none" placeholder="(00) 00000-0000" />
               </div>
             </div>
             <div className="space-y-1">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none" placeholder="exemplo@email.com" />
               </div>
             </div>
          </div>

          <div className="border-t pt-6">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Roteiro / Itens da Cotação</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {ITEM_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setActiveItemType(type.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeItemType === type.id ? 'bg-[#06B6D4] text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div id="item-form-lead" className="p-6 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-3xl space-y-6">
              {activeItemType === 'passagem' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setCurrentItem(prev => ({ ...prev, flightType: 'ida' }))} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${currentItem.flightType === 'ida' ? 'bg-[#06B6D4] text-white' : 'bg-white border text-gray-400'}`}>Somente Ida</button>
                    <button type="button" onClick={() => setCurrentItem(prev => ({ ...prev, flightType: 'ida_volta' }))} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${currentItem.flightType === 'ida_volta' ? 'bg-[#06B6D4] text-white' : 'bg-white border text-gray-400'}`}>Ida e Volta</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Origem" className="px-4 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500/20" value={currentItem.origin} onChange={e => setCurrentItem(prev => ({ ...prev, origin: e.target.value }))} />
                    <input type="text" placeholder="Destino" className="px-4 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500/20" value={currentItem.destination} onChange={e => setCurrentItem(prev => ({ ...prev, destination: e.target.value }))} />
                  </div>
                </div>
              )}

              {activeItemType === 'hospedagem' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Nome do Hotel" className="px-4 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500/20" value={currentItem.hotelName || ''} onChange={e => setCurrentItem(prev => ({ ...prev, hotelName: e.target.value, description: e.target.value }))} />
                  <input type="text" placeholder="Cidade / Localização" className="px-4 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500/20" value={currentItem.destination || ''} onChange={e => setCurrentItem(prev => ({ ...prev, destination: e.target.value }))} />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Fornecedor</label>
                  <select className="w-full px-4 py-2 bg-white border rounded-xl text-sm outline-none" value={currentItem.vendor} onChange={e => setCurrentItem(prev => ({ ...prev, vendor: e.target.value }))}>
                    <option value="">Selecione...</option>
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Valor Orçado</label>
                  <input type="number" className="w-full px-4 py-2 bg-white border rounded-xl text-sm outline-none" value={currentItem.valuePaidByCustomer} onChange={e => setCurrentItem(prev => ({ ...prev, valuePaidByCustomer: parseFloat(e.target.value) }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Custo Est.</label>
                  <input type="number" className="w-full px-4 py-2 bg-white border rounded-xl text-sm outline-none" value={currentItem.emissionValue} onChange={e => setCurrentItem(prev => ({ ...prev, emissionValue: parseFloat(e.target.value) }))} />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="button" onClick={handleAddItem} className="px-6 py-2 bg-[#06B6D4] text-white rounded-xl text-sm font-bold shadow-lg hover:bg-cyan-600 transition-all">
                  {editingItemId ? 'Atualizar Item' : 'Adicionar ao Orçamento'}
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {formData.items?.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      {item.type === 'passagem' ? <Plane className="w-5 h-5 text-blue-500" /> : <Hotel className="w-5 h-5 text-orange-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white uppercase">
                        {item.type === 'passagem' ? `${item.origin} ➔ ${item.destination}` : item.hotelName || item.description}
                      </h4>
                      <p className="text-[9px] text-gray-400 font-bold">FORNECEDOR: {item.vendor || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-900 dark:text-white">R$ {item.valuePaidByCustomer?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => editItem(item)} className="p-2 text-gray-300 hover:text-blue-500 transition-colors"><FileText className="w-4 h-4" /></button>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1 pt-4 border-t">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Observações / Detalhes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
              placeholder="Descreva detalhes adicionais..."
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-[#1e293b] border-t flex items-center justify-between">
          <div className="hidden md:block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor Total do Orçamento</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              R$ {(formData.items?.reduce((sum, i) => sum + (i.valuePaidByCustomer || 0), 0) || formData.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={onClose} className="flex-1 md:flex-none px-8 py-3 bg-white border text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all">Cancelar</button>
            <button onClick={handleSubmit} className="flex-1 md:flex-none px-10 py-3 bg-purple-600 text-white rounded-2xl font-bold text-sm hover:bg-purple-700 shadow-xl shadow-purple-500/20 active:scale-95 transition-all">
              {editingLead ? 'Salvar Alterações' : 'Salvar Orçamento'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
