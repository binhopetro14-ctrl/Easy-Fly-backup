'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Hotel, 
  Plane, 
  MapPin, 
  Calendar, 
  Coffee, 
  Info, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  ChevronRight, 
  Waves, 
  Dumbbell, 
  Car, 
  UtensilsCrossed, 
  Wine, 
  Wind, 
  Briefcase, 
  Users, 
  Tv, 
  Shield, 
  Baby, 
  LayoutGrid, 
  CigaretteOff, 
  Shirt, 
  Maximize2,
  ChevronLeft,
  Key,
  GlassWater,
  Navigation,
  Sparkles,
  Heart,
  Wifi,
  Leaf as Spa,
} from 'lucide-react';

// Cliente Supabase público (sem autenticação)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, supabaseKey);

interface SaleItem {
  type: 'flight' | 'hotel' | 'insurance' | 'car' | 'other';
  description?: string;
  hotelName?: string;
  hotelAddress?: string;
  hotelAmenities?: string[];
  hotelImages?: string[];
  hotelDescription?: string;
  checkIn?: string;
  checkOut?: string;
  checkInDate?: string;
  checkOutDate?: string;
  hasBreakfast?: boolean;
  passengerName?: string;
  vendor?: string;
  price?: number;
  flightNumber?: string;
  airline?: string;
  departure?: string;
  destination?: string;
  departureDate?: string;
  arrivalDate?: string;
  returnDate?: string;
  returnFlightNumber?: string;
}

interface Sale {
  id: string;
  client_name: string;
  total_price: number;
  status: string;
  items: SaleItem[];
  created_at: string;
  payment_method?: string;
  installments?: number;
}

