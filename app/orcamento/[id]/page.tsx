'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import {
  Plane,
  Hotel,
  Shield,
  Car,
  Package,
  MapPin,
  Calendar,
  Users,
  Baby,
  Briefcase,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  Coffee,
  CreditCard,
  Star,
  Trash2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

// Cliente Supabase público (sem autenticação)
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

type ItemType = 'passagem' | 'hospedagem' | 'seguro' | 'aluguel' | 'adicionais';

interface SaleItem {
  id: string;
  type: ItemType;
  flightType?: 'ida' | 'ida_volta';
  adults?: number;
  children?: number;
  babies?: number;
  bags23kg?: number;
  valuePaidByCustomer: number;
  vendor?: string;
  origin?: string;
  destination?: string;
  locator?: string;
  emissionDate?: string;
  departureDate?: string;
  returnDate?: string;
  checkIn?: string;
  checkInTime?: string;
  checkOut?: string;
  checkOutTime?: string;
  checkInDate?: string;
  checkOutDate?: string;
  hasBreakfast?: boolean;
  hotelName?: string;
  description?: string;
  passengerName?: string;
  hotelAmenities?: string[];
  hotelDescription?: string;
  hotelImages?: string[];
}

interface Sale {
  id: string;
  orderNumber: number;
  saleDate: string;
  customerName: string;
  groupName?: string;
  items: SaleItem[];
  totalValue: number;
  paymentMethod: string;
  notes?: string;
  emissor?: string;
  productName?: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (dateStr?: string) => {
  if (!dateStr || dateStr.includes('_')) return '—';
  try {
    // Normalizar formatos (ISO YYYY-MM-DD ou DD/MM/YYYY)
    if (dateStr.includes('-')) {
      const parts = dateStr.split('T')[0].split('-');
      if (parts[0].length === 4) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }
    if (dateStr.includes('/')) return dateStr;
    return dateStr;
  } catch { return dateStr || '—'; }
};

const INSTALLMENTS = [1, 2, 3, 4, 6, 10, 12];

function TypeIcon({ type, size = 20 }: { type: ItemType; size?: number }) {
  const cls = `w-${size === 20 ? 5 : 4} h-${size === 20 ? 5 : 4}`;
  switch (type) {
    case 'passagem': return <Plane className={cls} />;
    case 'hospedagem': return <Hotel className={cls} />;
    case 'seguro': return <Shield className={cls} />;
    case 'aluguel': return <Car className={cls} />;
    default: return <Package className={cls} />;
  }
}

function TypeLabel({ type }: { type: ItemType }) {
  const labels: Record<ItemType, string> = {
    passagem: 'Passagem Aérea',
    hospedagem: 'Hospedagem',
    seguro: 'Seguro Viagem',
    aluguel: 'Aluguel de Carro',
    adicionais: 'Adicionais',
  };
  return <>{labels[type] || type}</>;
}

function TypeColor(type: ItemType) {
  const colors: Record<ItemType, string> = {
    passagem: 'from-blue-500 to-cyan-500',
    hospedagem: 'from-purple-500 to-pink-500',
    seguro: 'from-green-500 to-emerald-500',
    aluguel: 'from-orange-500 to-amber-500',
    adicionais: 'from-gray-500 to-slate-500',
  };
  return colors[type] || 'from-gray-400 to-gray-500';
}

function FlightItem({ item }: { item: SaleItem }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`h-1.5 w-full bg-gradient-to-r ${TypeColor(item.type)}`} />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${TypeColor(item.type)} flex items-center justify-center text-white shadow-md`}>
              <TypeIcon type={item.type} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest"><TypeLabel type={item.type} /></p>
              {item.flightType && (
                <p className="text-xs text-blue-500 font-bold">{item.flightType === 'ida' ? '✈ Somente Ida' : '⇄ Ida e Volta'}</p>
              )}
            </div>
          </div>
          {item.vendor && (
            <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[11px] font-bold border border-gray-100">{item.vendor}</span>
          )}
        </div>

        {/* Rota */}
        {(item.origin || item.destination) && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
            <div className="text-center">
              <p className="text-2xl font-black text-gray-800">{item.origin || '—'}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Origem</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-center w-full gap-1">
                <div className="h-px flex-1 border-t-2 border-dashed border-blue-300" />
                <Plane className="w-4 h-4 text-blue-400 rotate-0" />
                <div className="h-px flex-1 border-t-2 border-dashed border-blue-300" />
              </div>
              <p className="text-[10px] text-blue-400 font-bold">VOO DIRETO</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-gray-800">{item.destination || '—'}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Destino</p>
            </div>
          </div>
        )}

        {/* Datas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {item.departureDate && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Embarque</p>
                <p className="text-sm font-black text-gray-700">{formatDate(item.departureDate)}</p>
              </div>
            </div>
          )}
          {item.returnDate && item.flightType === 'ida_volta' && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Retorno</p>
                <p className="text-sm font-black text-gray-700">{formatDate(item.returnDate)}</p>
              </div>
            </div>
          )}
          {item.locator && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Localizador</p>
                <p className="text-sm font-black text-gray-700 font-mono">{item.locator}</p>
              </div>
            </div>
          )}
        </div>

        {/* Passageiros */}
        {(item.adults || item.children || item.babies || item.bags23kg) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {!!item.adults && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                {item.adults} Adulto{item.adults > 1 ? 's' : ''}
              </div>
            )}
            {!!item.children && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                {item.children} Criança{item.children > 1 ? 's' : ''}
              </div>
            )}
            {!!item.babies && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-full text-xs font-bold">
                <Baby className="w-3.5 h-3.5" />
                {item.babies} Bebê{item.babies > 1 ? 's' : ''}
              </div>
            )}
            {!!item.bags23kg && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                <Briefcase className="w-3.5 h-3.5" />
                {item.bags23kg} Mala{item.bags23kg > 1 ? 's' : ''} 23kg
              </div>
            )}
          </div>
        )}

        {item.passengerName && (
          <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-50 pt-3">
            <Users className="w-3.5 h-3.5" />
            <span className="font-bold">{item.passengerName}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HotelItem({ item }: { item: SaleItem }) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr || typeof dateStr !== 'string') return '';
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch { return dateStr; }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
      {/* Decorative top bar */}
      <div className="h-1.5 w-full bg-[#19727d]" />
      
      <div className="p-6 space-y-5">
        {/* HEADER: Ícone + Nome do hotel + Datas e Café da Manhã */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#19727d]/10 flex items-center justify-center text-[#19727d] flex-shrink-0">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-[#19727d] uppercase tracking-[0.25em] leading-none mb-1">Hospedagem</p>
              <h3 className="font-black text-xl text-slate-900 tracking-tight leading-tight">{item.hotelName || item.description || 'Nome do Hotel'}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* ALIMENTAÇÃO - Estilo Sincronizado e Moderno */}
            {(() => {
              const showBreakfast = item.hasBreakfast || 
                                   item.description?.toLowerCase().includes('café') || 
                                   item.hotelDescription?.toLowerCase().includes('café');
              
              if (!showBreakfast) return null;

              return (
                <div className="flex items-center gap-3 py-2 px-5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all hover:bg-white/60 h-[80px] justify-center min-w-[110px]">
                  <div className="flex flex-col items-center text-center">
                    <span className="text-xl mb-1 leading-none">☕</span>
                    <p className="text-[9px] font-black uppercase tracking-tight text-slate-800 leading-tight">Café da manhã</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Incluso</p>
                  </div>
                </div>
              );
            })()}

            {/* DATAS COMPACTAS (Sistema de Alta Resiliência) */}
            {(() => {
              // Procura por data em qualquer campo possível para evitar erros de persistência
              const rawCheckIn = item.checkIn || item.checkInDate || (item as any).check_in || (item as any).checkin_date;
              const rawCheckOut = item.checkOut || item.checkOutDate || (item as any).check_out || (item as any).checkout_date;
              
              return (
                <div className="flex items-center gap-5 bg-white/40 backdrop-blur-xl p-4 rounded-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all hover:bg-white/60 h-[80px]">
                  <div className="text-center border-r border-slate-200/50 pr-5 h-full flex flex-col justify-center min-w-[90px]">
                    <p className="text-[7px] font-black text-[#19727d] uppercase tracking-wider mb-1 opacity-80">Check-in</p>
                    <div className="flex flex-col items-center">
                      <p className="text-[11px] font-black text-slate-800 leading-none mb-1.5 tracking-tight">
                        {rawCheckIn ? formatDate(rawCheckIn) : "__/__/____"}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#19727d]/10 flex items-center justify-center">
                          <Clock className="w-2 h-2 text-[#19727d]" />
                        </div>
                        <p className="text-[9px] font-bold text-slate-500">
                          {item.checkInTime || '14:00'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center h-full flex flex-col justify-center pl-1 min-w-[90px]">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-1 opacity-80">Check-out</p>
                    <div className="flex flex-col items-center">
                      <p className="text-[11px] font-black text-slate-800 leading-none mb-1.5 tracking-tight">
                        {rawCheckOut ? formatDate(rawCheckOut) : "__/__/____"}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-slate-100 flex items-center justify-center">
                          <Clock className="w-2 h-2 text-slate-400" />
                        </div>
                        <p className="text-[9px] font-bold text-slate-500">
                          {item.checkOutTime || '12:00'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* COMODIDADES */}
        {item.hotelAmenities && item.hotelAmenities.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-50 mt-4">
            {item.hotelAmenities.slice(0, 8).map((amenity, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#19727d]/5 text-[#19727d] rounded-xl text-[10px] font-bold uppercase tracking-tight">
                <div className="w-1 h-1 rounded-full bg-[#19727d]/40" />
                {amenity}
              </div>
            ))}
          </div>
        )}

        {item.passengerName && (
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-3 border-t border-slate-50">
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

export default function OrcamentoPage() {
  const params = useParams();
  const id = params?.id as string;

  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchSale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSale = async () => {
    try {
      setLoading(true);

      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .select('*, customer:customers(name), group:groups(name)')
        .eq('id', id)
        .single();

      if (saleError || !saleData) {
        setNotFound(true);
        return;
      }

      const { data: itemsData } = await supabase
        .from('sale_items')
        .select('*')
        .eq('sale_id', id);

      const items: SaleItem[] = (itemsData || []).map((i: any) => ({
        id: i.id,
        type: i.type as ItemType,
        flightType: i.flight_type,
        adults: i.adults,
        children: i.children,
        babies: i.babies,
        bags23kg: i.bags23kg,
        valuePaidByCustomer: parseFloat(i.value_paid_by_customer || '0'),
        vendor: i.vendor,
        origin: i.origin,
        destination: i.destination,
        locator: i.locator,
        emissionDate: i.emission_date,
        departureDate: i.departure_date,
        returnDate: i.return_date,
        checkIn: i.check_in,
        checkInTime: i.check_in_time,
        checkOut: i.check_out,
        checkOutTime: i.check_out_time,
        hasBreakfast: i.has_breakfast,
        hotelName: i.hotel_name,
        description: i.description,
        passengerName: i.passenger_name,
        hotelAmenities: Array.isArray(i.hotel_amenities) ? i.hotel_amenities : [],
        hotelDescription: i.hotel_description,
        hotelImages: Array.isArray(i.hotel_images) ? i.hotel_images : [],
      }));

      setSale({
        id: saleData.id,
        orderNumber: saleData.order_number,
        saleDate: saleData.sale_date,
        customerName: saleData.customer?.name || saleData.customer_name || 'Cliente',
        groupName: saleData.group?.name || saleData.group_name || '',
        items,
        totalValue: parseFloat(saleData.total_value || '0'),
        paymentMethod: saleData.payment_method || 'A definir',
        notes: saleData.notes || '',
        emissor: saleData.emissor || '',
        productName: saleData.product_name || '',
      });
    } catch (err) {
      console.error(err);
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
            <Image src={AGENCY.logoUrl} alt="Easy Fly" width={40} height={40} className="w-10 h-10 object-contain" />
          </div>
          <div className="space-y-1">
            <p className="font-black text-[#19727d] text-xl">Easy Fly</p>
            <p className="text-gray-400 text-sm font-medium">Carregando seu orçamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !sale) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#19727d]/5 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center mx-auto">
            <Image src={AGENCY.logoUrl} alt="Easy Fly" width={48} height={48} className="w-12 h-12 object-contain" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-800">Orçamento não encontrado</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Este link pode ter expirado ou ser inválido. Entre em contato com a agência para obter um novo link.
            </p>
          </div>
          <a
            href={`https://wa.me/${AGENCY.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Falar no WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const flights = sale.items.filter(i => i.type === 'passagem');
  const hotels = sale.items.filter(i => i.type === 'hospedagem');
  const others = sale.items.filter(i => !['passagem', 'hospedagem'].includes(i.type));
  const whatsappMsg = encodeURIComponent(
    `Olá! Vim pelo link do orçamento #${sale.orderNumber} referente à viagem de ${sale.customerName}. Gostaria de mais informações.`
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 font-sans">

      {/* HERO HEADER */}
      <header className="bg-gradient-to-br from-[#19727d] via-[#1a8090] to-[#0d5c66] text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Logo + Agency */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg flex-shrink-0 p-1.5">
              <Image src={AGENCY.logoUrl} alt="Easy Fly" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-black text-white text-lg leading-tight tracking-tight">Easy Fly</p>
              <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold">Agência de Viagens</p>
            </div>
          </div>

          {/* Order badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-white/90 mb-4 border border-white/20">
            <CheckCircle2 className="w-4 h-4 text-green-300" />
            Orçamento #{sale.orderNumber} • {formatDate(sale.saleDate)}
          </div>

          {/* Client info */}
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            {sale.productName || 'Proposta de Viagem'}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4 text-white/70" />
              <span className="text-sm font-bold text-white/90">{sale.customerName}</span>
            </div>
            {sale.emissor && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-bold text-white/90">Consultor: {sale.emissor}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* ===== VOOS ===== */}
        {flights.length > 0 && (
          <section>
            <SectionTitle icon={<Plane className="w-4 h-4" />} title="Voos" />
            <div className="space-y-4">
              {flights.map(item => <FlightItem key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {/* ===== HOSPEDAGENS ===== */}
        {hotels.length > 0 && (
          <section>
            <SectionTitle icon={<Hotel className="w-4 h-4" />} title="Hospedagem" />
            <div className="space-y-4">
              {hotels.map(item => <HotelItem key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {/* ===== OUTROS SERVIÇOS ===== */}
        {others.length > 0 && (
          <section>
            <SectionTitle icon={<Package className="w-4 h-4" />} title="Outros Serviços" />
            <div className="space-y-4">
              {others.map(item => <OtherItem key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {/* ===== VALORES ===== */}
        <section>
          <SectionTitle icon={<CreditCard className="w-4 h-4" />} title="Valores & Pagamento" />
          <div className="bg-gradient-to-br from-[#19727d] to-[#0d5c66] rounded-2xl p-6 text-white shadow-xl shadow-[#19727d]/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest">Total da Viagem</p>
                <p className="text-4xl font-black tracking-tight mt-1">{formatCurrency(sale.totalValue)}</p>
              </div>
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
            </div>

            {sale.paymentMethod && sale.paymentMethod !== 'Não definido' && (
              <div className="bg-white/10 rounded-xl p-3 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/70 flex-shrink-0" />
                <p className="text-sm font-bold text-white/90">{sale.paymentMethod}</p>
              </div>
            )}

            <div className="border-t border-white/20 pt-4">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Simulação de parcelamento</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INSTALLMENTS.map(n => (
                  <div key={n} className="bg-white/10 rounded-xl p-2.5 text-center hover:bg-white/20 transition-colors">
                    <p className="text-[11px] text-white/60 font-bold">{n}x de</p>
                    <p className="text-sm font-black text-white">{formatCurrency(sale.totalValue / n)}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-[10px] mt-2 text-center">* Valores sem juros. Consulte condições com a agência.</p>
            </div>
          </div>
        </section>

        {/* ===== OBSERVAÇÕES ===== */}
        {sale.notes && (
          <section>
            <SectionTitle icon={<Package className="w-4 h-4" />} title="Observações" />
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-gray-700 text-sm leading-relaxed font-medium">{sale.notes}</p>
            </div>
          </section>
        )}

        {/* ===== CTA WHATSAPP ===== */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-black text-gray-800 text-lg">Gostou? Vamos confirmar sua viagem!</p>
            <p className="text-gray-500 text-sm mt-1">Fale diretamente com nosso consultor pelo WhatsApp.</p>
          </div>
          <a
            href={`https://wa.me/${AGENCY.whatsapp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white rounded-2xl font-black shadow-xl shadow-green-500/30 hover:bg-green-600 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Confirmar no WhatsApp
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      {/* FOOTER AGÊNCIA */}
      <footer className="border-t border-gray-100 bg-white mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#19727d]/10 flex items-center justify-center p-1">
                <Image src={AGENCY.logoUrl} alt="Easy Fly" width={40} height={40} className="w-full h-full object-contain" />
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
                <a href={`https://wa.me/${AGENCY.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-green-600 transition-colors">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-50 mt-6 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-[11px] text-gray-400 font-bold">{AGENCY.legalName}</p>
            <p className="text-[11px] text-gray-400">CNPJ {AGENCY.cnpj}</p>
          </div>
          <p className="text-center text-[10px] text-gray-300 mt-4 font-medium">
            Este orçamento é válido por 72 horas a partir da data de emissão. • Easy Fly © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
