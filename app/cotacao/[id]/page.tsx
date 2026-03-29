'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import {
  Plane, Hotel, Shield, Car, Package, Calendar, Users, Baby, Briefcase,
  Phone, MessageCircle, CheckCircle, Clock, CreditCard, Star, ArrowRight,
  Coffee, MapPin, Tag, ChevronDown, ChevronUp, Info, Map
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const AGENCY = {
  name: 'Easy Fly Agência de Viagens',
  legalName: 'EASY FLY AGENCIA DE VIAGENS LTDA',
  cnpj: '45.480.207/0001-49',
  phone: '+55 (87) 9.9952-5083',
  whatsapp: '5587999525083',
  logoUrl: '/logo2.png',
};

const INSTALLMENTS = [1, 2, 3, 4, 6, 10, 12];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  try {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  } catch { return dateStr; }
};

type ItemType = 'passagem' | 'hospedagem' | 'seguro' | 'carro' | 'adicionais';

interface LeadItem {
  id: string;
  type: ItemType;
  flightType?: 'ida' | 'ida_volta';
  origin?: string;
  destination?: string;
  departureDate?: string;
  departureTime?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  returnDate?: string;
  returnTime?: string;
  returnArrivalDate?: string;
  returnArrivalTime?: string;
  flightNumber?: string;
  returnFlightNumber?: string;
  airline?: string;
  duration?: string;
  locator?: string;
  purchaseNumber?: string;
  flightClass?: string;
  connections?: string;
  checkinNotif?: string;
  personalItem?: number;
  carryOn?: number;
  checkedBag23kg?: number;
  outboundSegments?: any[];
  inboundSegments?: any[];
  returnDuration?: string;
  hotelName?: string;
  hotelAddress?: string;
  checkInDate?: string;
  checkOutDate?: string;
  value?: number;
  description?: string;
  vendor?: string;
}

interface Lead {
  id: string;
  title?: string;
  name: string;
  value: number;
  status: string;
  items?: LeadItem[];
  tags?: string[];
  duration?: string;
  adults?: number;
  children?: number;
  babies?: number;
  luggage23kg?: number;
  emissor?: string;
  notes?: string;
  phone?: string;
}

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'passagem': return <Plane className="w-5 h-5" />;
    case 'hospedagem': return <Hotel className="w-5 h-5" />;
    case 'seguro': return <Shield className="w-5 h-5" />;
    case 'carro': return <Car className="w-5 h-5" />;
    default: return <Package className="w-5 h-5" />;
  }
}

function TypeGradient(type: string) {
  switch (type) {
    case 'passagem': return 'from-blue-500 to-cyan-500';
    case 'hospedagem': return 'from-purple-500 to-pink-500';
    case 'seguro': return 'from-green-500 to-emerald-500';
    case 'carro': return 'from-orange-500 to-amber-500';
    default: return 'from-gray-500 to-slate-500';
  }
}

function TypeLabel({ type }: { type: string }) {
  const map: Record<string, string> = {
    passagem: 'Passagem Aérea', hospedagem: 'Hospedagem',
    seguro: 'Seguro Viagem', carro: 'Aluguel de Carro', adicionais: 'Adicionais'
  };
  return <>{map[type] || type}</>;
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-[#19727d]/10 rounded-xl flex items-center justify-center text-[#19727d]">
        {icon}
      </div>
      <h2 className="text-lg font-black text-gray-800 tracking-tight">{title}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
    </div>
  );
}