function formatDate(dateString?: string) {
  if (!dateString) return 'Data não definida';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

function TypeIcon({ type }: { type: SaleItem['type'] }) {
  switch (type) {
    case 'flight': return <Plane className="w-5 h-5" />;
    case 'hotel': return <Hotel className="w-5 h-5" />;
    case 'car': return <Car className="w-5 h-5" />;
    default: return <Info className="w-5 h-5" />;
  }
}

function TypeLabel({ type }: { type: SaleItem['type'] }) {
  switch (type) {
    case 'flight': return 'Passagem Aérea';
    case 'hotel': return 'Hospedagem';
    case 'insurance': return 'Seguro Viagem';
    case 'car': return 'Locação de Veículo';
    default: return 'Outros Serviços';
  }
}

function TypeColor(type: SaleItem['type']) {
  switch (type) {
    case 'flight': return 'from-blue-500 to-indigo-600';
    case 'hotel': return 'from-[#19727d] to-[#0d5c66]';
    case 'car': return 'from-amber-500 to-orange-600';
    default: return 'from-slate-500 to-slate-600';
  }
}

function PriceDetails({ sale }: { sale: Sale }) {
  return (
    <div className="bg-[#19727d] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
      <div className="relative z-10">
        <p className="text-white/70 text-sm font-bold uppercase tracking-[0.2em] mb-2">Valor do Investimento</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold opacity-60">R$</span>
          <h2 className="text-5xl font-black tracking-tighter">
            {sale.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
        </div>
        
        {sale.payment_method && (
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-0.5">Forma de Pagamento</p>
                <p className="font-bold text-sm">{sale.payment_method}</p>
              </div>
            </div>
            
            {sale.installments && sale.installments > 1 && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-0.5">Parcelamento</p>
                  <p className="font-bold text-sm">{sale.installments}x de R$ {(sale.total_price / sale.installments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HotelGalleryThumbnail({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);

  const getUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=1200&h=800&fit=cover`;
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 group shadow-lg">
        {images[current] ? (
          <img 
            src={getUrl(images[current])} 
            alt={`${name} photo ${current + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Hotel className="w-12 h-12" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={() => setCurrent(prev => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-white/20 active:scale-95 z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCurrent(prev => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-white/20 active:scale-95 z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl text-[11px] font-black text-white/90 uppercase tracking-[0.1em] border border-white/10 flex items-center gap-2.5 z-20 shadow-lg">
          <Maximize2 className="w-3.5 h-3.5" /> 
          <span>{current + 1} / {images.length}</span>
        </div>
      </div>

      {images.length > 0 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {images.map((img, idx) => {
            const thumbUrl = getUrl(img);
            return (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all snap-start ${
                  idx === current ? 'border-[#19727d] rotate-0 scale-100 shadow-md ring-2 ring-[#19727d]/20' : 'border-transparent opacity-60 hover:opacity-100 scale-95 grayscale-[30%]'
                }`}
              >
                {thumbUrl ? (
                  <img 
                    src={thumbUrl} 
                    alt={`${name} thumb ${idx}`} 
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                    <Hotel className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HotelGallery({ images, name }: { images?: string[]; name: string }) {
  if (!images || images.length === 0) return null;
  return <HotelGalleryThumbnail images={images} name={name} />;
}

function HotelItem({ item }: { item: SaleItem }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="h-1.5 w-full bg-[#19727d]" />
      
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-row items-center justify-between gap-4 flex-nowrap overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#19727d] flex items-center justify-center text-white shadow-xl shadow-[#19727d]/20 shrink-0 transform group-hover:rotate-3 transition-transform duration-500">
              <Hotel className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#19727d] uppercase tracking-[0.3em] leading-none mb-1.5">Hospedagem</p>
              <h3 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">{item.hotelName || item.description || 'Nome do Hotel'}</h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
             <div className="flex bg-white border border-slate-100 rounded-xl p-2 gap-4 shadow-sm">
                <div className="text-center px-2.5">
                   <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1 tracking-tight">Check-in</p>
                   <p className="text-[13px] font-black text-[#19727d] leading-none">{formatDate(item.checkIn || item.checkInDate)}</p>
                </div>
                <div className="w-px bg-slate-100" />
                <div className="text-center px-2.5">
                   <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1 tracking-tight">Check-out</p>
                   <p className="text-[13px] font-black text-[#19727d] leading-none">{formatDate(item.checkOut || item.checkOutDate)}</p>
                </div>
             </div>

             {item.hasBreakfast && (
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm h-fit w-full justify-center">
                  <Coffee className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] font-black uppercase text-slate-700 tracking-tight whitespace-nowrap">Café da manhã</span>
               </div>
             )}
          </div>
        </div>

        {item.hotelImages && item.hotelImages.length > 0 && (
          <HotelGallery images={item.hotelImages} name={item.hotelName || ''} />
        )}

        {(() => {
          const AMENITY_MAP: Record<string, { label: string; icon: any }> = {
            'wifi': { label: 'Wi-Fi Grátis', icon: Wifi },
            'wi-fi': { label: 'Wi-Fi Grátis', icon: Wifi },
            'piscina': { label: 'Piscina', icon: Waves },
            'pool': { label: 'Piscina', icon: Waves },
            'academia': { label: 'Academia', icon: Dumbbell },
            'gym': { label: 'Academia', icon: Dumbbell },
            'fitness': { label: 'Academia', icon: Dumbbell },
            'estacionamento': { label: 'Estacionamento', icon: Car },
            'parking': { label: 'Estacionamento', icon: Car },
            'restaurante': { label: 'Restaurante', icon: UtensilsCrossed },
            'restaurant': { label: 'Restaurante', icon: UtensilsCrossed },
            'bar': { label: 'Bar & Drinks', icon: Wine },
            'café': { label: 'Café da Manhã', icon: Coffee },
            'breakfast': { label: 'Café da Manhã', icon: Coffee },
            'ar condicionado': { label: 'Ar Condicionado', icon: Wind },
            'ac': { label: 'Ar Condicionado', icon: Wind },
            'air conditioning': { label: 'Ar Condicionado', icon: Wind },
            'spa': { label: 'Spa Premium', icon: Spa },
            'sauna': { label: 'Sauna', icon: Wind },
            'praia': { label: 'Beira Mar', icon: MapPin },
            'serviço de quarto': { label: 'Serviço de Quarto', icon: Briefcase },
            'recepção': { label: 'Recepção 24h', icon: Key },
            'tv': { label: 'Smart TV', icon: Tv },
            'frigobar': { label: 'Frigobar', icon: GlassWater },
            'cofre': { label: 'Cofre', icon: Shield },
            'lavanderia': { label: 'Lavanderia', icon: Shirt },
            'kids': { label: 'Espaço Kids', icon: Baby },
            'elevador': { label: 'Elevador', icon: Navigation },
            'não fumante': { label: 'Não Fumante', icon: CigaretteOff },
            'business': { label: 'Business Center', icon: Briefcase },
            'reunião': { label: 'Sala de Reuniões', icon: Users },
            'eventos': { label: 'Eventos', icon: Sparkles },
            'turismo': { label: 'Balcão de Turismo', icon: MapPin },
            'serviços': { label: 'Serviços', icon: Sparkles },
            'instalações': { label: 'Instalações', icon: LayoutGrid },
            'quartos': { label: 'Acomodações', icon: Users },
          };

          const resolveAmenity = (amenity: string) => {
            const search = amenity.toLowerCase();
            const entry = Object.entries(AMENITY_MAP).find(([key]) => search.includes(key));
            if (entry) return entry[1];
            return { label: amenity, icon: CheckCircle2 };
          };

          const source = item.hotelAmenities || [];
          const features = source.map(resolveAmenity).slice(0, 16);

          if (features.length === 0) return null;

          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-500 border border-cyan-100/50 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                 </div>
                 <h3 className="text-base font-black text-slate-900 tracking-tight">O que este hotel oferece</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm hover:border-cyan-100 transition-all group/item cursor-default">
                    <div className="w-8 h-8 rounded-full bg-cyan-50/50 flex items-center justify-center shrink-0 group-hover/item:bg-cyan-50 transition-colors border border-cyan-100/20">
                      <f.icon className="w-3.5 h-3.5 text-cyan-600" />
                    </div>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight leading-tight group-hover/item:text-slate-900 line-clamp-1">
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {item.hotelDescription && (
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Sobre o Hotel</p>
             <p className="text-gray-600 text-[13px] leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">{item.hotelDescription}</p>
          </div>
        )}

        {item.passengerName && (
          <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest pt-3 border-t border-slate-100/50">
            <Users className="w-3.5 h-3.5" />
            Titular: {item.passengerName}
          </div>
        )}
      </div>
    </div>
  );
}

function OtherItem({ item }: { item: SaleItem }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`h-1.5 w-full bg-gradient-to-r ${TypeColor(item.type)}`} />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${TypeColor(item.type)} flex items-center justify-center text-white shadow-md`}>
              <TypeIcon type={item.type} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest"><TypeLabel type={item.type} /></p>
              {item.description && <p className="font-bold text-gray-700 text-sm">{item.description}</p>}
            </div>
          </div>
          {item.vendor && (
            <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[11px] font-bold border border-gray-100">{item.vendor}</span>
          )}
        </div>
        {item.passengerName && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 border-t border-gray-50 pt-2">
            <Users className="w-3.5 h-3.5" />
            {item.passengerName}
          </div>
        )}
      </div>
    </div>
  );
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

function Header({ sale }: { sale: Sale }) {
  return (
    <header className="mb-12">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-3xl font-black text-[#19727d] tracking-tighter flex items-center gap-2 italic">
          EASY FLY <span className="text-slate-300 font-light">TURISMO</span>
        </h1>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-4">Proposta Especial para</p>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{sale.client_name}</h2>
        <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest pt-4">
          <Calendar className="w-3 h-3" />
          Emitido em {formatDate(sale.created_at)}
        </div>
      </div>
    </header>
  );
}

export default function BudgetPage() {
  const { id } = useParams();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSale() {
      if (!id) return;
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setSale(data);
      setLoading(false);
    }
    fetchSale();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#19727d]/20 border-t-[#19727d] rounded-full animate-spin" />
          <p className="text-sm font-black text-[#19727d] uppercase tracking-widest animate-pulse">Carregando Proposta...</p>
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md border border-slate-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 shadow-inner">
            <Info className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Proposta não encontrada</h2>
          <p className="text-slate-500 text-sm mb-8">O link pode ter expirado ou a proposta foi removida do sistema.</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#19727d] text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95">Tentar Novamente</button>
        </div>
      </div>
    );
  }

  const flights = sale.items?.filter(i => i.type === 'flight') || [];
  const hotels = sale.items?.filter(i => i.type === 'hotel') || [];
  const others = sale.items?.filter(i => i.type !== 'flight' && i.type !== 'hotel') || [];

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:py-20 no-scrollbar">
      <div className="max-w-4xl mx-auto">
        <Header sale={sale} />
        
        <div className="space-y-12">
          {hotels.length > 0 && (
            <section>
              <SectionTitle icon={<Hotel className="w-4 h-4" />} title="Hospedagem" />
              <div className="space-y-6">
                {hotels.map((hotel, idx) => <HotelItem key={idx} item={hotel} />)}
              </div>
            </section>
          )}

          {flights.length > 0 && (
            <section>
              <SectionTitle icon={<Plane className="w-4 h-4" />} title="Passagens Aéreas" />
              <div className="space-y-4">
                {flights.map((flight, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="h-1.5 w-full bg-blue-500" />
                    <div className="p-6">
                       {/* Simplified Flight Render for Brevity */}
                       <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                <Plane className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1.5">Voo {flight.flightNumber}</p>
                                <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-tight">{flight.departure} → {flight.destination}</h3>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Embarque</p>
                             <p className="font-black text-lg text-[#19727d]">{formatDate(flight.departureDate)}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section>
              <SectionTitle icon={<CheckCircle2 className="w-4 h-4" />} title="Serviços Adicionais" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {others.map((other, idx) => <OtherItem key={idx} item={other} />)}
              </div>
            </section>
          )}

          <PriceDetails sale={sale} />
          
          <footer className="text-center space-y-6 pt-12">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Easy Fly Turismo - Todos os direitos reservados</p>
            <div className="w-12 h-1.5 bg-slate-200 mx-auto rounded-full" />
          </footer>
        </div>
      </div>
    </main>
  );
}
