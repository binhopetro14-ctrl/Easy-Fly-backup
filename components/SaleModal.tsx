import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import {
  X,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  AlertCircle,
  Plane,
  Hotel,
  Shield,
  Car,
  MoreHorizontal,
  Settings,
  Calendar,
  User as UserIcon,
  Users,
  Baby,
  Briefcase,
  LayoutGrid,
  DollarSign,
  RefreshCw,
  ArrowLeftRight,
  ArrowLeft,
  FileText,
  Upload,
  Loader2
} from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { Sale, SaleItem, Customer, Group, ItemType, TransactionStatus, Supplier } from '@/types';
import { SearchSelectorModal } from './Modals';

const ITEM_TYPES: { id: ItemType; label: string }[] = [
  { id: 'passagem', label: 'Passagem' },
  { id: 'hospedagem', label: 'Hospedagem' },
  { id: 'seguro', label: 'Seguro' },
  { id: 'aluguel', label: 'Aluguel de Carro' },
  { id: 'adicionais', label: 'Adicionais' },
];

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Sale>) => void;
  sale: Sale | null;
  customers: Customer[];
  groups: Group[];
  suppliers: Supplier[];
  onAddCustomerClick: () => void;
  onEditCustomerClick: (customer: Customer) => void;
  onDeleteCustomerClick: (customer: Customer) => void;
}

