'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Script from 'next/script';
import { correctAirportName } from '@/lib/airport-utils';
import {
  Plane, Hotel, Shield, Car, Package, Calendar, Users, Briefcase,
  Phone, MessageCircle, CheckCircle, Clock, CreditCard, ArrowRight,
  MapPin, ChevronDown, ChevronUp, Info, Map, TrendingDown, Backpack, Luggage, Instagram, RefreshCw, DollarSign,
  Printer, ShieldAlert, Download, FileText, Star, X, Coffee,
  Wifi, Dumbbell, Waves, Utensils, GlassWater, Baby, Key, ConciergeBell,
  Snowflake, Bath, DoorOpen, Shirt, Wine, Palmtree, Tv, Gamepad2,
  Wind, Navigation, Cigarette, CigaretteOff, Sparkles, LayoutGrid, Heart, Images
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const AGENCY = {
  name: 'Easy Fly Agência de Viagens',
  legalName: 'EASY FLY AGENCIA DE VIAGENS LTDA',
  cnpj: '45.480.207/0001-49',
  phone: '(87) 99952-5083',
  whatsapp: '5587999525083',
  email: 'contato@easyflyagency.com.br',
  instagram: '@easyflly',
  address: 'Engenheiro brandao cavalcante, 224, Casa, Quadra 01, Petrolândia - PE, 56460-000',
  logoUrl: '/logo2.png',
};

const INSTALLMENTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const INTEREST_RATES: Record<number, number> = {
  1: 3.46,
  2: 4.75,
  3: 5.65,
  4: 6.52,
  5: 7.29,
  6: 8.76,
  7: 9.28,
  8: 10.31,
  9: 11.39,
  10: 12.55,
  11: 13.55,
  12: 14.75,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(value);

const normalizePhotoUrl = (photo: any): string => {
  if (!photo) return '';
  if (typeof photo === 'string') return photo;
  if (typeof photo === 'object' && photo.url) return photo.url;
  return '';
};

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
  'restaurante': { label: 'Restaurante', icon: Utensils },
  'restaurant': { label: 'Restaurante', icon: Utensils },
  'bar': { label: 'Bar & Drinks', icon: Wine },
  'café': { label: 'Café da Manhã', icon: Coffee },
  'breakfast': { label: 'Café da Manhã', icon: Coffee },
  'ar condicionado': { label: 'Ar Condicionado', icon: Snowflake },
  'ac': { label: 'Ar Condicionado', icon: Snowflake },
  'air conditioning': { label: 'Ar Condicionado', icon: Snowflake },
  'spa': { label: 'Spa & Relax', icon: Heart },
  'sauna': { label: 'Sauna', icon: Wind },
  'praia': { label: 'Beira Mar', icon: Palmtree },
  'beach': { label: 'Beira Mar', icon: Palmtree },
  'serviço de quarto': { label: 'Serviço de Quarto', icon: ConciergeBell },
  'room service': { label: 'Serviço de Quarto', icon: ConciergeBell },
  'recepção': { label: 'Recepção 24h', icon: Key },
  'reception': { label: 'Recepção 24h', icon: Key },
  'tv': { label: 'Smart TV', icon: Tv },
  'frigobar': { label: 'Frigobar', icon: GlassWater },
  'minibar': { label: 'Frigobar', icon: GlassWater },
  'cofre': { label: 'Cofre', icon: Shield },
  'safe': { label: 'Cofre', icon: Shield },
  'lavanderia': { label: 'Lavanderia', icon: Shirt },
  'laundry': { label: 'Lavanderia', icon: Shirt },
  'kids': { label: 'Espaço Kids', icon: Baby },
  'criança': { label: 'Espaço Kids', icon: Baby },
  'elevador': { label: 'Elevador', icon: Navigation },
  'elevator': { label: 'Elevador', icon: Navigation },
  'não fumante': { label: 'Não Fumante', icon: CigaretteOff },
  'non-smoking': { label: 'Não Fumante', icon: CigaretteOff },
  'negócios': { label: 'Business Center', icon: Briefcase },
  'business': { label: 'Business Center', icon: Briefcase },
  'reunião': { label: 'Sala de Reuniões', icon: Users },
  'meeting': { label: 'Sala de Reuniões', icon: Users },
  'banquete': { label: 'Eventos', icon: Utensils },
  'eventos': { label: 'Eventos', icon: Sparkles },
  'turismo': { label: 'Balcão de Turismo', icon: MapPin },
  'tour': { label: 'Balcão de Turismo', icon: MapPin },
  'serviço': { label: 'Serviços', icon: Sparkles },
  'instalações': { label: 'Instalações', icon: LayoutGrid },
  'quartos': { label: 'Quartos', icon: DoorOpen },
  'room': { label: 'Quartos', icon: DoorOpen }
};

const resolveAmenity = (amenity: string) => {
  const search = amenity.toLowerCase();
  const entry = Object.entries(AMENITY_MAP).find(([key]) => search.includes(key));
  if (entry) return entry[1];
  return { label: amenity, icon: CheckCircle };
};

const formatDate = (dateStr?: string) => {
  if (!dateStr || dateStr.includes('_')) return '—';
  try {
    if (dateStr.includes('-')) {
      const parts = dateStr.split('T')[0].split('-');
      if (parts[0].length === 4) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }
    if (dateStr.includes('/')) return dateStr;
    return dateStr;
  } catch { return dateStr || '—'; }
};

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  'BRASIL', 'BRAZIL'
];

const checkInternational = (lead?: Lead) => {
  if (!lead) return { isIntl: false, region: 'Nacional' };
  
  const items = lead.items;
  let region = 'Nacional';
  let isIntl = false;

  const MERCOSUL = [
    { name: 'Argentina', keys: ['ARGENTINA', 'BUENOS AIRES', 'MENDOZA', 'BARILOCHE', 'USHUAIA', 'EZE', 'AEP', 'MDZ', 'BRC', 'USH', 'IGR', 'AEROPARQUE'] },
    { name: 'Chile', keys: ['CHILE', 'SANTIAGO', 'VALPARAISO', 'VIÑA DEL MAR', 'PASCUA', 'SCL'] },
    { name: 'Uruguai', keys: ['URUGUAI', 'MONTEVIDEO', 'PUNTA DEL ESTE', 'COLONIA', 'MVD'] },
    { name: 'Paraguai', keys: ['PARAGUAI', 'ASUNCAO', 'CIUDAD DEL ESTE', 'ASU'] },
    { name: 'Peru', keys: ['PERU', 'LIMA', 'CUSCO', 'MACHU PICCHU', 'LIM'] },
    { name: 'Colombia', keys: ['COLOMBIA', 'BOGOTA', 'CARTAGENA', 'MEDELLIN', 'BOG'] }
  ];

  const EUROPA = ['PORTUGAL', 'ESPANHA', 'FRANÇA', 'ITALIA', 'ALEMANHA', 'REINO UNIDO', 'INGLATERRA', 'LISBOA', 'MADRID', 'MADRI', 'PARIS', 'ROMA', 'LONDRES', 'BERLIM', 'AMSTERDAM', 'AMSTERDA', 'SUIÇA', 'EUROPA', 'LIS', 'MAD', 'CDG', 'ORY', 'LHR', 'LGW', 'LCY', 'CIA', 'FCO', 'BCN', 'STN', 'BARCELONA', 'ORLY', 'HEATHROW', 'GATWICK', 'STANSTED', 'PORTO', 'MILAO', 'MILAN', 'VENEZA', 'VENICE', 'MUNIQUE', 'MUNICH', 'FRANKFURT', 'ZURIQUE', 'ZURICH', 'GENEBRA', 'GENEVA', 'MADRID', 'BARCELONA'];
  const EUA = ['EUA', 'USA', 'ESTADOS UNIDOS', 'UNITED STATES', 'MIAMI', 'ORLANDO', 'NY', 'NEW YORK', 'LAS VEGAS', 'CHICAGO', 'LOS ANGELES', 'MIA', 'MCO', 'JFK', 'EWR', 'LAX', 'SFO', 'LAS', 'NEWARK', 'FLORIDA', 'CALIFORNIA', 'TEXAS'];
  const MEXICO = ['MEXICO', 'CANCUN', 'RIVIERA MAYA', 'TULUM', 'CIDADE DO MEXICO', 'MEX', 'CUN', 'PLAYA DEL CARMEN', 'COZUMEL'];
  const DUBAI = ['DUBAI', 'UAE', 'EMIRADOS ARABES', 'ABU DHABI', 'DXB', 'AUH'];

  const getCleanText = (t?: string) => (t || '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  // 1. Verificar itens de passagem (Maior precisão)
  if (items) {
    for (const item of items) {
      if (item.type !== 'passagem') continue;
      const dest = getCleanText(item.destination);
      
      if (dest && !BRAZILIAN_STATES.includes(dest) && dest !== 'BRASIL' && dest !== 'BRAZIL' && dest.length > 2) {
        isIntl = true;
        if (EUA.some(k => dest.includes(k) || k.includes(dest))) return { isIntl: true, region: 'Estados Unidos' };
        if (EUROPA.some(k => dest.includes(k) || k.includes(dest))) return { isIntl: true, region: 'Europa' };
        if (MEXICO.some(k => dest.includes(k) || k.includes(dest))) return { isIntl: true, region: 'México' };
        if (DUBAI.some(k => dest.includes(k) || k.includes(dest))) return { isIntl: true, region: 'Dubai' };
        
        const merc = MERCOSUL.find(m => m.keys.some(k => dest.includes(k) || k.includes(dest)));
        if (merc) return { isIntl: true, region: merc.name };
        
        return { isIntl: true, region: 'Internacional' };
      }
    }
  }

  // 2. Fallback: Título ou Tags
  const context = getCleanText(lead.title + (lead.tags?.join(' ') || ''));
  if (EUA.some(k => context.includes(k))) return { isIntl: true, region: 'Estados Unidos' };
  if (EUROPA.some(k => context.includes(k))) return { isIntl: true, region: 'Europa' };
  if (MEXICO.some(k => context.includes(k))) return { isIntl: true, region: 'México' };
  if (DUBAI.some(k => context.includes(k))) return { isIntl: true, region: 'Dubai' };
  
  const mercFallback = MERCOSUL.find(m => m.keys.some(k => context.includes(k)));
  if (mercFallback) return { isIntl: true, region: mercFallback.name };

  return { isIntl, region };
};

type ItemType = 'passagem' | 'hospedagem' | 'translado' | 'seguro' | 'carro' | 'adicionais';

interface LeadItem {
  id: string;
  type: ItemType;
  flightType?: 'ida' | 'ida_volta' | 'multi';
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
  multiLegs?: any[];
  returnDuration?: string;
  hotelName?: string;
  hotelAddress?: string;
  hotelPhotos?: string[];
  hotelImages?: string[];
  hotelDescription?: string;
  hotelAmenities?: string[];
  hasBreakfast?: boolean;
  checkInDate?: string;
  checkInTime?: string;
  checkOutDate?: string;
  checkOutTime?: string;
  checkIn?: string;
  checkOut?: string;
  boardBasis?: string;
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
  usd_rate: number;
  eur_rate: number;
  gbp_rate: number;
  fees_type?: 'with_interest' | 'interest_free';
  fees_installments?: number;
}

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'passagem': return <Plane className="w-5 h-5" />;
    case 'hospedagem': return <Hotel className="w-5 h-5" />;
    case 'translado': return <Car className="w-5 h-5" />;
    case 'seguro': return <Shield className="w-5 h-5" />;
    case 'carro': return <Car className="w-5 h-5" />;
    default: return <Package className="w-5 h-5" />;
  }
}

function TypeGradient(type: string) {
  switch (type) {
    case 'passagem': return 'from-blue-500 to-cyan-500';
    case 'hospedagem': return 'from-[#19727d] to-cyan-500';
    case 'translado': return 'from-cyan-500 to-blue-600';
    case 'seguro': return 'from-green-500 to-emerald-500';
    case 'carro': return 'from-orange-500 to-amber-500';
    default: return 'from-gray-500 to-slate-500';
  }
}

function TypeLabel({ type }: { type: string }) {
  const map: Record<string, string> = {
    passagem: 'Passagem Aérea', hospedagem: 'Hospedagem', translado: 'Translado',
    seguro: 'Seguro Viagem', carro: 'Aluguel de Carro', adicionais: 'Adicionais'
  };
  return <>{map[type] || type}</>;
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 bg-[#19727d]/10 rounded-xl flex items-center justify-center text-[#19727d]">
        {icon}
      </div>
      <h2 className="text-lg font-black text-gray-800 tracking-tight">{title}</h2>
    </div>
  );
}