function MainTravelMap({ lead, flights }: { lead: Lead; flights: LeadItem[] }) {
  if (flights.length === 0) return null;
  const firstFlight = flights[0];
  const outbound = firstFlight.outboundSegments || [];
  const inbound = firstFlight.inboundSegments || [];
  const isIdaVolta = firstFlight.flightType === 'ida_volta';

  const firstOrigin = outbound[0]?.origin || '---';
  const lastDest = outbound[outbound.length - 1]?.destination || '---';

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 mb-12 group/map bg-[#f8f9fa]">
      {/* Light Clean Map Background */}
      <div className="absolute inset-0 opacity-80 mix-blend-multiply">
         <img 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1600" 
            alt="Clean Light Map" 
            className="w-full h-full object-cover" 
         />
         <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/60" />
      </div>

      {/* Trajectory Layers */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
        <defs>
          <filter id="routeGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Ida Path - Purple Curved Dash */}
        <path 
          fill="none" 
          stroke="#8b5cf6" 
          strokeWidth="3" 
          strokeDasharray="8,6"
          filter="url(#routeGlow)"
          style={{ d: "path('M 22% 55% Q 50% 12% 78% 50%')" }}
        />

        {/* Volta Path - Subtle gray dash */}
        {isIdaVolta && (
          <path 
            fill="none" 
            stroke="#94a3b8" 
            strokeWidth="2" 
            strokeDasharray="6,8"
            opacity="0.4"
            style={{ d: "path('M 78% 50% Q 50% 88% 22% 55%')" }}
          />
        )}
      </svg>

      {/* Location Indicators */}
      <div className="absolute inset-0 z-20 pointer-events-none">
         {/* Origin Pin */}
         <div className="absolute top-[55%] left-[22%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-5 h-5 bg-purple-600 border-[3px] border-white rounded-full shadow-xl" />
         </div>
         
         {/* Destination Pin */}
         <div className="absolute top-[50%] left-[78%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-5 h-5 bg-purple-600 border-[3px] border-white rounded-full shadow-xl" />
         </div>
      </div>

      {/* Legend & Note */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3">
         <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-6 h-0.5 bg-purple-500 border-b-2 border-dashed border-purple-500" />
               <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Ida</span>
            </div>
            {isIdaVolta && (
              <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                 <div className="w-6 h-0.5 bg-slate-300 border-b-2 border-dashed border-slate-300" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Volta</span>
              </div>
            )}
         </div>
         <p className="text-[9px] text-slate-400 font-bold italic max-w-xs text-right bg-white/50 px-2 py-1 rounded-md backdrop-blur-sm">
            *As linhas do trajeto entre os aeroportos exibidas neste mapa podem não representar exatamente o trajeto que a aeronave executará.
         </p>
      </div>

      {/* Zoom Controls Mockup */}
      <div className="absolute top-6 left-6 flex flex-col gap-px bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden">
         <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold">+</button>
         <div className="h-px bg-slate-200" />
         <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold">−</button>
      </div>
    </div>
  );
}

function FlightLegCard({ 
  segments, 
  type, 
  lead, 
  itemDuration 
}: { 
  segments: any[]; 
  type: 'Ida' | 'Volta'; 
  lead: Lead; 
  itemDuration?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fmt = (t?: string) => {
    if (!t) return null;
    const [h, m] = t.split(':');
    return `${h}h${m}`;
  };

  if (!segments || segments.length === 0) return null;

  const firstSeg = segments[0];
  const lastSeg = segments[segments.length - 1];
  const hasConnections = segments.length > 1;

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 group mb-8">
      <div className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${type === 'Ida' ? 'bg-cyan-50' : 'bg-purple-50'} rounded-2xl flex items-center justify-center`}>
                 <Plane className={`w-5 h-5 ${type === 'Ida' ? 'text-cyan-600' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Voo de {type}</h3>
                {firstSeg && <p className="text-xs font-bold text-slate-400">{formatDate(firstSeg.departureDate)}</p>}
              </div>
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-cyan-50 text-slate-500 hover:text-cyan-600 rounded-xl text-xs font-black transition-all border border-transparent hover:border-cyan-100"
            >
              {isExpanded ? 'Menos detalhes' : 'Mais detalhes'}
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Main Visual Route Row */}
          <div className="flex items-center justify-between mt-8 mb-4 px-2">
            <div className="text-left">
              <p className="text-3xl font-black text-slate-900 leading-none">{firstSeg?.departureTime ? fmt(firstSeg.departureTime) : '--:--'}</p>
              <p className="text-xs font-black text-slate-400 uppercase mt-1">{firstSeg?.origin || '---'}</p>
            </div>

            <div className="flex-1 flex flex-col items-center relative px-6 group">
               <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 flex items-center justify-around">
                  <div className="w-2 h-2 rounded-full border-2 border-slate-300 bg-white" />
                  {hasConnections && <div className={`w-2 h-2 rounded-full ${type === 'Ida' ? 'bg-cyan-400 shadow-cyan-400/50' : 'bg-purple-400 shadow-purple-400/50'} shadow-sm`} />}
                  <div className="w-2 h-2 rounded-full border-2 border-slate-300 bg-white" />
               </div>
               <span className="relative z-10 text-[10px] font-black uppercase text-slate-400 bg-white px-3 py-1 border border-slate-100 rounded-full tracking-widest">{hasConnections ? 'Com Conexão' : 'Voo Direto'}</span>
            </div>

            <div className="text-right">
              <p className="text-3xl font-black text-slate-900 leading-none">{lastSeg?.arrivalTime ? fmt(lastSeg.arrivalTime) : '--:--'}</p>
              <p className="text-xs font-black text-slate-400 uppercase mt-1">{lastSeg?.destination || '---'}</p>
            </div>
          </div>
        </div>

        {/* Expanded Details Section */}
        {isExpanded && (
          <div className="p-6 pt-2 border-t border-slate-50 bg-slate-50/30 animate-in gap-y-6 flex flex-col duration-300">
             <div className="space-y-6 flex flex-col items-stretch">
              {segments.map((seg, sidx) => (
                <div key={sidx} className="flex gap-6 items-start relative pb-2 group">
                  {sidx < segments.length - 1 && (
                    <div className="absolute left-10 top-12 bottom-0 w-1 border-l-2 border-dashed border-slate-200" />
                  )}
                  
                  <div className="flex flex-col items-center gap-1 w-20 flex-shrink-0">
                     <p className="text-xs text-slate-400 font-bold uppercase">{formatDate(seg.departureDate)}</p>
                     <p className="text-xl font-black text-slate-900">{fmt(seg.departureTime) || '--:--'}</p>
                     <p className={`text-sm font-black ${type === 'Ida' ? 'text-cyan-600' : 'text-purple-600'}`}>{seg.origin}</p>
                  </div>

                  <div className="flex-1 space-y-4">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-lg group-hover:border-cyan-100 transition-all">
                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black px-2 py-0.5 ${type === 'Ida' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'} rounded-md border uppercase tracking-tighter`}>{seg.airline || 'Cia Aérea'}</span>
                              <span className="text-xs font-black text-slate-400 font-mono tracking-tighter">{seg.flightNumber || '---'}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-300" />
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Duração: {seg.duration || '--'}</span>
                           </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-right justify-end">
                           <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-1">Classe</p>
                              <span className="px-3 py-1.5 bg-slate-50 text-slate-700 text-[11px] font-black rounded-xl border border-slate-100">{seg.flightClass || 'Econômica'}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 w-20 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                     <p className="text-xs text-slate-400 font-bold uppercase">{seg.arrivalDate ? formatDate(seg.arrivalDate) : formatDate(seg.departureDate)}</p>
                     <p className="text-xl font-black text-slate-900">{fmt(seg.arrivalTime) || '--:--'}</p>
                     <p className="text-sm font-black text-slate-400 uppercase">{seg.destination}</p>
                  </div>
                </div>
              ))}
             </div>

             {/* Final Baggage Row in Expanded View */}
             <div className="bg-white rounded-[20px] p-5 border border-slate-200 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                   <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Bagagem Incluída</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">Por passageiro adulto</p>
                </div>
                <div className="flex flex-wrap gap-4">
                   {[
                     { label: 'Item Pessoal', val: segments[0]?.personalItem, icon: '🎒' },
                     { label: 'Mala de Mão', val: segments[0]?.carryOn, icon: '💼' },
                     { label: 'Despachada 23kg', val: segments[0]?.checkedBag23kg, icon: '🧳' }
                   ].map(b => (
                     <div key={b.label} className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                       <span className="text-xl">{b.icon}</span>
                       <div className="text-left">
                          <p className="text-[9px] text-slate-400 font-black uppercase leading-none mb-0.5">{b.label}</p>
                          <p className="text-xs font-black text-slate-800 leading-none">{b.val || (b.label === 'Mala de Mão' || b.label === 'Item Pessoal' ? 1 : 0)}x Incluso</p>
                       </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FlightItemCard({ item, lead }: { item: LeadItem; lead: Lead }) {
  const outbound = item.outboundSegments || [];
  const inbound = item.inboundSegments || [];

  return (
    <div className="space-y-6">
       {outbound.length > 0 && (
         <FlightLegCard 
            segments={outbound} 
            type="Ida" 
            lead={lead} 
            itemDuration={item.duration} 
         />
       )}
       {item.flightType === 'ida_volta' && inbound.length > 0 && (
         <FlightLegCard 
            segments={inbound} 
            type="Volta" 
            lead={lead} 
            itemDuration={item.returnDuration} 
         />
       )}
       
       {/* Price display if any */}
       {item.value && item.value > 0 && (
         <div className="flex justify-end p-2">
            <div className="flex items-center gap-3 bg-cyan-600 text-white px-6 py-2 rounded-2xl shadow-lg">
               <span className="text-xs font-black uppercase tracking-widest">Valor do Trecho</span>
               <span className="text-xl font-black">{formatCurrency(item.value)}</span>
            </div>
         </div>
       )}
    </div>
  );
}

function HotelItemCard({ item }: { item: LeadItem }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`h-1.5 w-full bg-gradient-to-r ${TypeGradient(item.type)}`} />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${TypeGradient(item.type)} flex items-center justify-center text-white shadow-md`}>
              <TypeIcon type={item.type} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest"><TypeLabel type={item.type} /></p>
              {item.hotelName && <p className="font-black text-gray-800">{item.hotelName}</p>}
            </div>
          </div>
          {item.value && item.value > 0 && (
            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-black border border-purple-100">
              {formatCurrency(item.value)}
            </span>
          )}
        </div>

        {item.hotelAddress && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {item.hotelAddress}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {item.checkInDate && (
            <div className="flex items-center gap-2 bg-purple-50 rounded-xl p-3">
              <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-purple-400 font-bold uppercase">Check-in</p>
                <p className="text-sm font-black text-gray-700">{formatDate(item.checkInDate)}</p>
              </div>
            </div>
          )}
          {item.checkOutDate && (
            <div className="flex items-center gap-2 bg-pink-50 rounded-xl p-3">
              <Calendar className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-pink-400 font-bold uppercase">Check-out</p>
                <p className="text-sm font-black text-gray-700">{formatDate(item.checkOutDate)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OtherItemCard({ item }: { item: LeadItem }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`h-1.5 w-full bg-gradient-to-r ${TypeGradient(item.type)}`} />
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${TypeGradient(item.type)} flex items-center justify-center text-white shadow-md`}>
            <TypeIcon type={item.type} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest"><TypeLabel type={item.type} /></p>
            {item.description && <p className="font-bold text-gray-700 text-sm">{item.description}</p>}
          </div>
        </div>
        {item.value && item.value > 0 && (
          <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm font-black border border-gray-100">
            {formatCurrency(item.value)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function CotacaoPage() {
  const params = useParams();
  const id = params?.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
      if (error || !data) { setNotFound(true); return; }
      setLead({
        id: data.id,
        title: data.title || '',
        name: data.name || 'Cliente',
        value: parseFloat(data.value || '0'),
        status: data.status,
        items: data.items || [],
        tags: data.tags || [],
        duration: data.duration || '',
        adults: data.adults || 0,
        children: data.children || 0,
        babies: data.babies || 0,
        luggage23kg: data.luggage23kg || 0,
        emissor: data.emissor || '',
        notes: data.notes || '',
        phone: data.phone || '',
      });
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#19727d]/5 to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto animate-pulse">
            <img src={AGENCY.logoUrl} alt="Easy Fly" className="w-10 h-10 object-contain" />
          </div>
          <div className="space-y-1">
            <p className="font-black text-[#19727d] text-xl">Easy Fly</p>
            <p className="text-gray-400 text-sm font-medium">Carregando sua cotação...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !lead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#19727d]/5 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center mx-auto">
            <img src={AGENCY.logoUrl} alt="Easy Fly" className="w-12 h-12 object-contain" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-800">Cotação não encontrada</h1>
            <p className="text-gray-500 text-sm leading-relaxed">Este link pode ter expirado ou ser inválido. Entre em contato com a agência.</p>
          </div>
          <a href={`https://wa.me/${AGENCY.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all">
            <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const flights = (lead.items || []).filter(i => i.type === 'passagem');
  const hotels = (lead.items || []).filter(i => i.type === 'hospedagem');
  const others = (lead.items || []).filter(i => !['passagem', 'hospedagem'].includes(i.type));
  const whatsappMsg = encodeURIComponent(`Olá! Vi a cotação "${lead.title || lead.name}" enviada pela Easy Fly e gostaria de mais informações.`);

  const calculateDuration = () => {
    const flight = flights[0];
    if (!flight) return lead.duration ? `${lead.duration} dias` : null;
    if (flight.flightType === 'ida') return 'Somente Ida';
    
    const outbound = flight.outboundSegments || [];
    const inbound = flight.inboundSegments || [];
    
    // Pegar primeira data de partida e última data de volta (ou chegada)
    const startStr = outbound[0]?.departureDate;
    const endStr = inbound[inbound.length - 1]?.arrivalDate || inbound[inbound.length - 1]?.departureDate;
    
    if (!startStr || !endStr) return lead.duration ? `${lead.duration} dias` : null;

    const parse = (s: string) => {
      if (s.includes('/')) {
        const [d, m, y] = s.split('/');
        return new Date(Number(y), Number(m) - 1, Number(d));
      }
      return new Date(s);
    };

    try {
      const start = parse(startStr);
      const end = parse(endStr);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? `${diffDays} dias` : lead.duration ? `${lead.duration} dias` : null;
    } catch {
      return lead.duration ? `${lead.duration} dias` : null;
    }
  };

  const tripDuration = calculateDuration();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 font-sans">

      {/* HERO HEADER */}
      <header className="bg-gradient-to-br from-[#19727d] via-[#1a8090] to-[#0d5c66] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {/* Logo e Consultor na mesma linha */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl flex-shrink-0 p-2 transform hover:scale-105 transition-transform">
                <img src={AGENCY.logoUrl} alt="Easy Fly" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-black text-white text-2xl leading-tight tracking-tight">Easy Fly</p>
                <p className="text-white/70 text-xs uppercase tracking-[0.3em] font-bold">Agência de Viagens</p>
              </div>
            </div>

            {lead.emissor && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
                  <Briefcase className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest leading-none mb-1">Consultor</p>
                  <p className="text-sm font-black text-white leading-none">{lead.emissor}</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center space-y-5">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 backdrop-blur-xl px-10 py-4 rounded-full text-xl font-black text-white border-2 border-white/20 shadow-2xl shadow-black/20 transform hover:scale-105 transition-all duration-500">
              <CheckCircle className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="tracking-tight">Proposta de Viagem</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-[1.05] max-w-3xl mx-auto drop-shadow-sm">
              {lead.title || 'Sua Próxima Aventura'}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-3 bg-white/10 px-6 py-2.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
                <Users className="w-5 h-5 text-cyan-300" />
                <div className="text-left">
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest leading-none mb-1">Passageiros</p>
                  <p className="text-sm font-black text-white leading-none">
                    {lead.name} 
                    <span className="ml-2 text-cyan-300/80 font-bold border-l border-white/20 pl-2">
                      {(lead.adults || 0) > 0 && `${lead.adults} Adulto${(lead.adults || 0) > 1 ? 's' : ''}`}
                      {(lead.children || 0) > 0 && ` ${(lead.children || 0)} Criança${(lead.children || 0) > 1 ? 's' : ''}`}
                      {(lead.babies || 0) > 0 && ` ${(lead.babies || 0)} Bebê${(lead.babies || 0) > 1 ? 's' : ''}`}
                    </span>
                  </p>
                </div>
              </div>

              {tripDuration && (
                <div className="flex items-center gap-3 bg-white/10 px-6 py-2.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
                  <Clock className="w-5 h-5 text-cyan-300" />
                  <div className="text-left">
                    <p className="text-[10px] text-white/50 font-black uppercase tracking-widest leading-none mb-1">Duração</p>
                    <p className="text-sm font-black text-white leading-none">{tripDuration}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {flights.length > 0 && (
          <section>
            <SectionTitle icon={<Plane className="w-4 h-4" />} title="Opções de Voos" />
            
            {/* Mapa Consolidado da Rota Real */}
            <MainTravelMap lead={lead} flights={flights} />

            <div className="space-y-4">
              {flights.map(item => <FlightItemCard key={item.id} item={item} lead={lead} />)}
            </div>
          </section>
        )}

        {hotels.length > 0 && (
          <section>
            <SectionTitle icon={<Hotel className="w-4 h-4" />} title="Hospedagem" />
            <div className="space-y-4">
              {hotels.map(item => <HotelItemCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section>
            <SectionTitle icon={<Package className="w-4 h-4" />} title="Outros Serviços" />
            <div className="space-y-4">
              {others.map(item => <OtherItemCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {/* VALORES */}
        {lead.value > 0 && (
          <section>
            <SectionTitle icon={<CreditCard className="w-4 h-4" />} title="Valores & Pagamento" />
            <div className="bg-gradient-to-br from-[#19727d] to-[#0d5c66] rounded-2xl p-6 text-white shadow-xl shadow-[#19727d]/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/70 text-sm font-bold uppercase tracking-widest">Total da Viagem</p>
                  <p className="text-4xl font-black tracking-tight mt-1">{formatCurrency(lead.value)}</p>
                </div>
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Simulação de parcelamento</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INSTALLMENTS.map(n => (
                    <div key={n} className="bg-white/10 rounded-xl p-2.5 text-center hover:bg-white/20 transition-colors">
                      <p className="text-[11px] text-white/60 font-bold">{n}x de</p>
                      <p className="text-sm font-black text-white">{formatCurrency(lead.value / n)}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/40 text-[10px] mt-2 text-center">* Valores sem juros. Consulte condições com a agência.</p>
              </div>
            </div>
          </section>
        )}

        {lead.notes && (
          <section>
            <SectionTitle icon={<Package className="w-4 h-4" />} title="Observações" />
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-gray-700 text-sm leading-relaxed font-medium">{lead.notes}</p>
            </div>
          </section>
        )}

        {/* CTA WHATSAPP */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-black text-gray-800 text-lg">Gostou? Vamos confirmar sua viagem!</p>
            <p className="text-gray-500 text-sm mt-1">Fale diretamente com nosso consultor pelo WhatsApp.</p>
          </div>
          <a href={`https://wa.me/${AGENCY.whatsapp}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white rounded-2xl font-black shadow-xl shadow-green-500/30 hover:bg-green-600 active:scale-95 transition-all">
            <MessageCircle className="w-5 h-5" /> Confirmar no WhatsApp <ArrowRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#19727d]/10 flex items-center justify-center p-1">
                <img src={AGENCY.logoUrl} alt="Easy Fly" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-black text-[#19727d] text-base leading-tight">Easy Fly</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Agência de Viagens</p>
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Phone className="w-3.5 h-3.5 text-[#19727d]" />
                <span className="font-bold">{AGENCY.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                <a href={`https://wa.me/${AGENCY.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="font-bold hover:text-green-600 transition-colors">WhatsApp</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-50 mt-6 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-[11px] text-gray-400 font-bold">{AGENCY.legalName}</p>
            <p className="text-[11px] text-gray-400">CNPJ {AGENCY.cnpj}</p>
          </div>
          <p className="text-center text-[10px] text-gray-300 mt-4 font-medium">
            Esta cotação é válida por 72 horas a partir da data de emissão. • Easy Fly © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