export function SaleModal({ 
  isOpen, 
  onClose, 
  onSave, 
  sale,
  customers,
  groups,
  suppliers,
  onAddCustomerClick,
  onEditCustomerClick,
  onDeleteCustomerClick
}: SaleModalProps) {
  const [formData, setFormData] = useState<Partial<Sale>>({
    saleDate: new Date().toISOString().split('T')[0],
    customerId: '',
    groupId: '',
    items: [],
    totalValue: 0,
    totalCost: 0,
    costStatus: 'Pendente',
    saleStatus: 'Pendente',
    paymentMethod: 'Não definido',
    notes: '',
  });

  const [activeItemType, setActiveItemType] = useState<ItemType>('passagem');
  const [saleTargetType, setSaleTargetType] = useState<'individual' | 'group'>('individual');
  const [isSearchSelectorOpen, setIsSearchSelectorOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [additionalCustomerIds, setAdditionalCustomerIds] = useState<string[]>([]);
  const [isModelHelpOpen, setIsModelHelpOpen] = useState(false);
  const [isUploadingTicket, setIsUploadingTicket] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (sale) {
        setFormData({
          saleDate: sale.saleDate || new Date().toISOString().split('T')[0],
          customerId: sale.customerId || '',
          customerName: sale.customerName || '',
          groupId: sale.groupId || '',
          groupName: sale.groupName || '',
          items: [...sale.items],
          totalValue: sale.totalValue,
          totalCost: sale.totalCost,
          costStatus: sale.costStatus || 'Pendente',
          saleStatus: sale.saleStatus || 'Pendente',
          paymentMethod: sale.paymentMethod,
          notes: sale.notes,
        });
        setSaleTargetType(sale.groupId ? 'group' : 'individual');
      } else {
        setFormData({
          saleDate: new Date().toISOString().split('T')[0],
          customerId: '',
          groupId: '',
          items: [],
          totalValue: 0,
          totalCost: 0,
          costStatus: 'Pendente',
          saleStatus: 'Pendente',
          paymentMethod: 'Não definido',
          notes: '',
        });
        setSaleTargetType('individual');
      }
      setAdditionalCustomerIds([]);
      setError(null);
      setEditingItemId(null);
    }
  }, [sale, isOpen]);

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
    checkIn: '',
    checkOut: '',
    hasBreakfast: false,
    returnDate: '',
  });

  const handleTicketUpload = async (e: React.ChangeEvent<HTMLInputElement>, ticketIndex: 1 | 2 = 1) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Apenas arquivos PDF são permitidos para o bilhete.');
      return;
    }

    try {
      setIsUploadingTicket(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `tickets/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('sale_tickets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sale_tickets')
        .getPublicUrl(filePath);

      if (ticketIndex === 1) {
        setCurrentItem(prev => ({ ...prev, ticket_url: publicUrl }));
      } else {
        setCurrentItem(prev => ({ ...prev, ticket_url2: publicUrl }));
      }
    } catch (err: any) {
      console.error('Error uploading ticket:', err);
      setError('Erro ao enviar o bilhete: ' + (err.message || 'Tente novamente.'));
    } finally {
      setIsUploadingTicket(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (fileInputRef2.current) fileInputRef2.current.value = '';
    }
  };

  const totalValue = formData.items?.reduce((sum, item) => sum + (item.valuePaidByCustomer || 0) + (item.additionalCosts || 0), 0) || 0;
  const totalCost = formData.items?.reduce((sum, item) => sum + (item.emissionValue || 0), 0) || 0;

  if (!isOpen) return null;

  const handleAddItem = () => {
    // Lista unificada de passageiros em um único item
    const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || '';
    const allNames = [
      formData.customerName,
      ...(additionalCustomerIds.map(id => getCustomerName(id)))
    ].filter((n): n is string => !!n).map(n => n.toUpperCase()).join(', ');

    if (!allNames) {
      setError('Selecione pelo menos um cliente.');
      return;
    }

    setError(null);

    if (editingItemId) {
      setFormData(prev => ({
        ...prev,
        items: prev.items?.map(item => 
          item.id === editingItemId 
            ? { ...currentItem, passengerName: allNames, id: editingItemId, type: activeItemType } as SaleItem 
            : item
        )
      }));
      setEditingItemId(null);
    } else {
      const newItem: SaleItem = {
        ...currentItem,
        id: `temp_${Math.random().toString(36).substr(2, 9)}`,
        type: activeItemType,
        passengerName: allNames
      } as SaleItem;

      setFormData(prev => ({
        ...prev,
        items: [...(prev.items || []), newItem]
      }));
    }

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

  const editItem = (item: SaleItem) => {
    setEditingItemId(item.id);
    setActiveItemType(item.type);
    setCurrentItem(item);
    setError(null);
    // Scroll to item form
    const formElement = document.getElementById('item-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== id)
    }));
    if (editingItemId === id) {
      setEditingItemId(null);
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
    }
  };

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    
    let currentItems = [...(formData.items || [])];

    // Auto-add current item if it's filled and list is empty
    const hasCurrentItemData = currentItem.origin || currentItem.destination || currentItem.valuePaidByCustomer;
    if (hasCurrentItemData && !editingItemId) {
      const allNames = [
        formData.customerName,
        ...additionalCustomerIds.map(id => customers.find(c => c.id === id)?.name)
      ].filter(Boolean).join(', ');

      if (allNames) {
        const newItem: SaleItem = {
          ...(currentItem as SaleItem),
          id: `temp_${Math.random().toString(36).substr(2, 9)}`,
          passengerName: allNames,
          saleModel: currentItem.saleModel || 'Revenda'
        };
        currentItems.push(newItem);
      }
    }

    if (currentItems.length === 0) {
      setError('Adicione pelo menos um item à venda antes de finalizar.');
      return;
    }
    
    // Generate product name summary
    const productSummary = currentItems.map(item => {
      const typeLabel = ITEM_TYPES.find(t => t.id === item.type)?.label || item.type;
      return typeLabel;
    }).filter((v, i, a) => a.indexOf(v) === i).join(' + ') || 'N/A';

    console.log('Submitting sale:', { ...formData, items: currentItems, totalValue, totalCost, productName: productSummary });
    onSave({ ...formData, items: currentItems, totalValue, totalCost, productName: productSummary });
  };


  const profit = totalValue - totalCost;
  const margin = totalValue > 0 ? (profit / totalValue) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-200">{sale ? 'Editar Emissão' : 'Nova Emissão'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-400 uppercase tracking-wider">Item Emitido</label>
            <div className="flex wrap gap-2">
              {ITEM_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setActiveItemType(type.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeItemType === type.id 
                      ? 'bg-[#06B6D4] text-white shadow-lg shadow-cyan-500/20' 
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-400 uppercase tracking-wider">Cliente</label>
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSaleTargetType('individual');
                    setFormData(prev => ({ ...prev, groupId: '', customerId: '' }));
                  }}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                    saleTargetType === 'individual' ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSaleTargetType('group');
                    setFormData(prev => ({ ...prev, customerId: '', groupId: '' }));
                  }}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                    saleTargetType === 'group' ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Grupo
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              {saleTargetType === 'individual' ? (
                <>
                  <div className="flex-1 relative">
                    <select 
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm appearance-none pr-12"
                      value={formData.customerId}
                      onChange={e => {
                        const customer = customers.find(c => c.id === e.target.value);
                        setFormData(prev => ({ 
                          ...prev, 
                          customerId: e.target.value,
                          customerName: customer ? customer.name : ''
                        }));
                      }}
                      required
                    >
                      <option value="">Nome do cliente...</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400">
                      <button 
                        type="button"
                        onClick={() => setIsSearchSelectorOpen(true)}
                        className="p-1 hover:bg-gray-200 rounded-md transition-colors pointer-events-auto"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                      <ChevronDown className="w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={onAddCustomerClick}
                    className="p-2.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex-1 relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm appearance-none pr-12"
                    value={formData.groupId}
                    onChange={e => {
                      const group = groups.find(g => g.id === e.target.value);
                      setFormData(prev => ({ 
                        ...prev, 
                        groupId: e.target.value,
                        groupName: group ? group.name : ''
                      }));
                    }}
                    required
                  >
                    <option value="">Nome do grupo...</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400">
                    <button 
                      type="button"
                      onClick={() => setIsSearchSelectorOpen(true)}
                      className="p-1 hover:bg-gray-200 rounded-md transition-colors pointer-events-auto"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown className="w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* Múltiplos Seletores de Cliente */}
            <div className="space-y-3 mt-2">
              {additionalCustomerIds.map((selectedId, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Nome do Cliente {idx + 2}</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm appearance-none pr-12"
                        value={selectedId}
                        onChange={e => {
                          const newIds = [...additionalCustomerIds];
                          newIds[idx] = e.target.value;
                          setAdditionalCustomerIds(newIds);
                        }}
                      >
                        <option value="">Selecione o cliente...</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400 pointer-events-none">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setAdditionalCustomerIds(additionalCustomerIds.filter((_, i) => i !== idx))}
                    className="p-2.5 bg-gray-50 dark:bg-slate-800/50 text-gray-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {/* Botão + para adicionar novos campos de cliente */}
              <div className="flex justify-start px-1">
                <button 
                  type="button" 
                  onClick={() => setAdditionalCustomerIds([...additionalCustomerIds, ''])}
                  className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 hover:text-[#06B6D4] uppercase tracking-widest transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-cyan-50 transition-colors">
                    <Plus className="w-3 h-3" />
                  </div>
                  <span>Adicionar outro cliente</span>
                </button>
              </div>
            </div>
          </div>

          <SearchSelectorModal
            isOpen={isSearchSelectorOpen}
            onClose={() => setIsSearchSelectorOpen(false)}
            title={saleTargetType === 'individual' ? "Pesquisar Cliente" : "Pesquisar Grupo"}
            items={saleTargetType === 'individual' 
              ? customers.map(c => ({ id: c.id, name: c.name, subtitle: c.email, originalItem: c }))
              : groups.map(g => ({ id: g.id, name: g.name, subtitle: `${g.memberIds.length} membros`, originalItem: g }))
            }
            onSelect={(id) => {
              if (saleTargetType === 'individual') {
                const customer = customers.find(c => c.id === id);
                setFormData(prev => ({ 
                  ...prev, 
                  customerId: id,
                  customerName: customer ? customer.name : ''
                }));
              } else {
                const group = groups.find(g => g.id === id);
                setFormData(prev => ({ 
                  ...prev, 
                  groupId: id, 
                  groupName: group ? group.name : ''
                }));
              }
            }}
            onAddNew={saleTargetType === 'individual' ? onAddCustomerClick : undefined}
            onEdit={saleTargetType === 'individual' ? onEditCustomerClick : undefined}
            onDelete={saleTargetType === 'individual' ? onDeleteCustomerClick : undefined}
          />

          {/* QUANTIDADE DE PASSAGEIROS */}
          <div className="flex flex-wrap items-center justify-center gap-10 py-4 border-y border-gray-100/50">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#06B6D4]" />
                <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Adultos</span>
              </div>
              <div className="flex items-center gap-2 group">
                <button type="button" onClick={() => setCurrentItem(prev => ({ ...prev, adults: Math.max(0, (prev.adults || 0) - 1) }))} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#06B6D4] font-bold text-lg">-</button>
                <span className="text-sm font-black text-gray-800 dark:text-gray-200 w-5 text-center">{currentItem.adults}</span>
                <button type="button" onClick={() => setCurrentItem(prev => ({ ...prev, adults: (prev.adults || 0) + 1 }))} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#06B6D4] font-bold text-lg">+</button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#06B6D4]" />
                <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Crianças</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCurrentItem(prev => ({ ...prev, children: Math.max(0, (prev.children || 0) - 1) }))} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#06B6D4] font-bold text-lg">-</button>
                <span className="text-sm font-black text-gray-800 dark:text-gray-200 w-5 text-center">{currentItem.children}</span>
                <button type="button" onClick={() => setCurrentItem(prev => ({ ...prev, children: (prev.children || 0) + 1 }))} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#06B6D4] font-bold text-lg">+</button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Baby className="w-4 h-4 text-[#06B6D4]" />
                <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Bebês</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCurrentItem(prev => ({ ...prev, babies: Math.max(0, (prev.babies || 0) - 1) }))} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#06B6D4] font-bold text-lg">-</button>
                <span className="text-sm font-black text-gray-800 dark:text-gray-200 w-5 text-center">{currentItem.babies}</span>
                <button type="button" onClick={() => setCurrentItem(prev => ({ ...prev, babies: (prev.babies || 0) + 1 }))} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#06B6D4] font-bold text-lg">+</button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#06B6D4]" />
                <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Malas 23kg</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCurrentItem(prev => ({ ...prev, bags23kg: Math.max(0, (prev.bags23kg || 0) - 1) }))} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#06B6D4] font-bold text-lg">-</button>
                <span className="text-sm font-black text-gray-800 dark:text-gray-200 w-5 text-center">{currentItem.bags23kg || 0}</span>
                <button type="button" onClick={() => setCurrentItem(prev => ({ ...prev, bags23kg: (prev.bags23kg || 0) + 1 }))} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#06B6D4] font-bold text-lg">+</button>
              </div>
            </div>
          </div>

          <div id="item-form" className="p-6 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-[24px] space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            {activeItemType === 'passagem' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-400 uppercase">DADOS DO VOO</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentItem(prev => ({ ...prev, flightType: 'ida' }))}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        currentItem.flightType === 'ida' ? 'bg-[#06B6D4] text-white' : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700'
                      }`}
                    >
                      Somente Ida
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentItem(prev => ({ ...prev, flightType: 'ida_volta' }))}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        currentItem.flightType === 'ida_volta' ? 'bg-[#06B6D4] text-white' : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700'
                      }`}
                    >
                      Ida e Volta
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Origem</label>
                    <input 
                      type="text" 
                      placeholder="Ex: GRU"
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                      value={currentItem.origin}
                      onChange={e => setCurrentItem(prev => ({ ...prev, origin: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Destino</label>
                    <input 
                      type="text" 
                      placeholder="Ex: LIS"
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                      value={currentItem.destination}
                      onChange={e => setCurrentItem(prev => ({ ...prev, destination: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Fornecedor <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none cursor-pointer"
                      value={currentItem.vendor || ''}
                      onChange={e => setCurrentItem(prev => ({ ...prev, vendor: e.target.value }))}
                      required
                    >
                      <option value="">Selecione um fornecedor...</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Localizador</label>
                    <input 
                      type="text" 
                      placeholder="Ex: ABC123"
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                      value={currentItem.locator}
                      onChange={e => setCurrentItem(prev => ({ ...prev, locator: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Data de Emissão</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                      value={currentItem.emissionDate}
                      onChange={e => setCurrentItem(prev => ({ ...prev, emissionDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Embarque</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                      value={currentItem.departureDate}
                      onChange={e => setCurrentItem(prev => ({ ...prev, departureDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Retorno</label>
                    <input 
                      type="date" 
                      disabled={currentItem.flightType === 'ida'}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none disabled:bg-gray-100 dark:disabled:bg-slate-800"
                      value={currentItem.returnDate}
                      onChange={e => setCurrentItem(prev => ({ ...prev, returnDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeItemType !== 'passagem' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-400 uppercase">DADOS DO ITEM</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Descrição / Nome</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Hotel Copacabana Palace"
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                      value={currentItem.description || currentItem.hotelName || ''}
                      onChange={e => setCurrentItem(prev => ({ ...prev, description: e.target.value, hotelName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Fornecedor <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none cursor-pointer"
                      value={currentItem.vendor || ''}
                      onChange={e => setCurrentItem(prev => ({ ...prev, vendor: e.target.value }))}
                      required
                    >
                      <option value="">Selecione um fornecedor...</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Data de Emissão</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                      value={currentItem.emissionDate || ''}
                      onChange={e => setCurrentItem(prev => ({ ...prev, emissionDate: e.target.value }))}
                    />
                  </div>
                </div>

                {(activeItemType === 'hospedagem' || activeItemType === 'aluguel') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        {activeItemType === 'hospedagem' ? 'Check-in' : 'Data do Início'}
                      </label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                        value={currentItem.checkIn || ''}
                        onChange={e => setCurrentItem(prev => ({ ...prev, checkIn: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        {activeItemType === 'hospedagem' ? 'Check-out' : 'Data do Fim'}
                      </label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                        value={currentItem.checkOut || ''}
                        onChange={e => setCurrentItem(prev => ({ ...prev, checkOut: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {activeItemType === 'seguro' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Data do Início</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                        value={currentItem.departureDate || ''}
                        onChange={e => setCurrentItem(prev => ({ ...prev, departureDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Data do Fim</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                        value={currentItem.returnDate || ''}
                        onChange={e => setCurrentItem(prev => ({ ...prev, returnDate: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-6 pt-6 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-400 uppercase">FINANCEIRO</span>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Valor Pago pelo Cliente (R$)</label>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                    placeholder="R$ 0,00"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                    value={currentItem.valuePaidByCustomer}
                    onValueChange={(values) => {
                      setCurrentItem(prev => ({ ...prev, valuePaidByCustomer: values.floatValue || 0 }));
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Valor da Emissão / Custo (R$)</label>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                    placeholder="R$ 0,00"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                    value={currentItem.emissionValue}
                    onValueChange={(values) => {
                      setCurrentItem(prev => ({ ...prev, emissionValue: values.floatValue || 0 }));
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="space-y-1 flex-1 max-w-[200px]">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Custos Adicionais</label>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                    placeholder="R$ 0,00"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none"
                    value={currentItem.additionalCosts}
                    onValueChange={(values) => {
                      setCurrentItem(prev => ({ ...prev, additionalCosts: values.floatValue || 0 }));
                    }}
                  />
                </div>
                <div className="space-y-1 flex-1 max-w-[250px]">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Modelo de Venda</label>
                    <button 
                      type="button"
                      onClick={() => setIsModelHelpOpen(true)}
                      className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 dark:text-gray-500 hover:bg-gray-200 hover:text-cyan-600 transition-colors"
                    >
                      !
                    </button>
                  </div>
                  <select 
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm outline-none cursor-pointer"
                    value={currentItem.saleModel || 'Customizado'}
                    onChange={e => setCurrentItem(prev => ({ ...prev, saleModel: e.target.value }))}
                  >
                    <option value="Customizado">Customizado</option>
                    <option value="Comissão direta">Comissão direta</option>
                    <option value="Comissão com repasse">Comissão com repasse</option>
                    <option value="Revenda">Revenda</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 min-w-[280px]">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Bilhetes (PDF)</label>
                  <div className="flex gap-2">
                    {/* Bilhete 1 */}
                    <div className="flex-1">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept=".pdf"
                        onChange={(e) => handleTicketUpload(e, 1)}
                      />
                      {currentItem.ticket_url ? (
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-xl h-[38px]">
                          <FileText className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-[10px] font-bold text-green-600 truncate max-w-[60px]">PDF 1</span>
                          <button 
                            type="button" 
                            onClick={() => setCurrentItem(prev => ({ ...prev, ticket_url: undefined }))}
                            className="p-1 hover:bg-green-100 rounded-full text-green-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          disabled={isUploadingTicket}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-500 text-gray-500 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2 h-[38px]"
                        >
                          {isUploadingTicket ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} PDF 1
                        </button>
                      )}
                    </div>

                    {/* Bilhete 2 */}
                    <div className="flex-1">
                      <input 
                        type="file" 
                        ref={fileInputRef2}
                        className="hidden" 
                        accept=".pdf"
                        onChange={(e) => handleTicketUpload(e, 2)}
                      />
                      {currentItem.ticket_url2 ? (
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-xl h-[38px]">
                          <FileText className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-[10px] font-bold text-green-600 truncate max-w-[60px]">PDF 2</span>
                          <button 
                            type="button" 
                            onClick={() => setCurrentItem(prev => ({ ...prev, ticket_url2: undefined }))}
                            className="p-1 hover:bg-green-100 rounded-full text-green-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          disabled={isUploadingTicket}
                          onClick={() => fileInputRef2.current?.click()}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-500 text-gray-500 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2 h-[38px]"
                        >
                          {isUploadingTicket ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} PDF 2
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-end justify-end">
                  <button 
                    type="button"
                    onClick={handleAddItem}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 h-[38px] shadow-sm ${
                      editingItemId 
                        ? 'bg-amber-500 text-white hover:bg-amber-600' 
                        : 'bg-[#06B6D4] text-white hover:bg-[#0891B2]'
                    }`}
                  >
                    {editingItemId ? (
                      <>
                        <Settings className="w-3 h-3" /> Atualizar
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" /> Adicionar item
                      </>
                    )}
                  </button>
                </div>
            </div>
          </div>
        </div>

          {formData.items && formData.items.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-3 bg-cyan-500 rounded-full"></div>
                Passageiros na Reserva ({formData.items.length})
              </label>
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-cyan-50/50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-cyan-600 font-bold text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="text-sm font-black text-gray-900 dark:text-gray-100 capitalize">{item.type}</p>
                          {item.passengerName && item.passengerName.split(', ').map((name, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 bg-white border border-cyan-200 text-cyan-600 rounded-md font-black uppercase tracking-tighter">
                              {name}
                            </span>
                          ))}
                          {item.ticket_url && (
                            <a 
                              href={item.ticket_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-5 h-5 flex items-center justify-center bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-all ml-1"
                              title="Bilhete 1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {item.ticket_url2 && (
                            <a 
                              href={item.ticket_url2} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-5 h-5 flex items-center justify-center bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition-all ml-1"
                              title="Bilhete 2"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {item.origin} {item.origin && '→'} {item.destination || item.description || item.hotelName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900 dark:text-gray-100">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.valuePaidByCustomer || 0) + (item.additionalCosts || 0))}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => editItem(item)} 
                          className={`p-2 rounded-lg transition-colors ${
                            editingItemId === item.id ? 'bg-amber-100 text-amber-600' : 'hover:bg-cyan-100 text-cyan-600'
                          }`}
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-400 uppercase tracking-wider">Método de Pagamento</label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm"
                  value={formData.paymentMethod}
                  onChange={e => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                >
                  <option value="Não definido">Não definido</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Pix">Pix</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Boleto">Boleto</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-400 uppercase tracking-wider">Status Custo</label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm"
                  value={formData.costStatus}
                  onChange={e => setFormData(prev => ({ ...prev, costStatus: e.target.value as TransactionStatus }))}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Pago">Pago</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-400 uppercase tracking-wider">Status Venda</label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm"
                  value={formData.saleStatus}
                  onChange={e => setFormData(prev => ({ ...prev, saleStatus: e.target.value as TransactionStatus }))}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Recebido">Recebido</option>
                  <option value="Parcial">Parcial</option>
                  <option value="Atrasado">Atrasado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-400 uppercase tracking-wider">Observações</label>
              <textarea 
                placeholder="Observações sobre a venda..."
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl text-sm min-h-[80px]"
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-slate-700/50 bg-white dark:bg-[#1e293b]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">CUSTO TOTAL</p>
              <p className="text-sm font-black text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCost)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">VALOR DA VENDA</p>
              <p className="text-sm font-black text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-2xl text-center">
              <p className="text-[10px] font-bold text-green-600 uppercase mb-1">LUCRO / MARGEM</p>
              <p className="text-sm font-black text-green-700">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(profit)}
              </p>
              <p className="text-[10px] text-green-600 font-bold">{margin.toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-[#06B6D4] text-white font-bold rounded-xl hover:bg-[#0891B2] shadow-lg shadow-cyan-500/20 transition-all"
            >
              Finalizar Venda
            </button>
          </div>
        </div>
      </motion.div>

      {/* MODAL DE BUSCA */}
      <SearchSelectorModal 
        isOpen={isSearchSelectorOpen}
        onClose={() => setIsSearchSelectorOpen(false)}
        onSelect={(id) => {
          const item = saleTargetType === 'individual' 
            ? customers.find(c => c.id === id) 
            : (groups.find(g => g.id === id) as any);
          const name = item ? (item.name || '') : '';
          
          if (saleTargetType === 'individual') {
            setFormData(prev => ({ ...prev, customerId: id, customerName: name }));
          } else {
            setFormData(prev => ({ ...prev, groupId: id, groupName: name }));
          }
          setIsSearchSelectorOpen(false);
        }}
        items={saleTargetType === 'individual' 
          ? customers.map(c => ({ id: c.id, name: c.name, originalItem: c })) 
          : groups.map(g => ({ id: g.id, name: g.name, originalItem: g }))
        }
        title={saleTargetType === 'individual' ? 'Selecionar Cliente' : 'Selecionar Grupo'}
      />

      {/* MODAL DE AJUDA: MODELOS DE VENDA */}
      <AnimatePresence>
        {isModelHelpOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#1e293b] rounded-[32px] w-full max-w-4xl border border-gray-100 dark:border-slate-700/50 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1e293b] z-10">
                <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">Modelos de venda</h2>
                <button onClick={() => setIsModelHelpOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <p className="text-sm font-bold text-gray-400">Conheça os modelos de venda disponíveis e como cada um gera lançamentos financeiros.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CUSTOMIZADO */}
                  <div className="p-6 border border-gray-100 dark:border-slate-700/50 rounded-3xl space-y-4 hover:border-cyan-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 dark:text-gray-200">Customizado</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed">Nenhum lançamento é criado automaticamente. Os lançamentos financeiros devem ser feitos manualmente.</p>
                  </div>

                  {/* COMISSÃO DIRETA */}
                  <div className="p-6 border border-gray-100 dark:border-slate-700/50 rounded-3xl space-y-4 hover:border-cyan-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 dark:text-gray-200">Comissão direta</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed">O cliente paga diretamente o fornecedor ou consolidadora. A agência recebe apenas a comissão/lucro.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Receita (valor da comissão/lucro)</span>
                    </div>
                  </div>

                  {/* COMISSÃO COM REPASSE */}
                  <div className="p-6 border border-gray-100 dark:border-slate-700/50 rounded-3xl space-y-4 hover:border-cyan-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20">
                        <RefreshCw className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 dark:text-gray-200">Comissão com repasse</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed">O cliente paga a agência, e a agência repassa o valor total ao fornecedor.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Repasse de entrada (valor do cliente)</span>
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Repasse de saída (valor do fornecedor)</span>
                      <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Receita (valor da comissão/lucro)</span>
                    </div>
                  </div>

                  {/* REVENDA */}
                  <div className="p-6 border border-gray-100 dark:border-slate-700/50 rounded-3xl space-y-4 hover:border-cyan-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shadow-lg shadow-gray-500/20">
                        <ArrowLeftRight className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 dark:text-gray-200">Revenda</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed">O cliente paga a agência e a agência paga o fornecedor.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Receita (valor total)</span>
                      <span className="px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Despesa (fornecedor)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setIsModelHelpOpen(false)}
                  className="px-6 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