function TravelChecklist({ isIntl, region }: { isIntl: boolean, region: string }) {
  const getItems = () => {
    if (region === 'Argentina') {
      return [
        { icon: <Briefcase className="w-4 h-4" />, title: "RG Original (ID)", desc: "RG físico original com menos de 10 anos e em bom estado. CNH NÃO é aceita na imigração." },
        { icon: <Shield className="w-4 h-4" />, title: "Seguro Viagem Obrigatório", desc: "Exigência legal (Decreto 2025). O seguro médico é indispensável para entrar na Argentina." },
        { icon: <CheckCircle className="w-4 h-4" />, title: "Passaporte Opcional", desc: "Embora o RG seja suficiente, o passaporte é aceito e recomendado." },
        { icon: <Users className="w-4 h-4" />, title: "Menores de Idade", desc: "RG original + autorização se viajar com apenas um dos pais." }
      ];
    }
    if (region === 'Chile') {
      return [
        { icon: <Briefcase className="w-4 h-4" />, title: "RG Original (ID)", desc: "RG físico original com menos de 10 anos e em bom estado. CNH NÃO é aceita na imigração." },
        { icon: <Shield className="w-4 h-4" />, title: "Seguro Viagem", desc: "Altamente recomendado devido aos elevados custos da saúde privada no Chile." },
        { icon: <CheckCircle className="w-4 h-4" />, title: "Passaporte Opcional", desc: "Brasileiros podem entrar no Chile apenas com o RG em bom estado." },
        { icon: <Users className="w-4 h-4" />, title: "Menores de Idade", desc: "RG original + autorização se viajar com apenas um dos pais." }
      ];
    }
    if (['Uruguai', 'Paraguai', 'Peru', 'Colombia'].includes(region)) {
      return [
        { icon: <Briefcase className="w-4 h-4" />, title: "RG Original (ID)", desc: "RG físico original com menos de 10 anos. CNH não possui validade para imigração no Mercosul." },
        { icon: <CheckCircle className="w-4 h-4" />, title: "Passaporte Opcional", desc: "Como país do Mercosul, o passaporte não é obrigatório, mas recomendado." },
        { icon: <Shield className="w-4 h-4" />, title: "Seguro Viagem", desc: "Recomendado para garantir atendimento médico hospitalar seguro durante sua estadia." },
        { icon: <Users className="w-4 h-4" />, title: "Menores de Idade", desc: "Documentação original e autorizações de viagem obrigatórias." }
      ];
    }
    
    switch(region) {
      case 'Estados Unidos':
        return [
          { icon: <Briefcase className="w-4 h-4" />, title: "Visto Americano", desc: "Obrigatório Visto B1/B2 ou ESTA aprovado. Verifique a validade do seu visto atual." },
          { icon: <Clock className="w-4 h-4" />, title: "Passaporte 6 Meses", desc: "O passaporte deve ter validade mínima de 6 meses no momento da entrada." },
          { icon: <Shield className="w-4 h-4" />, title: "Seguro de Saúde", desc: "Altamente recomendado. Custos médicos nos EUA são extremamente elevados." },
          { icon: <CheckCircle className="w-4 h-4" />, title: "Endereço nos EUA", desc: "Tenha em mãos o endereço completo da sua primeira hospedagem para a imigração." }
        ];
      case 'Europa':
        return [
          { icon: <Shield className="w-4 h-4" />, title: "Seguro Schengen", desc: "Obrigatório seguro com cobertura mínima de €30.000 para despesas médicas." },
          { icon: <Briefcase className="w-4 h-4" />, title: "Passaporte 3-6 Meses", desc: "Validade mínima conforme o país da UE (recomenda-se 6 meses pós-retorno)." },
          { icon: <CheckCircle className="w-4 h-4" />, title: "Isento de Visto", desc: "Brasileiros não precisam de visto para turismo até 90 dias (ETIAS inicia em 2026)." },
          { icon: <Package className="w-4 h-4" />, title: "Comprovante Financeiro", desc: "Podem solicitar comprovante de fundos (dinheiro/cartão) para estadia diária." }
        ];
      case 'México':
        return [
          { icon: <Briefcase className="w-4 h-4" />, title: "Visto Mexicano", desc: "Obrigatório Visto Físico ou e-Visa (disponível Fevereiro/2026). Isento se tiver Visto EUA." },
          { icon: <CheckCircle className="w-4 h-4" />, title: "Isenção Visto EUA", desc: "Se possui Visto Americano válido, você NÃO precisa do Visto Mexicano." },
          { icon: <Briefcase className="w-4 h-4" />, title: "Passaporte Original", desc: "Validade mínima de 6 meses. Documentos físicos são prioritários." },
          { icon: <Info className="w-4 h-4" />, title: "Formulário de Imigração", desc: "Pode ser solicitado o preenchimento da migração eletrônica antecipadamente." }
        ];
      case 'Dubai':
        return [
          { icon: <CheckCircle className="w-4 h-4" />, title: "Visto Grátis (90 dias)", desc: "Brasileiros têm isenção de visto para turismo em Dubai/Abu Dhabi por até 90 dias." },
          { icon: <Briefcase className="w-4 h-4" />, title: "Passaporte (6 meses)", desc: "Obrigatório passaporte original com validade de pelo menos 6 meses." },
          { icon: <Clock className="w-4 h-4" />, title: "Seguro Local", desc: "Recomendado Seguro Viagem com cobertura para grandes hospitais privados." },
          { icon: <Plane className="w-4 h-4" />, title: "Passagem de Retorno", desc: "Tenha em mãos a confirmação da passagem de volta ou saída dos Emirados." }
        ];
      case 'Internacional':
        return [
          { icon: <Briefcase className="w-4 h-4" />, title: "Passaporte Original", desc: "Deve ter validade mínima de 6 meses a partir da data de embarque." },
          { icon: <ShieldAlert className="w-4 h-4" />, title: "Vistos e Taxas", desc: "Verifique se o destino exige visto e se há taxas de turismo de entrada/saída." },
          { icon: <Shield className="w-4 h-4" />, title: "Seguro Internacional", desc: "Essencial para garantir atendimento médico e repatriação em caso de emergência." },
          { icon: <CheckCircle className="w-4 h-4" />, title: "Saúde e Vacinas", desc: "Certificado Internacional de Vacinação (Febre Amarela) se solicitado." }
        ];
      default:
        return [
          { icon: <Briefcase className="w-4 h-4" />, title: "Documento Oficial", desc: "RG ou CNH original dentro da validade para embarque nacional." },
          { icon: <Users className="w-4 h-4" />, title: "Menores de Idade", desc: "RG ou Certidão de Nascimento original. Verifique autorizações se viajar sem os pais." },
          { icon: <Package className="w-4 h-4" />, title: "Franquia de Bagagem", desc: "Confirme se o seu bilhete inclui bagagem de mão (10kg) e despachada (23kg)." },
          { icon: <MapPin className="w-4 h-4" />, title: "Localização", desc: "Confirme o endereço de hospedagem e pontos de interesse próximos." }
        ];
    }
  };

  const items = getItems();

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm relative overflow-hidden group/card shadow-emerald-900/5">
      <div className="absolute top-0 right-0 py-1 px-4 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg no-print">
        Informações Atualizadas 2025/26
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-[#19727d]/10 rounded-2xl flex items-center justify-center text-[#19727d] border border-[#19727d]/10 group-hover/card:scale-110 transition-transform duration-500">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1.5 uppercase">Checklist de Segurança</h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${isIntl ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
              {isIntl ? 'Viagem Internacional' : 'Viagem Nacional'}
            </span>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:border-[#19727d]/20 transition-all duration-300 group cursor-default">
            <div className="shrink-0 w-6 h-6 border-2 border-slate-200 rounded-lg group-hover:border-[#19727d] transition-colors flex items-center justify-center">
               <CheckCircle className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-[#19727d] group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{item.title}</p>
              </div>
              <p className="text-[10px] font-medium text-slate-500 leading-relaxed font-sans">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 opacity-60">
            <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic uppercase tracking-wider flex items-center gap-2">
               <Info className="w-3.5 h-3.5" />
               A agência não se responsabiliza por documentos inválidos ou falta de vistos. Verifique sempre os canais oficiais do país de destino.
            </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 no-print">
          <a 
            href="https://apply.joinsherpa.com/travel-restrictions?language=pt-BR"
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 bg-[#19727d] hover:bg-[#145d66] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#19727d]/20"
          >
            <div className="bg-white/20 p-2 rounded-xl group-hover:rotate-12 transition-transform">
               <FileText className="w-4 h-4 text-white" />
            </div>
            Documentação Obrigatória
          </a>
        </div>
      </div>
    </div>
  );
}

const AIRPORT_INFO: Record<string, { coords: [number, number], name: string }> = {
  // BRASIL - PRINCIPAIS
  'REC': { coords: [-8.1264, -34.9228], name: 'Guararapes - Recife' },
  'GIG': { coords: [-22.8100, -43.2506], name: 'Galeão - Rio de Janeiro' },
  'GRU': { coords: [-23.4356, -46.4731], name: 'Guarulhos - São Paulo' },
  'CGH': { coords: [-23.6273, -46.6566], name: 'Congonhas - São Paulo' },
  'BSB': { coords: [-15.8711, -47.9186], name: 'Juscelino Kubitschek - Brasília' },
  'VCP': { coords: [-23.0069, -47.1344], name: 'Viracopos - Campinas' },
  'CNF': { coords: [-19.6244, -43.9719], name: 'Confins - Belo Horizonte' },
  'SSA': { coords: [-12.9111, -38.3308], name: 'Dep. Luís Eduardo Magalhães - Salvador' },
  'FOR': { coords: [-3.7763, -38.5326], name: 'Pinto Martins - Fortaleza' },
  'CWB': { coords: [-25.5317, -49.1758], name: 'Afonso Pena - Curitiba' },
  'POA': { coords: [-29.9939, -51.1711], name: 'Salgado Filho - Porto Alegre' },
  'SDU': { coords: [-22.9102, -43.1631], name: 'Santos Dumont - Rio de Janeiro' },
  'FLN': { coords: [-27.6701, -48.5525], name: 'Hercílio Luz - Florianópolis' },
  'MCZ': { coords: [-9.5108, -35.7917], name: 'Zumbi dos Palmares - Maceió' },
  'NAT': { coords: [-5.9114, -35.2477], name: 'Aluízio Alves - Natal' },
  'VIX': { coords: [-20.2576, -40.2864], name: 'Eurico de Aguiar Salles - Vitória' },
  'GYN': { coords: [-16.6322, -49.2214], name: 'Santa Genoveva - Goiânia' },
  'MAO': { coords: [-3.0358, -60.0506], name: 'Eduardo Gomes - Manaus' },
  'BEL': { coords: [-1.3847, -48.4788], name: 'Val-de-Cans - Belém' },
  'CGB': { coords: [-15.6529, -56.1167], name: 'Marechal Rondon - Cuiabá' },
  'JPA': { coords: [-7.1483, -34.9503], name: 'Castro Pinto - João Pessoa' },
  'SLZ': { coords: [-2.5869, -44.2361], name: 'Marechal Cunha Machado - São Luís' },
  'IGU': { coords: [-25.5977, -54.4853], name: 'Cataratas - Foz do Iguaçu' },
  'AJU': { coords: [-10.9852, -37.0733], name: 'Santa Maria - Aracaju' },
  'THE': { coords: [-5.0606, -42.8244], name: 'Teresina - Piauí' },
  'BVB': { coords: [2.8414, -60.6922], name: 'Boa Vista - Roraima' },
  'MCP': { coords: [0.0506, -51.0722], name: 'Macapá - Amapá' },
  'PVH': { coords: [-8.7075, -63.9025], name: 'Porto Velho - Rondônia' },
  'RBR': { coords: [-9.9939, -67.8922], name: 'Rio Branco - Acre' },
  'PMW': { coords: [-10.2906, -48.3578], name: 'Palmas - Tocantins' },
  // BRASIL - REGIONAIS IMPORTANTES
  'FEN': { coords: [-3.8547, -32.4233], name: 'Fernando de Noronha - PE' },
  'PNZ': { coords: [-9.3622, -40.5636], name: 'Sen. Nilo Coelho - Petrolina' },
  'PAV': { coords: [-9.4008, -38.2506], name: 'Paulo Afonso - Bahia' },
  'BPS': { coords: [-16.4378, -39.0778], name: 'Porto Seguro - Bahia' },
  'IOS': { coords: [-14.8142, -39.0333], name: 'Jorge Amado - Ilhéus' },
  'NVT': { coords: [-26.8786, -48.6514], name: 'Navegantes - SC' },
  'JOI': { coords: [-26.2231, -48.7978], name: 'Joinville - SC' },
  'XAP': { coords: [-27.1339, -52.6611], name: 'Chapecó - SC' },
  'UDI': { coords: [-18.8836, -48.2253], name: 'Uberlândia - MG' },
  'SJP': { coords: [-20.8122, -49.4047], name: 'São José do Rio Preto - SP' },
  'MGF': { coords: [-23.4794, -51.9161], name: 'Maringá - PR' },
  'LDB': { coords: [-23.3303, -51.1378], name: 'Londrina - PR' },
  'CAC': { coords: [-24.9961, -53.5006], name: 'Cascavel - PR' },
  'PET': { coords: [-31.7178, -52.3314], name: 'Pelotas - RS' },
  'CPV': { coords: [-7.2697, -35.8892], name: 'Campina Grande - PB' },
  'JDO': { coords: [-7.2186, -39.2708], name: 'Juazeiro do Norte - CE' },
  'CXJ': { coords: [-29.1956, -51.1883], name: 'Caxias do Sul - RS' },
  'IMP': { coords: [-5.5303, -47.4589], name: 'Imperatriz - MA' },
  'MOC': { coords: [-16.7067, -43.8219], name: 'Montes Claros - MG' },
  // INTERNACIONAL - MAIS COMUNS
  'MIA': { coords: [25.7959, -80.2870], name: 'Miami International' },
  'MCO': { coords: [28.4312, -81.3081], name: 'Orlando International' },
  'JFK': { coords: [40.6413, -73.7781], name: 'John F. Kennedy - New York' },
  'LIS': { coords: [38.7756, -9.1354], name: 'Humberto Delgado - Lisboa' },
  'CDG': { coords: [49.0097, 2.5479], name: 'Charles de Gaulle - Paris' },
  'MAD': { coords: [40.4839, -3.5680], name: 'Barajas - Madrid' },
  'LHR': { coords: [51.4700, -0.4543], name: 'Heathrow - London' },
  'EZE': { coords: [-34.8222, -58.5358], name: 'Ministro Pistarini - Buenos Aires' },
  'SCL': { coords: [-33.3930, -70.7858], name: 'Arturo Merino Benítez - Santiago' },
  'BOG': { coords: [4.7016, -74.1469], name: 'El Dorado - Bogotá' },
  'PTY': { coords: [9.0714, -79.3835], name: 'Tocumen - Panama City' },
  'MEX': { coords: [19.4361, -99.0719], name: 'Benito Juárez - Mexico City' },
  'LCY': { coords: [51.5048, 0.0503], name: 'London City Airport' },
  'ORY': { coords: [48.7262, 2.3652], name: 'Orly - Paris' },
  'CIA': { coords: [41.7994, 12.5949], name: 'Ciampino - Roma' },
  'LAX': { coords: [33.9416, -118.4085], name: 'Los Angeles International' },
  'SFO': { coords: [37.6191, -122.3749], name: 'San Francisco International' },
  'LAS': { coords: [36.0840, -115.1537], name: 'Las Vegas - Harry Reid' },
  'CUN': { coords: [21.0365, -86.8771], name: 'Cancún International' },
  'PUJ': { coords: [18.5674, -68.3634], name: 'Punta Cana International' },
  'USH': { coords: [-54.8433, -68.2958], name: 'Ushuaia International' },
  'BRC': { coords: [-41.1511, -71.1394], name: 'Teniente L. Candelaria - Bariloche' },
  'MDZ': { coords: [-32.8317, -68.7928], name: 'El Plumerillo - Mendoza' },
  'IGR': { coords: [-25.7372, -54.4733], name: 'Cataratas del Iguazú - Argentina' },
  'DXB': { coords: [25.2528, 55.3644], name: 'Dubai International' },
  'AUH': { coords: [24.4331, 54.6511], name: 'Abu Dhabi International' },
  'DOH': { coords: [25.2731, 51.6083], name: 'Hamad - Doha' },
  'IST': { coords: [41.2753, 28.7519], name: 'Istanbul Airport' },
  'AMS': { coords: [52.3105, 4.7683], name: 'Schiphol - Amsterdam' },
  'BCN': { coords: [41.2974, 2.0833], name: 'Barcelona-El Prat' },
  'OPO': { coords: [41.2421, -8.6786], name: 'Francisco Sá Carneiro - Porto' },
  'RAO': { coords: [-21.1364, -47.7767], name: 'Leite Lopes - Ribeirão Preto' },
  'BFS': { coords: [54.6575, -6.2158], name: 'Aeroporto Internacional de Belfast (Capital da Irlanda do Norte)' }
};

/**
 * Hook para resolver informações de aeroportos dinamicamente.
 * Usa um cache estático (AIRPORT_INFO) e busca no Nominatim se não encontrar.
 */
function useAirportResolver(initialAirports: string[]) {
  const [resolvedMap, setResolvedMap] = useState<Record<string, { coords: [number, number], name: string }>>(AIRPORT_INFO);
  const [isLoading, setIsLoading] = useState(false);
  const fetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchMissing = async () => {
      const missing = initialAirports?.filter(iata => !resolvedMap[iata] && iata && iata.length === 3 && !fetchedRef.current.has(iata)) || [];
      if (missing.length === 0) return;

      setIsLoading(true);
      const newEntries: Record<string, any> = {};

      for (const iata of missing) {
        fetchedRef.current.add(iata); // Adiciona ao ref para garantir que não tente de novo
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${iata}+Airport&format=json&limit=1`, {
            headers: { 
              'Accept-Language': 'pt-BR',
              'User-Agent': 'Easy Fly CRM/1.0'
            }
          });
          const data = await res.json();
          if (data && data[0] && !isNaN(parseFloat(data[0].lat)) && !isNaN(parseFloat(data[0].lon))) {
            const displayName = data[0].display_name;
            const parts = displayName.split(',').map((p: string) => p.trim());
            const name = parts[0] + (parts[1] && isNaN(parseInt(parts[1])) ? ` - ${parts[1]}` : '');
            
            newEntries[iata] = {
              coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
              name: name
            };
          } else {
            newEntries[iata] = { coords: [-15, -47], name: `Aeroporto ${iata}` };
          }
        } catch (e) {
          newEntries[iata] = { coords: [-15, -47], name: `Aeroporto ${iata}` };
        }
      }

      setResolvedMap(prev => ({ ...prev, ...newEntries }));
      setIsLoading(false);
    };

    fetchMissing();
  }, [initialAirports, resolvedMap]);

  return { airportInfo: resolvedMap, isLoading };
}


const calculateDuration = (depTime?: string, arrTime?: string, depDate?: string, arrDate?: string, origin?: string, destination?: string) => {
  if (!depTime || !arrTime) return null;
  try {
    const parse = (t: string, d?: string) => {
      const [h, m] = t.split(':').map(Number);
      if (d) {
        const parts = d.split(/[/-]/);
        let day, month, year;
        if (parts[0].length === 4) { [year, month, day] = parts; }
        else { [day, month, year] = parts; }
        return new Date(Number(year), Number(month) - 1, Number(day), h, m).getTime();
      }
      return new Date(2000, 0, 1, h, m).getTime();
    };

    let start = parse(depTime, depDate);
    let end = parse(arrTime, arrDate);
    
    // AJUSTE DE FUSO HORÁRIO (NORONHA - FEN)
    // Fernando de Noronha é UTC-2, o resto do Brasil (Brasiia) é UTC-3
    if (origin === 'FEN' && destination !== 'FEN') {
      // Saindo de Noronha: O voo "ganha" 1 hora no relógio local, então a duração real é +1h do que a diferença nominal
      start -= 60 * 60 * 1000;
    } else if (origin !== 'FEN' && destination === 'FEN') {
      // Chegando em Noronha: O voo "perde" 1 hora no relógio local, então a duração real é -1h do que a diferença nominal
      start += 60 * 60 * 1000;
    }

    let diffMs = end - start;
    if (!depDate && diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
    
    const totalMin = Math.floor(diffMs / (1000 * 60));
    if (totalMin <= 0) return null;
    
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}h ${m}min`;
  } catch { return null; }
};

function InteractiveMap({ lead, flights, airportInfo }: { lead: Lead; flights: LeadItem[]; airportInfo: Record<string, any> }) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLeafletReady, setLeafletReady] = useState(false);
  // Correção: Verificar se o voo principal sendo exibido é ida e volta
  const isIdaVolta = flights.some(f => f.flightType === 'ida_volta');

  useEffect(() => {
    if ((window as any).L) {
      setTimeout(() => setLeafletReady(true), 0);
      return;
    }
    const interval = setInterval(() => {
       if ((window as any).L) {
         setLeafletReady(true);
         clearInterval(interval);
       }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLeafletReady || !containerRef.current || flights.length === 0) return;
    const L = (window as any).L;
    
    if (mapRef.current) {
      mapRef.current.off();
      mapRef.current.remove();
      mapRef.current = null;
    }
    
    if (containerRef.current) {
        const container = containerRef.current as any;
        if (container._leaflet_id) {
            container._leaflet_id = null;
        }
    }

    const firstFlight = flights[0];
    const outbound = Array.isArray(firstFlight?.outboundSegments) ? firstFlight.outboundSegments : [];
    
    const ori = outbound[0]?.origin || 'REC';
    const des = outbound[outbound.length - 1]?.destination || 'GIG';
    const p1 = airportInfo[ori]?.coords || [-15, -47];
    const p2 = airportInfo[des]?.coords || [-23, -46];

    // Proteção contra NaN
    const centerLat = isNaN((p1[0]+p2[0])/2) ? -15 : (p1[0]+p2[0])/2;
    const centerLng = isNaN((p1[1]+p2[1])/2) ? -47 : (p1[1]+p2[1])/2;

    let map: any;
    try {
      map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([ centerLat, centerLng ], 4);
    } catch (e) {
      console.error("Erro ao inicializar mapa", e);
      return;
    }
    
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'topleft' }).addTo(map);
    
    const getCurvePoints = (start: [number, number], end: [number, number], arcIntensity = 0.2) => {
      const points: [number, number][] = [];
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = start[0] + (end[0] - start[0]) * t;
        const lng = start[1] + (end[1] - start[1]) * t;
        const offset = Math.sin(t * Math.PI) * arcIntensity * Math.sqrt(Math.pow(end[0]-start[0], 2) + Math.pow(end[1]-start[1], 2));
        points.push([lat + offset, lng]);
      }
      return points;
    };

    const createDot = (color: string) => L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 10px; height: 10px; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 0 10px ${color}80;"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });

    const allPoints: [number, number][] = [];

    flights.forEach((flight, flightIdx) => {
      const isIdaVoltaItem = flight.flightType === 'ida_volta';
      const outbound = Array.isArray(flight.outboundSegments) ? flight.outboundSegments : [];
      const inbound = Array.isArray(flight.inboundSegments) ? flight.inboundSegments : [];

      // --- IDA / TRECHOS ---
      if (outbound.length > 0) {
        outbound.forEach((seg: any, idx: number) => {
          const pStart = airportInfo[seg.origin]?.coords;
          const pEnd = airportInfo[seg.destination]?.coords;
          
          if (!pStart || !pEnd) return;

          allPoints.push(pStart);
          if (idx === outbound.length - 1) allPoints.push(pEnd);

          // Draw Arc
          const pts = getCurvePoints(pStart, pEnd, 0.15);
          L.polyline(pts, {
            color: '#0891b2',
            weight: 3,
            dashArray: '8, 8',
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          // Marker for each point in IDA
          L.marker(pStart, { icon: createDot('#0891b2') }).addTo(map);
          if (idx === outbound.length - 1) {
            L.marker(pEnd, { icon: createDot('#0891b2') }).addTo(map);
          }
        });
      }
      // --- VOLTA ---
      if (isIdaVoltaItem && inbound.length > 0) {
        inbound.forEach((seg: any, idx: number) => {
          const pStart = airportInfo[seg.origin]?.coords;
          const pEnd = airportInfo[seg.destination]?.coords;
          
          if (!pStart || !pEnd) return;

          allPoints.push(pStart);
          if (idx === inbound.length - 1) allPoints.push(pEnd);

          // Draw Arc (Inverted for differentiation)
          const pts = getCurvePoints(pStart, pEnd, -0.1);
          L.polyline(pts, {
            color: '#9333ea',
            weight: 2,
            dashArray: '5, 10',
            opacity: 0.8
          }).addTo(map);

          // Marker for each point in VOLTA
          L.marker(pStart, { icon: createDot('#9333ea') }).addTo(map);
          if (idx === inbound.length - 1) {
            L.marker(pEnd, { icon: createDot('#9333ea') }).addTo(map);
          }
        });
      }

      // --- MULTI-TRECHO ---
      if (flight.flightType === 'multi' && Array.isArray(flight.multiLegs)) {
        flight.multiLegs.forEach((leg: any) => {
          const segments = Array.isArray(leg.segments) ? leg.segments : [];
          segments.forEach((seg: any, idx: number) => {
            const pStart = airportInfo[seg.origin]?.coords;
            const pEnd = airportInfo[seg.destination]?.coords;
            
            if (!pStart || !pEnd) return;

            allPoints.push(pStart);
            if (idx === segments.length - 1) allPoints.push(pEnd);

            // Draw Arc
            const pts = getCurvePoints(pStart, pEnd, 0.15);
            L.polyline(pts, {
              color: '#0891b2',
              weight: 3,
              dashArray: '8, 8',
              lineCap: 'round',
              lineJoin: 'round'
            }).addTo(map);

            // Marker for each point
            L.marker(pStart, { icon: createDot('#0891b2') }).addTo(map);
            if (idx === segments.length - 1) {
              L.marker(pEnd, { icon: createDot('#0891b2') }).addTo(map);
            }
          });
        });
      }
    });

    if (allPoints.length > 0) {
       const validPoints = allPoints.filter(p => p && Array.isArray(p) && p.length === 2 && !isNaN(p[0]) && !isNaN(p[1]));
       if (validPoints.length > 0) {
         try {
           const bounds = L.latLngBounds(validPoints);
           map.fitBounds(bounds, { padding: [50, 50] });
         } catch (e) {
           console.error("Erro ao ajustar limites do mapa", e);
         }
       }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isLeafletReady, flights, airportInfo]);

  return (
    <div className="mb-12 no-print">
      <div id="main-travel-map" className="relative w-full h-[400px] sm:h-[450px] rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 bg-[#f8f9fa] group">
        {/* Container Leaflet */}
        <div ref={containerRef} className="w-full h-full z-0" />
        
        {!isLeafletReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm z-50">
             <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Legend Overlay INSIDE Map */}
        <div className="absolute bottom-3 left-3 right-3 z-[400] flex items-center justify-between gap-4 pointer-events-none">
           <p className="text-[7px] sm:text-[8px] text-slate-400 font-bold italic leading-none truncate flex-1 opacity-80">
              *As linhas do trajeto exibidas são ilustrativas e podem não representar o trajeto exato da aeronave.
           </p>

           <div className="bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/40 flex items-center gap-4 shadow-sm pointer-events-auto scale-90 origin-right transition-transform hover:scale-95">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-1 rounded-full bg-[#0891b2] shadow-[0_0_8px_rgba(8,145,178,0.5)]" />
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Ida</span>
              </div>
              {isIdaVolta && (
                <div className="flex items-center gap-2 border-l border-slate-200/50 pl-3">
                   <div className="w-3 h-1 rounded-full bg-[#9333ea] shadow-[0_0_8px_rgba(147,51,234,0.5)]" />
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Volta</span>
                </div>
              )}
           </div>
        </div>

        {/* Custom Style for Zoom Controls (No Borders) */}
        <style jsx global>{`
          .leaflet-bar {
            border: none !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
            border-radius: 12px !important;
            overflow: hidden;
            margin-top: 10px !important;
            margin-left: 10px !important;
          }
          .leaflet-bar a {
            border: none !important;
            background-color: white !important;
            color: #475569 !important;
            font-weight: bold !important;
            width: 36px !important;
            height: 36px !important;
            line-height: 36px !important;
            transition: all 0.2s;
          }
          .leaflet-bar a:hover {
            background-color: #f8fafc !important;
            color: #1e293b !important;
          }
        `}</style>
      </div>
    </div>
  );
}

function MainTravelMap({ lead, flights, airportInfo }: { lead: Lead; flights: LeadItem[]; airportInfo: Record<string, any> }) {
  return <InteractiveMap lead={lead} flights={flights} airportInfo={airportInfo} />;
}

function AirlineLogo({ name }: { name: string }) {
  const airlineMap: Record<string, string> = {
    'latam': 'latam.com',
    'gol': 'voegol.com.br',
    'azul': 'voeazul.com.br',
    'tap': 'flytap.com',
    'american': 'aa.com',
    'delta': 'delta.com',
    'united': 'united.com',
    'lufthansa': 'lufthansa.com',
    'emirates': 'emirates.com',
    'qatar': 'qatarairways.com',
    'copa': 'copaair.com',
    'avianca': 'avianca.com',
    'british': 'britishairways.com',
    'air france': 'airfrance.com',
    'klm': 'klm.com',
    'iberia': 'iberia.com',
    'aerolineas': 'aerolineas.com.ar',
    'sky': 'skyairline.com'
  };

  const domain = Object.entries(airlineMap).find(([k]) => name.toLowerCase().includes(k))?.[1];
  
  if (domain) {
    return (
      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={`https://logo.clearbit.com/${domain}`} 
          alt={name}
          className="w-6 h-6 object-contain"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{name}</span>
      </div>
    );
  }

  return (
    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-slate-200">
      {name}
    </span>
  );
}

function FlightLegCard({ 
  segments, 
  type, 
  lead, 
  itemDuration,
  airportInfo 
}: { 
  segments: any[]; 
  type: 'Ida' | 'Volta'; 
  lead: Lead; 
  itemDuration?: string;
  airportInfo: Record<string, any>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fmt = (t?: string) => {
    if (!t) return null;
    const [h, m] = t.split(':');
    return `${h}h${m}`;
  };

  const calculateConnectionTime = (arrival: string, departure: string) => {
    try {
      const [h1, m1] = arrival.split(':').map(Number);
      const [h2, m2] = departure.split(':').map(Number);
      let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (diff < 0) diff += 1440; // Next day
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return `${h}h ${m}min`;
    } catch (e) {
      return null;
    }
  };

  if (!segments || segments.length === 0) return null;

  const firstSeg = segments[0];
  const lastSeg = segments[segments.length - 1];
  const hasConnections = segments.length > 1;

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 group mb-8">
      <div className="p-0">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${type === 'Ida' ? 'bg-cyan-50' : 'bg-purple-50'} rounded-2xl flex items-center justify-center`}>
                 <Plane className={`w-5 h-5 ${type === 'Ida' ? 'text-cyan-600' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className="text-[11px] sm:text-sm font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Voo de {type}</h3>
                {firstSeg && <p className="text-[10px] sm:text-xs font-bold text-slate-400">{formatDate(firstSeg.departureDate)}</p>}
              </div>
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-50 hover:bg-cyan-50 text-slate-500 hover:text-cyan-600 rounded-xl text-[10px] sm:text-xs font-black transition-all border border-transparent hover:border-cyan-100"
            >
              {isExpanded ? 'Menos detalhes' : 'Mais detalhes'}
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between mt-6 sm:mt-8 mb-4 px-0 sm:px-2 gap-2">
            {/* Left Block - Departure */}
            <div className="text-left flex-1 sm:w-[200px] flex flex-col justify-start">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{firstSeg?.departureTime ? fmt(firstSeg.departureTime) : '--:--'}</p>
              <div className="mt-1 h-6 sm:h-7 flex items-start overflow-hidden">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 leading-tight tracking-tight uppercase">
                  {correctAirportName(firstSeg?.origin || '', airportInfo[firstSeg?.origin || '']?.name || firstSeg?.origin || '---')}
                </p>
              </div>
            </div>

{/* Middle Block - Timeline */}
            <div className="flex-[0.5] sm:flex-1 flex flex-col items-center relative h-10 sm:h-12 group self-center px-2">
               {/* Journey Duration above badge */}
               <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap">
                  <Clock className="w-3 h-3 text-slate-300" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest tabular-nums leading-none">
                    {(() => {
                      try {
                        const getNums = (val: any) => {
                          if (typeof val === 'number') return [val];
                          if (typeof val !== 'string' || !val) return [];
                          return val.match(/\d+/g)?.map((n: string) => parseInt(n, 10)) || [];
                        };

                        // 1. Try SUM of segments + connections (Most accurate for International)
                        if (segments.length > 1) {
                          let totalMinutes = 0;
                          let validSum = true;

                          segments.forEach((seg, idx) => {
                            let sDuration = seg.duration;
                            if (!sDuration) {
                              sDuration = calculateDuration(seg.departureTime, seg.arrivalTime, seg.departureDate, seg.arrivalDate, seg.origin, seg.destination) || '';
                            }
                            const sNum = getNums(sDuration);
                            if (sNum.length >= 2) {
                              totalMinutes += (sNum[0] * 60) + sNum[1];
                            } else {
                              validSum = false;
                            }

                            // Add connection if not last segment
                            if (idx < segments.length - 1) {
                              const connStr = calculateConnectionTime(seg.arrivalTime, segments[idx + 1].departureTime);
                              const cNum = getNums(connStr);
                              if (cNum.length >= 2) {
                                totalMinutes += (cNum[0] * 60) + cNum[1];
                              }
                            }
                          });

                          if (validSum && totalMinutes > 0) {
                            return `${Math.floor(totalMinutes / 60).toString().padStart(2, '0')}h ${(totalMinutes % 60).toString().padStart(2, '0')} min`;
                          }
                        }

                        // 2. Single segment or fallback for length 1
                        if (segments.length === 1) {
                          const s = segments[0];
                          const dStr = s.duration || calculateDuration(s.departureTime, s.arrivalTime, s.departureDate, s.arrivalDate, s.origin, s.destination);
                          if (dStr) {
                            const nums = getNums(dStr);
                            if (nums.length >= 2) {
                              return `${nums[0].toString().padStart(2, '0')}h ${nums[1].toString().padStart(2, '0')} min`;
                            }
                            return dStr;
                          }
                        }

                        // 3. Last fallback (itemDuration if provided)
                        if (itemDuration && typeof itemDuration === 'string') {
                          const nums = getNums(itemDuration);
                          if (nums.length >= 2) {
                            return `${nums[0].toString().padStart(2, '0')}h ${nums[1].toString().padStart(2, '0')} min`;
                          }
                        }
                      } catch (err) {}
                      return '--:--';
                    })()}
                  </span>
               </div>

               {/* Timeline Line */}
               <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-100 flex items-center justify-around translate-y-[-50%]">
                  <div className="w-2 h-2 rounded-full border-2 border-slate-200 bg-white" />
                  {hasConnections && (
                    <div className={`w-2 h-2 rounded-full ${type === 'Ida' ? 'bg-cyan-400 shadow-cyan-400/50' : 'bg-purple-400 shadow-purple-400/50'} shadow-sm`} />
                  )}
                  <div className="w-2 h-2 rounded-full border-2 border-slate-200 bg-white" />
               </div>
               
               {/* Badge centered absolutely */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-1">
                  <span className="relative z-10 text-[7px] sm:text-[9px] font-black uppercase text-slate-400 bg-white px-2 py-0.5 sm:px-3 sm:py-1 border border-slate-100 rounded-full tracking-[0.1em] sm:tracking-[0.15em] whitespace-nowrap shadow-sm">
                    {hasConnections ? 'Conexão' : 'Direto'}
                  </span>
               </div>
            </div>

            {/* Right Block - Arrival */}
            <div className="text-right flex-1 sm:w-[200px] flex flex-col items-end justify-start">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{lastSeg?.arrivalTime ? fmt(lastSeg.arrivalTime) : '--:--'}</p>
              <div className="mt-1 h-6 sm:h-7 flex items-start justify-end overflow-hidden">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 leading-tight tracking-tight uppercase text-right">
                  {correctAirportName(lastSeg?.destination || '', airportInfo[lastSeg?.destination || '']?.name || lastSeg?.destination || '---')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-6 pt-4 border-t border-slate-50 bg-[#fafbfc] animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-slate-200 border-l border-white shadow-sm" />

                <div className="space-y-8">
                  {segments.map((seg, sidx) => {
                    const nextSeg = segments[sidx + 1];
                    const connectionTime = nextSeg ? calculateConnectionTime(seg.arrivalTime, nextSeg.departureTime) : null;

                    return (
                      <div key={sidx} className="relative group/seg">
                        {/* Segment Timeline Block */}
                        <div className="flex gap-8 items-start">
                           {/* Dots Column */}
                           <div className="flex flex-col items-center gap-1 mt-1 shrink-0 z-10">
                              <div className="w-12 h-12 bg-white rounded-2xl border-2 border-slate-100 shadow-sm flex items-center justify-center group-hover/seg:border-cyan-300 transition-colors">
                                 <Plane className="w-5 h-5 text-slate-400 group-hover/seg:text-cyan-500 transition-colors" />
                              </div>
                           </div>

                           {/* Info Column */}
                           <div className="flex-1">
                              <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all duration-300">
                                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                    <div className="flex items-center gap-4">
                                       <AirlineLogo name={seg.airline || 'LATAM'} />
                                       <div className="h-6 w-px bg-slate-100 hidden md:block" />
                                       <div className="flex flex-col">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Voo</p>
                                          <p className="text-sm font-black text-slate-800 font-mono tracking-tighter">{seg.flightNumber || '---'}</p>
                                       </div>
                                       <div className="h-6 w-px bg-slate-100 hidden md:block" />
                                       <div className="flex flex-col">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Classe</p>
                                          <p className="text-sm font-black text-slate-800">{seg.flightClass || 'Econômica'}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100/50">
                                       <Clock className="w-3.5 h-3.5 text-slate-400" />
                                       <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">
                                          Duração: {seg.duration || calculateDuration(seg.departureTime, seg.arrivalTime, seg.departureDate, seg.arrivalDate, seg.origin, seg.destination) || '--'}
                                       </span>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex gap-4">
                                       <div className="flex flex-col items-center">
                                          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white ring-4 ring-slate-100/30" />
                                       </div>
                                       <div className="space-y-1">
                                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{formatDate(seg.departureDate)}</p>
                                          <div className="flex items-baseline gap-2">
                                             <span className="text-2xl font-black text-slate-900">{fmt(seg.departureTime) || '--:--'}</span>
                                             <span className="text-base font-black text-slate-400">{seg.origin}</span>
                                          </div>
                                          <p className="text-xs font-bold text-slate-500 opacity-60">
                                             {correctAirportName(seg.origin, airportInfo[seg.origin]?.name || `Aeroporto ${seg.origin}`)}
                                          </p>
                                       </div>
                                    </div>

                                    <div className="flex gap-4">
                                       <div className="flex flex-col items-center">
                                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-white ring-4 ring-cyan-100/30" />
                                       </div>
                                       <div className="space-y-1">
                                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{seg.arrivalDate ? formatDate(seg.arrivalDate) : formatDate(seg.departureDate)}</p>
                                          <div className="flex items-baseline gap-2">
                                             <span className="text-2xl font-black text-slate-900">{fmt(seg.arrivalTime) || '--:--'}</span>
                                             <span className="text-base font-black text-slate-400">{seg.destination}</span>
                                          </div>
                                          <p className="text-xs font-bold text-slate-500 opacity-60">
                                             {correctAirportName(seg.destination, airportInfo[seg.destination]?.name || `Aeroporto ${seg.destination}`)}
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {/* Connection Display */}
                              {connectionTime && (
                                <div className="my-8 relative">
                                   <div className="absolute left-[-23px] top-1/2 w-[23px] h-px border-t-2 border-dashed border-slate-200" />
                                   <div className="bg-orange-50/80 backdrop-blur-sm border border-orange-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                                      <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 bg-orange-100/50 rounded-xl flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-orange-600" />
                                         </div>
                                         <div>
                                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">Conexão em {seg.destination}</p>
                                            <p className="text-sm font-black text-orange-900 uppercase">Aguarde por {connectionTime}</p>
                                         </div>
                                      </div>
                                      <Info className="w-4 h-4 text-orange-300" />
                                   </div>
                                </div>
                              )}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>

             <div className="mt-8 bg-slate-50/50 rounded-[28px] p-5 border border-slate-100 shadow-inner group/baggage">
                <div className="flex items-center gap-3 mb-5 px-1">
                   <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-cyan-600 border border-cyan-100">
                      <Luggage className="w-4 h-4" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Confira sua franquia</p>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">POLÍTICA DE BAGAGENS INCLUSAS</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   {(() => {
                      const airline = segments[0]?.airline?.toLowerCase() || '';
                      const isLatamGol = airline.includes('latam') || airline.includes('gol');
                      
                      const baggageRules = [
                        { 
                          label: 'Item Pessoal', 
                          weight: isLatamGol ? '10kg' : '5kg',
                          val: segments[0]?.personalItem ?? 1,
                          icon: <Briefcase className="w-5 h-5" />,
                          desc: 'Abaixo do assento'
                        },
                        { 
                          label: 'Mala de Mão', 
                          weight: isLatamGol ? '12kg' : '10kg',
                          val: segments[0]?.carryOn ?? 1,
                          icon: <Luggage className="w-5 h-5" />,
                          desc: 'Bagageiro superior'
                        },
                        { 
                          label: 'Despachada', 
                          weight: '23kg',
                          val: segments[0]?.checkedBag23kg ?? 0,
                          icon: <Luggage className="w-5 h-5" />,
                          desc: 'No porão do avião'
                        }
                      ];

                      return baggageRules.map((b) => (
                        <div key={b.label} className={`relative p-4 rounded-2xl border transition-all duration-300 ${b.val > 0 ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-100/30 border-dashed border-slate-200 opacity-60'}`}>
                           <div className="flex justify-between items-start mb-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${b.val > 0 ? 'bg-cyan-50 text-cyan-600' : 'bg-slate-100 text-slate-400'}`}>
                                 {b.icon}
                              </div>
                              <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight ${b.val > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-200 text-slate-500'}`}>
                                 {b.val > 0 ? `${b.val}x Incluso` : 'Não incluso'}
                              </div>
                           </div>
                           <div>
                              <div className="flex items-baseline gap-1.5 mb-1">
                                 <h4 className={`text-[11px] font-black uppercase tracking-tight ${b.val > 0 ? 'text-slate-800' : 'text-slate-400'}`}>{b.label}</h4>
                                 <span className={`text-[13px] font-black ${b.val > 0 ? 'text-cyan-600' : 'text-slate-400'}`}>{b.weight}</span>
                              </div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{b.desc}</p>
                           </div>
                        </div>
                      ));
                   })()}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
                   <Info className="w-3 h-3 text-slate-300" />
                   <p className="text-[9px] text-slate-400 font-bold italic uppercase tracking-tighter">Franquia por passageiro adulto. Sujeito às regras tarifárias da Cia Aérea.</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FlightItemCard({ item, lead, airportInfo }: { item: LeadItem; lead: Lead; airportInfo: Record<string, any> }) {
  const outbound = item.outboundSegments || [];
  const inbound = item.inboundSegments || [];

  if (item.flightType === 'multi' && Array.isArray(item.multiLegs)) {
    return (
      <div className="space-y-6">
        {item.multiLegs.map((leg: any, idx: number) => (
          <FlightLegCard 
            key={leg.id || idx}
            segments={leg.segments || []} 
            type={leg.label || `Trecho ${idx + 1}`} 
            lead={lead} 
            airportInfo={airportInfo} 
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
       {outbound.length > 0 && (
         <FlightLegCard 
            segments={outbound} 
            type="Ida" 
            lead={lead} 
            itemDuration={item.duration} 
            airportInfo={airportInfo}
         />
       )}
       {item.flightType === 'ida_volta' && inbound.length > 0 && (
          <FlightLegCard 
             segments={inbound} 
             type="Volta" 
             lead={lead} 
             itemDuration={item.returnDuration} 
             airportInfo={airportInfo}
          />
       )}
    </div>
  );
}

function HotelItemCard({ item, fallbackCheckIn, fallbackCheckOut }: { 
  item: LeadItem; 
  fallbackCheckIn?: string; 
  fallbackCheckOut?: string; 
}) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const getFallbackDates = () => {
    if (item.checkInDate && item.checkOutDate) return { checkIn: item.checkInDate, checkOut: item.checkOutDate };
    return { checkIn: fallbackCheckIn, checkOut: fallbackCheckOut };
  };

  const { checkIn, checkOut } = getFallbackDates();

  return (
    <>
      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500 group/hotel mb-8">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#19727d] to-cyan-400" />
        
        {/* CARROSSEL DE FOTOS DO HOTEL */}
        {(() => {
          const rawPhotos = item.hotelPhotos || item.hotelImages || [];
          const photos = rawPhotos.map(normalizePhotoUrl).filter(url => !!url);
          if (photos.length === 0) return (
            <div className="h-64 bg-slate-50 flex flex-col items-center justify-center gap-2 border-b border-slate-100">
              <Hotel className="w-8 h-8 text-slate-200" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fotos não disponíveis</p>
            </div>
          );

          return (
            <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-slate-200">
              <img 
                src={photos[activePhoto]} 
                alt={item.hotelName || 'Hotel'} 
                className="w-full h-full object-cover transition-all duration-700 group-hotel:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 z-20 shadow-2xl">
                 <Hotel className="w-4 h-4" />
                 {activePhoto + 1} / {photos.length}
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto pb-2 no-print z-20 scrollbar-hide">
                {photos.map((photo, idx) => (
                  <button 
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActivePhoto(idx); }}
                    className={`relative w-20 h-14 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activePhoto === idx ? 'border-cyan-400 scale-110 shadow-2xl z-30' : 'border-white/20 hover:border-white/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={photo} 
                      className="w-full h-full object-cover" 
                      alt="" 
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        <div className="p-4 sm:p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#19727d] flex items-center justify-center text-white shadow-xl shadow-[#19727d]/20 shrink-0 transform group-hover/hotel:rotate-3 transition-transform duration-500">
                <Hotel className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-black text-[#19727d] uppercase tracking-[0.3em] leading-none mb-1.5">Hospedagem</p>
                <h3 className="font-black text-xl sm:text-3xl text-slate-900 tracking-tight leading-tight max-w-[280px] sm:max-w-none">{item.hotelName || 'Nome do Hotel'}</h3>
              </div>
            </div>

            <div className="flex flex-row flex-wrap sm:flex-col items-center sm:items-end gap-2 sm:gap-3 shrink-0">
               <div className="flex bg-white border border-slate-100 rounded-xl p-1.5 sm:p-2 gap-2 sm:gap-4 shadow-sm">
                  <div className="text-center px-1 sm:px-2.5">
                     <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase leading-none mb-1 tracking-tight">Check-in</p>
                     <p className="text-[11px] sm:text-[13px] font-black text-[#19727d] leading-none">{checkIn ? formatDate(checkIn) : '--/--/--'}</p>
                  </div>
                  <div className="w-px bg-slate-100" />
                  <div className="text-center px-1 sm:px-2.5">
                     <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase leading-none mb-1 tracking-tight">Check-out</p>
                     <p className="text-[11px] sm:text-[13px] font-black text-[#19727d] leading-none">{checkOut ? formatDate(checkOut) : '--/--/--'}</p>
                  </div>
               </div>

               {(item.hasBreakfast || item.boardBasis?.toLowerCase().includes('café')) && (
                <div className="flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-orange-50 border border-orange-100 rounded-xl shadow-sm h-fit">
                    <Coffee className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-orange-700 tracking-tight whitespace-nowrap">Café incluso</span>
                 </div>
               )}
            </div>
          </div>

          {item.hotelAddress && (
            <div className="flex items-center gap-2.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <p className="text-[11px] font-bold text-slate-500">{item.hotelAddress}</p>
            </div>
          )}

          {/* O QUE ESTE HOTEL OFERECE (DESIGN ULTRA-COMPACTO) */}
          {item.hotelAmenities && item.hotelAmenities.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-500 border border-cyan-100/50 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                 </div>
                 <h3 className="text-base font-black text-slate-900 tracking-tight">O que este hotel oferece</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {item.hotelAmenities.slice(0, 5).map((a, idx) => {
                  const resolved = resolveAmenity(a);
                  const Icon = resolved.icon as any;
                  return (
                    <div key={idx} className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm hover:border-cyan-100 transition-all group/item cursor-default overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-cyan-50/50 flex items-center justify-center shrink-0 group-hover/item:bg-cyan-50 transition-colors border border-cyan-100/20">
                        <Icon className="w-3.5 h-3.5 text-cyan-600" />
                      </div>
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight leading-tight group-hover/item:text-slate-900 line-clamp-1">
                        {resolved.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button 
            onClick={() => setShowDetails(true)}
            className="w-full group/btn relative overflow-hidden h-14 rounded-2xl bg-slate-900 text-white transition-all duration-300 hover:shadow-2xl hover:shadow-[#19727d]/30 active:scale-[0.98] mt-2 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#19727d] to-[#24a1b0] opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center justify-center gap-3 font-black text-[13px] uppercase tracking-[0.1em]">
              <Images className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              <span>VER GALERIA E DETALHES</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" />
            </div>
            <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <HotelDetailsModal 
            item={item} 
            onClose={() => setShowDetails(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

function HotelMiniMap({ address, hotelName }: { address: string; hotelName: string }) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !address) return;

    const L = (window as any).L;
    if (!L) return;

    let map: any;

    const initMap = async () => {
      try {
        // Geocodificação simples via Nominatim (OpenStreetMap)
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
        const data = await response.json();

        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          if (mapRef.current) mapRef.current.remove();

          map = L.map(containerRef.current, {
            zoomControl: true,
            attributionControl: false,
            scrollWheelZoom: false
          }).setView([lat, lon], 15);

          mapRef.current = map;

          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
          }).addTo(map);

          const hotelIcon = L.divIcon({
            className: 'custom-hotel-icon',
            html: `<div style="background-color: #19727d; width: 12px; height: 12px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(25, 114, 125, 0.6);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });

          L.marker([lat, lon], { icon: hotelIcon }).addTo(map);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao carregar mini mapa:", error);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [address]);

  if (!address) return null;

  return (
    <div className="relative flex-1 h-32 sm:h-40 group/map min-w-[200px]">
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-2xl border border-slate-100 shadow-inner overflow-hidden bg-slate-50"
      />
      {loading && (
        <div className="absolute inset-0 bg-slate-50/80 flex items-center justify-center rounded-2xl">
          <RefreshCw className="w-5 h-5 text-slate-300 animate-spin" />
        </div>
      )}
      <div className="absolute top-2 left-2 pointer-events-none">
        <div className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest">
           Localização
        </div>
      </div>
    </div>
  );
}

function HotelDetailsModal({ item, onClose }: { item: LeadItem, onClose: () => void }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 no-print"
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-full sm:max-w-6xl bg-white rounded-t-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in fade-in zoom-in duration-300"
      >
        {/* HEADER MODAL */}
        <div className="relative h-24 sm:h-72 flex-shrink-0 bg-slate-100">
          {(() => {
            const firstPhoto = normalizePhotoUrl(item.hotelPhotos?.[0] || item.hotelImages?.[0]);
            if (!firstPhoto) return null;
            return (
              <img 
                src={firstPhoto} 
                className="w-full h-full object-cover" 
                alt={item.hotelName || 'Hotel'} 
                referrerPolicy="no-referrer"
              />
            );
          })()}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-black/40" />
          
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 p-2 sm:p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all hover:rotate-90 z-50 shadow-xl"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-3">
               <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-cyan-500 text-white text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-cyan-500/20">
                  Reserva Confirmada
               </div>
               <div className="h-px w-6 sm:w-8 bg-slate-300" />
            </div>
            <h2 className="text-lg sm:text-5xl font-black text-gray-900 tracking-tighter leading-tight shadow-sm line-clamp-1 sm:line-clamp-none">{item.hotelName}</h2>
            {item.hotelAddress && (
              <div className="flex items-center gap-1 mt-0.5 sm:mt-4 text-slate-600 font-bold text-[8px] sm:text-sm bg-white/60 backdrop-blur-md w-fit px-1.5 py-0.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-2xl border border-white/40">
                <MapPin className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-cyan-600" />
                <span className="line-clamp-1 sm:line-clamp-none">{item.hotelAddress}</span>
              </div>
            )}
          </div>
        </div>

        {/* CONTEÚDO UNIFICADO */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-8 custom-scrollbar bg-slate-50/30">
          <div className="space-y-4 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* CHECK-IN / CHECK-OUT NO MODAL - LAYOUT DE LINHA ÚNICA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-4">
              {item.checkInDate && (
                <div className="bg-white border border-slate-100 rounded-lg sm:rounded-3xl py-1.5 px-3 sm:p-6 shadow-sm flex items-center justify-between gap-2">
                  <p className="text-[9px] sm:text-[10px] font-black text-[#19727d] uppercase tracking-widest flex items-center gap-1.5 min-w-[70px]">
                     <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> Check-in
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] sm:text-xl font-black text-slate-800">{formatDate(item.checkInDate)}</p>
                    <p className="text-[9px] sm:text-sm font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> {item.checkInTime || '14:00'}
                    </p>
                  </div>
                </div>
              )}
              {item.checkOutDate && (
                <div className="bg-white border border-slate-100 rounded-lg sm:rounded-3xl py-1.5 px-3 sm:p-6 shadow-sm flex items-center justify-between gap-2">
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 min-w-[70px]">
                     <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4 rotate-180" /> Check-out
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] sm:text-xl font-black text-slate-800">{formatDate(item.checkOutDate)}</p>
                    <p className="text-[9px] sm:text-sm font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> {item.checkOutTime || '12:00'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* REGIME DE ALIMENTAÇÃO NO MODAL INTEGRADO COM MINI MAPA */}
            {(item.hasBreakfast || (item.boardBasis && item.boardBasis.toLowerCase().includes('café'))) && (
              <div className="bg-white border border-slate-100 rounded-[20px] sm:rounded-[32px] p-1.5 sm:p-2.5 pr-3 sm:pr-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-4 pl-1 sm:pl-4 min-w-0 sm:min-w-[220px]">
                  <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100/50">
                    <Coffee className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-tight text-[9px] sm:text-sm whitespace-nowrap">Café da manhã incluso</h4>
                    <p className="hidden sm:block text-[8px] sm:text-[10px] font-bold text-slate-400 leading-tight">Incluso nesta reserva</p>
                  </div>
                </div>

                {/* MINI MAPA À DIREITA - AGORA EM FLEX-1 */}
                {item.hotelAddress && (
                  <div className="w-full sm:flex-1">
                     <HotelMiniMap address={item.hotelAddress} hotelName={item.hotelName || ''} />
                  </div>
                )}
              </div>
            )}

            {/* DESCRIÇÃO */}
            {item.hotelDescription && (
              <div className="bg-white rounded-xl sm:rounded-3xl p-3 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-6">
                  <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
                    <FileText className="w-3 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-black text-[11px] sm:text-xl text-gray-800 tracking-tight">Sobre a Propriedade</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-[10.5px] sm:text-sm font-medium whitespace-pre-wrap line-clamp-4 sm:line-clamp-none">{item.hotelDescription}</p>
              </div>
            )}

            {/* COMODIDADES NO MODAL (IGUAL À IMAGEM) */}
            {item.hotelAmenities && item.hotelAmenities.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-505 border border-cyan-100/50 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-xl text-gray-900 tracking-tight">O que este hotel oferece</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {item.hotelAmenities.slice(0, 5).map((amenity: string, idx: number) => {
                    const resolved = resolveAmenity(amenity);
                    const Icon = resolved.icon as any;
                    return (
            <div key={idx} className="flex items-center gap-2 sm:gap-3 bg-white p-1.5 sm:p-3 rounded-lg sm:rounded-2xl border border-slate-100 shadow-sm group hover:border-cyan-200 hover:shadow-md transition-all">
                        <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-cyan-50/50 flex items-center justify-center shrink-0 group-hover:bg-cyan-50 transition-colors border border-cyan-100/20">
                          <Icon className="w-3 sm:w-4 sm:h-4 text-cyan-600" />
                        </div>
                        <span className="text-[7.5px] sm:text-[10px] font-black text-slate-700 uppercase tracking-tight leading-tight">{resolved.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GALERIA DE FOTOS INTEGRADA */}
            {(() => {
              const rawPhotos = item.hotelPhotos || item.hotelImages || [];
              const photos = rawPhotos.map(normalizePhotoUrl).filter(url => !!url);
              if (photos.length === 0) return null;

              return (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100/50">
                      <LayoutGrid className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl text-gray-900 tracking-tight leading-none mb-1">Galeria Completa</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Explore cada detalhe da sua estadia</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((photo: string, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => setSelectedImage(photo)}
                        className="relative aspect-[4/3] rounded-[28px] overflow-hidden group hover:ring-8 ring-cyan-500/10 transition-all shadow-lg bg-slate-100"
                      >
                        <img 
                          src={photo} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" 
                          alt="Foto do hotel" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                             <LayoutGrid className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </motion.div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-[85vh] flex items-center justify-center"
            >
              <img 
                src={selectedImage} 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
                alt="Preview" 
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <button className="absolute top-8 right-8 text-white hover:text-cyan-400 transition-colors p-2">
              <X className="w-10 h-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TransferItemCard({ item }: { item: any }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-100/50 group hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
      <div className="h-2 w-full bg-gradient-to-r from-cyan-500 to-blue-600" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 border border-cyan-100 shadow-sm transition-transform group-hover:scale-110">
                 <Car className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">Serviço de Translado</p>
                 <h3 className="text-xl font-black text-slate-800 tracking-tight">{item.description}</h3>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {item.transfer_in && (
              <div className="flex items-center gap-4 p-4 bg-cyan-50/50 rounded-2xl border border-cyan-100/50">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Plane className="w-5 h-5 text-cyan-600" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-cyan-700 uppercase tracking-widest leading-none mb-1">Chegada</p>
                    <p className="text-xs font-black text-slate-700 uppercase">Aeroporto → Hotel</p>
                 </div>
              </div>
           )}
           {item.transfer_out && (
              <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Hotel className="w-5 h-5 text-purple-600" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-purple-700 uppercase tracking-widest leading-none mb-1">Partida</p>
                    <p className="text-xs font-black text-slate-700 uppercase">Hotel → Aeroporto</p>
                 </div>
              </div>
           )}
        </div>

        {item.notes && (
           <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <FileText className="w-3 h-3" /> Observações importante
              </p>
              <p className="text-xs font-bold text-slate-600 leading-relaxed italic">&quot;{item.notes}&quot;</p>
           </div>
        )}
      </div>
    </div>
  );
}

function OtherItemCard({ item }: { item: LeadItem }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-1.5 w-full bg-[#19727d]" />
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#19727d] border border-slate-100 shadow-sm transition-transform group-hover:scale-110">
            <TypeIcon type={item.type} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1"><TypeLabel type={item.type} /></p>
            {item.description && <p className="font-black text-slate-800 text-sm tracking-tight">{item.description}</p>}
          </div>
        </div>
        <div className="flex items-center text-slate-300">
           <ArrowRight className="w-4 h-4" />
        </div>
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
  const [fallbackRates, setFallbackRates] = useState<{USD: number, EUR: number, GBP: number} | null>(null);
  const [showAllInstallments, setShowAllInstallments] = useState(false);
  const { isIntl, region: tripRegion } = checkInternational(lead || undefined);

  useEffect(() => {
    if (!id) return;
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRates = async () => {
    try {
      const res = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL');
      const data = await res.json();
      if (data) {
        setFallbackRates({
          USD: parseFloat(data.USDBRL?.bid || '0'),
          EUR: parseFloat(data.EURBRL?.bid || '0'),
          GBP: parseFloat(data.GBPBRL?.bid || '0')
        });
      }
    } catch (err) {
      console.error('Erro ao buscar câmbio fallback:', err);
    }
  };

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
        usd_rate: parseFloat(data.usd_rate || '0'),
        eur_rate: parseFloat(data.eur_rate || '0'),
        gbp_rate: parseFloat(data.gbp_rate || '0'),
        fees_type: data.fees_type,
        fees_installments: data.fees_installments,
      });
      // Se não tiver câmbio salvo, busca fallback
      if (!data.usd_rate || parseFloat(data.usd_rate) === 0) {
        fetchRates();
      }
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const flights = useMemo(() => (lead?.items || []).filter(i => i.type === 'passagem'), [lead?.items]);
  const hotels = useMemo(() => (lead?.items || []).filter(i => i.type === 'hospedagem'), [lead?.items]);
  const transfers = useMemo(() => (lead?.items || []).filter(i => i.type === 'translado'), [lead?.items]);
  const others = useMemo(() => (lead?.items || []).filter(i => !['passagem', 'hospedagem', 'translado'].includes(i.type)), [lead?.items]);
  const whatsappMsg = useMemo(() => encodeURIComponent(`Olá! Vi a cotação "${lead?.title || lead?.name || ''}" enviada pela Easy Fly e gostaria de mais informações.`), [lead?.title, lead?.name]);

  const allIatas = useMemo(() => {
    if (!lead?.items) return [];
    try {
      return Array.from(new Set(lead.items.flatMap(item => {
        if (item.type !== 'passagem') return [];
        const outSegments = Array.isArray(item.outboundSegments) ? item.outboundSegments : [];
        const incSegments = Array.isArray(item.inboundSegments) ? item.inboundSegments : [];
        const multiSegments = item.flightType === 'multi' && Array.isArray(item.multiLegs) 
            ? item.multiLegs.flatMap((l: any) => l.segments || []) 
            : [];
            
        const out = outSegments.flatMap((s: any) => [s.origin, s.destination]);
        const inc = incSegments.flatMap((s: any) => [s.origin, s.destination]);
        const multi = multiSegments.flatMap((s: any) => [s.origin, s.destination]);
        
        return [...out, ...inc, ...multi];
      }).filter(iata => iata && typeof iata === 'string' && iata.length === 3) as string[]));
    } catch (e) {
      return [];
    }
  }, [lead?.items]);

  const { airportInfo } = useAirportResolver(allIatas);

  const tripDuration = useMemo(() => {
    const flight = flights[0];
    
    const getDurationText = (days: number) => {
      if (days <= 0) return null;
      const nights = days - 1;
      const daysText = `${days} ${days === 1 ? 'dia' : 'dias'}`;
      const nightsText = `${nights} ${nights === 1 ? 'noite' : 'noites'}`;
      return `${daysText} e ${nightsText}`;
    };

    if (!flight) {
      const d = parseInt(lead?.duration || '0');
      return d > 0 ? getDurationText(d) : null;
    }

    const hasInbound = flights.some(f => f.flightType === 'ida_volta' && (f.inboundSegments?.length || 0) > 0);
    const hasReturnLeg = flights.some(f => {
      if (f.flightType === 'multi' && (f.multiLegs?.length || 0) > 1) return true;
      return false;
    });
    const isRoundTrip = hasInbound || hasReturnLeg || flights.length > 2;

    if (!isRoundTrip && String(flight.flightType) === 'ida' && flights.length === 1) return 'Somente Ida';
    
    const allOutbound = flights.flatMap(f => Array.isArray(f.outboundSegments) ? f.outboundSegments : []);
    const allInbound = flights.flatMap(f => Array.isArray(f.inboundSegments) ? f.inboundSegments : []);
    const allMulti = flights.flatMap(f => f.flightType === 'multi' && Array.isArray(f.multiLegs) 
      ? f.multiLegs.flatMap((l: any) => l.segments || []) 
      : []);

    const allSegments = [...allOutbound, ...allInbound, ...allMulti].filter(s => s.departureDate);
    // Sort segments by date (if possible) or just pick first and last assuming lead order
    const firstSeg = allSegments[0];
    const lastSeg = allSegments[allSegments.length - 1];

    const startStr = firstSeg?.departureDate;
    const endStr = lastSeg?.arrivalDate || lastSeg?.departureDate;
    
    if (!startStr || !endStr) {
      const d = parseInt(lead?.duration || '0');
      return d > 0 ? getDurationText(d) : null;
    }

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
      return diffDays > 0 ? getDurationText(diffDays) : null;
    } catch {
      const d = parseInt(lead?.duration || '0');
      return d > 0 ? getDurationText(d) : null;
    }
  }, [flights, lead?.duration]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#19727d]/5 to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto animate-pulse">
            <Image src={AGENCY.logoUrl} alt="Easy Fly" width={40} height={40} className="w-10 h-10 object-contain" />
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
            <Image src={AGENCY.logoUrl} alt="Easy Fly" width={48} height={48} className="w-12 h-12 object-contain" />
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

  // FALLBACK DE DATAS PARA HOTEL (CASO O ITEM NÃO TENHA DATAS PRÓPRIAS)
  const getFallbackDates = () => {
    const flight = flights[0];
    if (!flight) return { checkIn: undefined, checkOut: undefined };
    const outbound = Array.isArray(flight.outboundSegments) ? flight.outboundSegments : [];
    const inbound = Array.isArray(flight.inboundSegments) ? flight.inboundSegments : [];
    const start = outbound[0]?.departureDate;
    const end = inbound[inbound.length - 1]?.departureDate || inbound[inbound.length - 1]?.arrivalDate;
    return { checkIn: start, checkOut: end };
  };

  const { checkIn: fIn, checkOut: fOut } = getFallbackDates();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 font-sans">
      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 8mm; }
          html, body { zoom: 0.85 !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; color: #000 !important; font-size: 10pt !important; line-height: 1.1 !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          
          /* COMPACTAÇÃO EXTREMA */
          section { margin-bottom: 0.5rem !important; break-inside: avoid; border-bottom: none !important; padding-bottom: 0.5rem !important; }
          .p-8, .p-10, .p-6, .p-5 { padding: 0.75rem !important; }
          .mb-12, .mb-10, .mb-8, .mb-6 { margin-bottom: 0.4rem !important; }
          .mt-12, .mt-10, .mt-8 { margin-top: 0.4rem !important; }
          .gap-10, .gap-8, .gap-6, .gap-4 { gap: 0.25rem !important; }
          .rounded-[32px], .rounded-[2.5rem] { border-radius: 12px !important; }
          
          /* TEXT COMPRESSION */
          h1 { font-size: 16pt !important; margin-bottom: 0.25rem !important; }
          h2 { font-size: 12pt !important; margin-bottom: 0.2rem !important; }
          h3 { font-size: 11pt !important; }
          .text-5xl, .text-6xl { font-size: 20pt !important; }
          p, span, div { font-size: 9pt !important; }

          /* MAP & CONTACT COMPRESSION */
          #main-travel-map { height: 180px !important; margin-bottom: 0.5rem !important; }
          .w-32.h-32 { width: 50px !important; height: 50px !important; padding: 0.25rem !important; margin-bottom: 0.25rem !important; }
          .w-16.h-16 { width: 40px !important; height: 40px !important; }
          .p-10.pt-8.pb-12 { padding: 0.5rem !important; }
          
          /* HEADER RE-STYLED FOR PRINT */
          header { border-bottom: 2px solid #000; padding-bottom: 0.5rem !important; margin-bottom: 1rem !important; background: none !important; }
          header * { color: black !important; }
          
          footer { padding: 1rem 0 !important; margin-top: 1rem !important; border-top: 1px solid #eee; }
          
          .shadow-xl, .shadow-2xl, .shadow-sm { box-shadow: none !important; border: 1px solid #f1f5f9 !important; }
          .grid-cols-1, .grid-cols-2 { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 0.5rem !important; }
        }
        .print-only { display: none; }
      `}</style>
      
      {/* CABEÇALHO DE IMPRESSÃO (PAPEL TIMBRADO) */}
      <div className="print-only w-full border-b-2 border-slate-900 pb-10 mb-10">
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
               <Image src={AGENCY.logoUrl} alt="Logo" width={96} height={96} className="w-24 h-24 object-contain" />
               <div>
                  <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{AGENCY.name}</h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{AGENCY.legalName}</p>
                  <p className="text-[10px] font-medium text-slate-500 mt-1">{AGENCY.address}</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Orçamento Oficial</p>
               <p className="text-[10px] font-bold text-slate-400">PROPOSTA Nº: {lead.id.substring(0, 8).toUpperCase()}</p>
               <p className="text-[10px] font-bold text-slate-400">DATA: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
         </div>
      </div>

      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="afterInteractive" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      <header className="bg-gradient-to-br from-[#19727d] via-[#1a8090] to-[#0d5c66] text-white relative overflow-hidden no-print">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-10">
          {/* Logo e Consultor na mesma linha */}
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-6 mb-5 sm:mb-10">
            <div className="flex items-center gap-3 sm:gap-6 min-w-0">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-[2rem] bg-white flex items-center justify-center shadow-xl flex-shrink-0 p-2 sm:p-2.5 transform hover:scale-105 transition-transform">
                <Image src={AGENCY.logoUrl} alt="Easy Fly" width={80} height={80} className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="font-black text-white text-xl sm:text-4xl leading-tight tracking-tighter truncate">Easy Fly</p>
                <p className="text-white/70 text-[11px] sm:text-base uppercase tracking-[0.1em] sm:tracking-[0.2em] font-black truncate">Agência de Viagens</p>
              </div>
            </div>

            {lead.emissor && (
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-white/20 shadow-lg shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
                  <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-300" />
                </div>
                <div className="text-center">
                  <p className="text-[8px] sm:text-[10px] text-white/50 font-black uppercase tracking-widest leading-none mb-0.5 sm:mb-1">Consultor</p>
                  <p className="text-[10px] sm:text-sm font-black text-white leading-none truncate max-w-[80px] sm:max-w-none">{lead.emissor}</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center space-y-2 sm:space-y-5">
            {/* Badge Premium Minimalista */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black text-white border border-white/20 shadow-lg tracking-widest uppercase mb-1">
                 <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                 <span>Proposta de Viagem</span>
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tighter leading-[1.02] max-w-3xl mx-auto drop-shadow-2xl">
              {lead.title || 'Sua Próxima Aventura'}
            </h1>
            {lead.name && (
              <h2 className="text-xl sm:text-4xl font-black text-white/90 tracking-tighter leading-tight max-w-3xl mx-auto drop-shadow-xl mt-0.5 italic">
                {lead.name}
              </h2>
            )}

            {/* Barra de Resumo Horizontal (High Density) */}
            <div className="flex justify-center mt-3 sm:mt-8">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden divide-x divide-white/10">
                {/* Seção Passageiros */}
                <div className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 hover:bg-white/5 transition-colors min-w-[120px] sm:min-w-[160px]">
                  <Users className="w-4 h-4 text-cyan-300" />
                  <div className="text-center">
                    <p className="text-[8px] text-white/50 font-black uppercase tracking-widest leading-none mb-1">Passageiros</p>
                    <p className="text-[11px] sm:text-sm font-black text-white leading-none whitespace-nowrap">
                      {[
                        (lead.adults || 0) > 0 ? `${lead.adults} Adulto${(lead.adults || 0) > 1 ? 's' : ''}` : null,
                        (lead.children || 0) > 0 ? `${lead.children} Criança${(lead.children || 0) > 1 ? 's' : ''}` : null,
                        (lead.babies || 0) > 0 ? `${lead.babies} Bebê${(lead.babies || 0) > 1 ? 's' : ''}` : null,
                      ].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                </div>

                {/* Seção Duração */}
                {tripDuration && (
                  <div className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 hover:bg-white/5 transition-colors min-w-[120px] sm:min-w-[160px]">
                    <Clock className="w-4 h-4 text-cyan-300" />
                    <div className="text-center">
                      <p className="text-[8px] text-white/50 font-black uppercase tracking-widest leading-none mb-1">Duração</p>
                      <p className="text-[11px] sm:text-sm font-black text-white leading-none whitespace-nowrap">{tripDuration}</p>
                    </div>
                  </div>
                )}
                

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-7">

        {flights.length > 0 && (
          <section>
            <SectionTitle icon={<Plane className="w-4 h-4" />} title="Voos" />
            
            {/* Mapa Consolidado da Rota Real */}
            <MainTravelMap lead={lead} flights={flights} airportInfo={airportInfo} />

            <div className="space-y-3">
              {flights.map(item => <FlightItemCard key={item.id} item={item} lead={lead} airportInfo={airportInfo} />)}
            </div>
          </section>
        )}

        {hotels.length > 0 && (
          <section>
            <SectionTitle icon={<Hotel className="w-4 h-4" />} title="Hospedagem" />
            <div className="space-y-3">
              {hotels.map(item => (
                <HotelItemCard 
                  key={item.id} 
                  item={item} 
                  fallbackCheckIn={fIn}
                  fallbackCheckOut={fOut}
                />
              ))}
            </div>
          </section>
        )}

        {transfers.length > 0 && (
          <section>
            <SectionTitle icon={<Car className="w-4 h-4" />} title="Translado" />
            <div className="space-y-4">
              {transfers.map(item => <TransferItemCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section>
            <SectionTitle icon={<Package className="w-4 h-4" />} title="Outros Serviços" />
            <div className="space-y-3">
              {others.map(item => <OtherItemCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {/* CHECKLIST DE REQUISITOS */}
        <section className="space-y-4">
          <SectionTitle icon={<ShieldAlert className="w-4 h-4" />} title="Checklist de embarque e segurança" />
          <TravelChecklist isIntl={isIntl} region={tripRegion} />
        </section>

        {/* VALORES */}
        {lead.value > 0 && (
          <section>
            <SectionTitle icon={<CreditCard className="w-4 h-4" />} title="Investimento" />
            <div className="bg-gradient-to-br from-[#19727d] to-[#0d5c66] rounded-2xl p-5 sm:p-6 text-white shadow-xl shadow-[#19727d]/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-5 md:mb-3">
                <div className="w-full">
                  <p className="text-white/70 text-sm font-bold uppercase tracking-widest leading-none mb-3">INVESTIMENTO TOTAL</p>
                  <div className="flex flex-row items-center gap-3">
                    <p className="text-4xl sm:text-5xl font-black tracking-tighter leading-none shrink-0">{formatCurrency(lead.value)}</p>
                    <div className="flex flex-wrap items-center gap-1.5 px-2.5 py-1.5 bg-white/10 rounded-xl border border-white/5">
                       <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider">À vista</span>
                       <div className="flex items-center gap-1.5">
                          {(lead.adults || 0) > 0 && (
                            <span className="text-[9px] sm:text-[10px] font-black text-cyan-200 uppercase tracking-tight">
                               {(lead.adults || 0)} {(lead.adults || 0) === 1 ? 'Adulto' : 'Adultos'}
                            </span>
                          )}
                          {(lead.children || 0) > 0 && (
                            <span className="text-[9px] sm:text-[10px] font-black text-cyan-200 uppercase tracking-tight">
                               • {(lead.children || 0)} {(lead.children || 0) === 1 ? 'Criança' : 'Crianças'}
                            </span>
                          )}
                          {(lead.babies || 0) > 0 && (
                            <span className="text-[9px] sm:text-[10px] font-black text-cyan-200 uppercase tracking-tight">
                               • {(lead.babies || 0)} {(lead.babies || 0) === 1 ? 'Bebê' : 'Bebês'}
                            </span>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
                {/* CÂMBIO E ÍCONE PRINCIPAL */}
                <div className="flex flex-wrap md:flex-col items-center md:items-end gap-3 shrink-0 self-start md:-mt-2 w-full md:w-auto overflow-hidden">
                   {/* CÂMBIO (SEGURO OU FALLBACK) */}
                   {(() => {
                     const isPersisted = lead.usd_rate > 0;
                     const displayRates = isPersisted ? 
                       { USD: lead.usd_rate, EUR: lead.eur_rate, GBP: lead.gbp_rate } : 
                       fallbackRates;

                     if (!displayRates || displayRates.USD <= 0) return null;

                     return (
                       <div className="flex gap-2.5 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                          {[
                            { code: 'USD', symbol: '$', rate: displayRates.USD },
                            { code: 'EUR', symbol: '€', rate: displayRates.EUR },
                            { code: 'GBP', symbol: '£', rate: displayRates.GBP }
                          ].filter(c => c.rate > 0).map(c => (
                            <div key={c.code} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 py-2.5 flex flex-col items-center min-w-[85px] shadow-sm flex-shrink-0 animate-in fade-in zoom-in duration-500">
                               <div className="flex items-center gap-1.5 mb-1">
                                  <span className="text-[8px] font-black text-cyan-300 tracking-widest leading-none">{c.code}</span>
                                  {isPersisted ? (
                                    <Clock className="w-2.5 h-2.5 text-cyan-300 opacity-60" />
                                  ) : (
                                    <RefreshCw className="w-2.5 h-2.5 text-cyan-300 animate-[spin_4s_linear_infinite]" />
                                  )}
                               </div>
                               <p className="text-[13px] font-black text-white leading-none">
                                  {c.symbol} {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(lead.value / c.rate)}
                                </p>
                               <p className="text-[8px] font-bold text-white/40 mt-1 uppercase tracking-tighter">R$ {c.rate.toFixed(2)}</p>
                            </div>
                          ))}
                       </div>
                     );
                   })()}
                </div>
              </div>

              <div className="border-t border-white/20 pt-3">
                <div className="flex items-center gap-2 mb-2">
                   <p className="text-white/70 text-sm font-bold uppercase tracking-widest leading-none">Parcelamento no cartão</p>
                   <CreditCard className="w-3.5 h-3.5 text-white/40" />
                </div>
                <div className={`grid ${showAllInstallments ? 'grid-cols-2' : 'grid-cols-1'} sm:grid-cols-4 gap-2`}>
                   {(() => {
                     const maxInstallments = lead.fees_installments || 12;
                     const type = lead.fees_type || 'interest_free';
                     
                     let allowedInstallments = showAllInstallments 
                        ? INSTALLMENTS.filter(n => n <= maxInstallments)
                        : INSTALLMENTS.filter(n => [6, 10, 12].includes(n) && n <= maxInstallments);

                     return allowedInstallments.map((n: number) => {
                       let totalValue = lead.value;
                       let isInterestFree = type === 'interest_free';
                       
                       if (type === 'with_interest') {
                         const rate = INTEREST_RATES[n] || 0;
                         totalValue = lead.value * (1 + rate / 100);
                       }

                       const isHighlight = n === 10;
                       
                       return (
                         <div key={n} className={`bg-white/10 rounded-xl p-2.5 text-center hover:bg-white/20 transition-colors relative group/inst flex flex-col justify-center min-h-[68px] ${isHighlight && !showAllInstallments ? 'ring-2 ring-cyan-400 bg-white/20' : ''}`}>
                           <p className="text-[11px] text-white/60 font-bold mb-0.5">
                             {n}x {n === 1 ? '(à vista)' : (isInterestFree ? 'sem juros de' : 'de')}
                           </p>
                           <p className="text-sm font-black text-white">{formatCurrency(totalValue / n)}</p>
                           {isHighlight && !showAllInstallments && (
                             <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-cyan-500 text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                               MAIS ESCOLHIDO
                             </span>
                           )}
                         </div>
                       );
                     });
                   })()}
                </div>
                
                {/* Botões de Ver Mais/Menos */}
                {(lead.fees_installments || 12) > 1 && (
                  <div className="flex justify-center mt-4">
                    <button 
                      onClick={() => setShowAllInstallments(!showAllInstallments)}
                      className="text-[10px] text-white/90 hover:text-white font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2 rounded-full transition-all flex items-center gap-2 active:scale-95"
                    >
                      {showAllInstallments ? (
                        <><ChevronUp className="w-3.5 h-3.5" /> Ver menos opções</>
                      ) : (
                        <><ChevronDown className="w-3.5 h-3.5" /> Ver mais opções</>
                      )}
                    </button>
                  </div>
                )}

                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-4 text-center leading-relaxed max-w-2xl mx-auto border-t border-white/10 pt-4">
                  Os valores apresentados podem sofrer alterações a qualquer momento. De acordo com as regras das companhias aéreas. A reserva só é garantida após confirmação de pagamento
                </p>
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

        {/* MÉTODOS DE PAGAMENTO */}
        <section className="space-y-4">
          <SectionTitle icon={<Info className="w-4 h-4" />} title="Métodos de pagamento" />
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm text-center">
             <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 group">
                   <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
                      <DollarSign className="w-4 h-4" />
                   </div>
                   <span className="text-sm font-bold text-slate-700 whitespace-nowrap">Pix ou Moedas Internacionais</span>
                </div>
                <div className="flex items-center gap-3 group relative cursor-help">
                   <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
                      <Info className="w-4 h-4" />
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700">Boleto financiado</span>
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">!</div>
                   </div>

                   {/* TOOLTIP ELITE - BOLETO FINANCIADO */}
                   <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[280px] bg-white border border-slate-100 shadow-2xl rounded-2xl p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-left scale-95 group-hover:scale-100 origin-bottom pointer-events-none">
                      <div className="flex items-center gap-2 mb-3 border-b border-slate-50 pb-2">
                         <div className="w-5 h-5 bg-blue-50 rounded flex items-center justify-center text-blue-600">
                            <Info className="w-3 h-3" />
                         </div>
                         <span className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Como funciona?</span>
                      </div>
                      <div className="space-y-3">
                         <p className="text-[11px] text-slate-600 leading-relaxed">
                            O boleto financiado é disponível para quem tem <strong>CPF</strong> e passa por <strong>2 análises</strong>:
                         </p>
                         <div className="space-y-2.5">
                            <div className="flex gap-2">
                               <span className="bg-blue-600 text-white font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center shrink-0">1º</span>
                               <p className="text-[10px] text-slate-500 leading-snug">
                                  Verificação de crédito inicial e opção de parcelamento (<strong>Mínimo 6x e Máximo 24x</strong> dependendo do CPF). 
                                  <span className="block text-emerald-600 font-bold mt-0.5">*Pode ser sem juros</span>
                               </p>
                            </div>
                            <div className="flex gap-2">
                               <span className="bg-blue-600 text-white font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center shrink-0">2º</span>
                               <p className="text-[10px] text-slate-500 leading-snug">Validação de Segurança: A <strong>Koin</strong> entrará em contato via telefone, e-mail e WhatsApp para validar sua identidade.</p>
                            </div>
                         </div>
                         <div className="bg-slate-50 p-2.5 rounded-lg border-l-2 border-blue-400">
                            <p className="text-[10px] text-slate-600 font-bold leading-tight mb-1">Pagamento:</p>
                            <p className="text-[9px] text-slate-500 leading-tight italic">Após a aprovação, pague o 1º boleto para garantir a reserva. Os seguintes chegam por e-mail ou app.</p>
                         </div>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45 -mt-1.5 shadow-[2px_2px_2px_rgba(0,0,0,0.02)]" />
                   </div>
                </div>
                <div className="flex items-center gap-3 group">
                   <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 border border-amber-100 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-4 h-4" />
                   </div>
                   <span className="text-sm font-bold text-slate-700">Cartão de Crédito em até 12x</span>
                </div>
             </div>
          </div>
        </section>

        {/* CONTATO */}
        <section className="space-y-4 pb-12">
          <SectionTitle icon={<Phone className="w-4 h-4" />} title="Informações e contato" />
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
             <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Side */}
                <div className="p-10 pt-8 pb-12 flex flex-col items-center justify-start text-center bg-slate-50/50">
                   <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-5 transform hover:rotate-2 transition-transform mb-8">
                      <Image src={AGENCY.logoUrl} alt="Easy Fly" width={88} height={88} className="w-full h-full object-contain" />
                   </div>
                   <div className="space-y-2">
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none whitespace-nowrap">{AGENCY.legalName}</p>
                      <p className="text-[10px] font-bold text-slate-400">CNPJ: {AGENCY.cnpj}</p>
                      <p className="text-[9px] font-bold text-slate-400 leading-tight uppercase max-w-[200px] mx-auto opacity-70 mt-4">
                        {AGENCY.address}
                      </p>
                   </div>
                </div>

                {/* Right Side */}
                <div className="p-10 bg-white border-l border-slate-100 space-y-6">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 group">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-all border border-slate-100">
                            <Users className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-800 leading-none">{lead.emissor || 'Consultor Easy Fly'}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 transition-all border border-slate-100">
                            <MessageCircle className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-600 leading-none">{AGENCY.phone}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-all border border-slate-100">
                            <Package className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-600 leading-none lowercase">{AGENCY.email}</p>
                         </div>
                      </div>

                      <a href="https://www.instagram.com/easyflly/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-opacity">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-600 transition-all border border-slate-100">
                            <Instagram className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-600 leading-none">{AGENCY.instagram}</p>
                         </div>
                      </a>
                   </div>

                   <a 
                    href={`https://wa.me/${AGENCY.whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de falar sobre a cotação ${lead.id}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-4 bg-white border-2 border-slate-100 hover:border-cyan-500 hover:bg-cyan-50 text-slate-600 hover:text-cyan-700 rounded-2xl font-black transition-all group"
                   >
                     Entrar em contato
                     <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                   </a>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* FOOTER - LEGAL ONLY */}
      <footer className="bg-slate-50 border-t border-slate-100 py-10 text-center">
         <div className="max-w-3xl mx-auto px-6 space-y-4">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{AGENCY.legalName} • CNPJ {AGENCY.cnpj}</p>
            <p className="text-[10px] text-slate-400 font-medium">Esta cotação é válida por 72 horas a partir da data de emissão. • Easy Fly Agência de Viagens © {new Date().getFullYear()}</p>
         </div>
      </footer>
      {/* FLOATING PRINT BUTTON (FAB) */}
      <button 
        onClick={() => window.print()}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#19727d] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] no-print group hover:rotate-6"
        title="Imprimir / Gerar PDF"
      >
        <div className="absolute -top-12 right-0 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
           BAIXAR PDF OFICIAL 🖨️
        </div>
        <Printer className="w-7 h-7" />
      </button>
    </div>
  );
}
