'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Script from 'next/script';
import {
  Plane, Hotel, Shield, Car, Package, Calendar, Users, Briefcase,
  Phone, MessageCircle, CheckCircle, Clock, CreditCard, ArrowRight,
  MapPin, ChevronDown, ChevronUp, Info, Map, TrendingDown, Backpack, Luggage, Instagram, RefreshCw, DollarSign,
  Printer, ShieldAlert, Download, FileText
} from 'lucide-react';

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
    { name: 'Argentina', keys: ['ARGENTINA', 'BUENOS AIRES', 'MENDOZA', 'BARILOCHE', 'USHUAIA'] },
    { name: 'Chile', keys: ['CHILE', 'SANTIAGO', 'SANTIAGO DO CHILE', 'VALPARAISO', 'VIÑA DEL MAR', 'PASCUA'] },
    { name: 'Uruguai', keys: ['URUGUAI', 'MONTEVIDEO', 'PUNTA DEL ESTE', 'COLONIA'] },
    { name: 'Paraguai', keys: ['PARAGUAI', 'ASUNCAO', 'CIUDAD DEL ESTE'] },
    { name: 'Peru', keys: ['PERU', 'LIMA', 'CUSCO', 'MACHU PICCHU'] },
    { name: 'Colombia', keys: ['COLOMBIA', 'BOGOTA', 'CARTAGENA', 'MEDELLIN'] }
  ];

  const EUROPA = ['PORTUGAL', 'ESPANHA', 'FRANÇA', 'ITALIA', 'ALEMANHA', 'REINO UNIDO', 'INGLATERRA', 'LISBOA', 'MADRID', 'PARIS', 'ROMA', 'LONDRES', 'BERLIM', 'AMSTERDAM', 'SUIÇA', 'EUROPA'];
  const EUA = ['EUA', 'USA', 'ESTADOS UNIDOS', 'UNITED STATES', 'MIAMI', 'ORLANDO', 'NY', 'NEW YORK', 'LAS VEGAS', 'CHICAGO', 'LOS ANGELES'];
  const MEXICO = ['MEXICO', 'CANCUN', 'RIVIERA MAYA', 'TULUM', 'CIDADE DO MEXICO'];
  const DUBAI = ['DUBAI', 'UAE', 'EMIRADOS ARABES', 'ABU DHABI'];

  const getCleanText = (t?: string) => (t || '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  // 1. Verificar itens de passagem (Maior precisão)
  if (items) {
    for (const item of items) {
      if (item.type !== 'passagem') continue;
      const dest = getCleanText(item.destination);
      
      if (dest && !BRAZILIAN_STATES.includes(dest) && dest !== 'BRASIL' && dest !== 'BRAZIL' && dest.length > 2) {
        isIntl = true;
        if (EUA.some(k => dest.includes(k))) return { isIntl: true, region: 'Estados Unidos' };
        if (EUROPA.some(k => dest.includes(k))) return { isIntl: true, region: 'Europa' };
        if (MEXICO.some(k => dest.includes(k))) return { isIntl: true, region: 'México' };
        if (DUBAI.some(k => dest.includes(k))) return { isIntl: true, region: 'Dubai' };
        
        const merc = MERCOSUL.find(m => m.keys.some(k => dest.includes(k)));
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
  usd_rate: number;
  eur_rate: number;
  gbp_rate: number;
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
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">
              Configurado para: <span className="text-slate-900 not-italic">{region}</span>
            </p>
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
        
        {isIntl && (
          <a 
            href={`https://apply.joinsherpa.com/travel-restrictions?language=pt-BR&destination=${region === 'Chile' ? 'CHL' : region === 'Argentina' ? 'ARG' : region === 'Estados Unidos' ? 'USA' : region === 'Europa' ? 'ESP' : region === 'México' ? 'MEX' : region === 'Dubai' ? 'ARE' : ''}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
          >
            <div className="bg-cyan-400 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-400/20">
               <Map className="w-4 h-4 text-slate-900" />
            </div>
            Verificar Exigências em Tempo Real (Sherpa)
          </a>
        )}
      </div>
    </div>
  );
}

const AIRPORT_INFO: Record<string, { coords: [number, number], name: string }> = {
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
  'MEX': { coords: [19.4361, -99.0719], name: 'Benito Juárez - Mexico City' }
};

function InteractiveMap({ lead, flights }: { lead: Lead; flights: LeadItem[] }) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLeafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    if ((window as any).L) {
      setLeafletReady(true);
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
      mapRef.current.remove();
    }

    const firstFlight = flights[0];
    const outbound = firstFlight.outboundSegments || [];
    const isIdaVolta = firstFlight.flightType === 'ida_volta';
    
    const ori = outbound[0]?.origin || 'REC';
    const des = outbound[outbound.length - 1]?.destination || 'GIG';

    const p1 = AIRPORT_INFO[ori]?.coords || [-15, -47];
    const p2 = AIRPORT_INFO[des]?.coords || [-23, -46];

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([ (p1[0]+p2[0])/2, (p1[1]+p2[1])/2 ], 4);
    
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

    const idaPoints = getCurvePoints(p1, p2, 0.15);
    L.polyline(idaPoints, {
      color: '#0891b2', // Cyan 600
      weight: 3,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    if (isIdaVolta) {
      const voltaPoints = getCurvePoints(p2, p1, -0.1);
      L.polyline(voltaPoints, {
        color: '#9333ea', // Purple 600
        weight: 2,
        dashArray: '5, 10',
        opacity: 0.8
      }).addTo(map);
    }

    const createDot = (color: string) => L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 10px; height: 10px; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 0 10px ${color}80;"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });

    L.marker(p1, { icon: createDot('#0891b2') }).addTo(map);
    L.marker(p2, { icon: isIdaVolta ? createDot('#9333ea') : createDot('#0891b2') }).addTo(map);

    const bounds = L.latLngBounds([p1, p2]);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isLeafletReady, flights]);

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
              {flights[0]?.flightType === 'ida_volta' && (
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

function MainTravelMap({ lead, flights }: { lead: Lead; flights: LeadItem[] }) {
  return <InteractiveMap lead={lead} flights={flights} />;
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

          <div className="flex items-center justify-between mt-8 mb-4 px-2">
            {/* Left Block - Departure */}
            <div className="text-left w-[200px] flex flex-col justify-start">
              <p className="text-3xl font-black text-slate-900 leading-none">{firstSeg?.departureTime ? fmt(firstSeg.departureTime) : '--:--'}</p>
              <div className="mt-1.5 h-7 flex items-start overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 leading-tight tracking-tight uppercase">
                  {AIRPORT_INFO[firstSeg?.origin || '']?.name || firstSeg?.origin || '---'}
                </p>
              </div>
            </div>

            {/* Middle Block - Timeline */}
            <div className="flex-1 flex flex-col items-center relative h-12 group self-center">
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
                        // 1. Prioritize pre-calculated duration from the segment (most accurate for time zones)
                        if (segments.length === 1 && segments[0].duration) {
                          const nums = getNums(segments[0].duration);
                          if (nums.length >= 2) {
                             return `${nums[0].toString().padStart(2, '0')}h ${nums[1].toString().padStart(2, '0')} min`;
                          }
                          return segments[0].duration; // Fallback to raw if logic fails
                        }

                        // 2. Fallback to itemDuration if segments logic isn't applicable
                        if (itemDuration && typeof itemDuration === 'string') {
                          const nums = itemDuration.match(/\d+/g)?.map((n: string) => parseInt(n, 10)) || [];
                          if (nums.length >= 2) {
                            return `${nums[0].toString().padStart(2, '0')}h ${nums[1].toString().padStart(2, '0')} min`;
                          }
                        }

                        // 3. Last resort: Dynamic calculation (only if everything else is missing)
                        if (firstSeg && lastSeg) {
                          const extract = (str: any) => str?.match(/\d+/g)?.map((n: string) => parseInt(n, 10)) || [];
                          const dD = extract(firstSeg.departureDate); 
                          const dT = extract(firstSeg.departureTime); 
                          const aD = extract(lastSeg.arrivalDate);
                          const aT = extract(lastSeg.arrivalTime);

                          if (dD.length >= 3 && dT.length >= 2 && aT.length >= 2) {
                            const start = new Date(dD[2] > 1000 ? dD[0] : dD[2], dD[1]-1, dD[2] > 1000 ? dD[2] : dD[0], dT[0], dT[1]);
                            let end;
                            if (aD.length >= 3) {
                              end = new Date(aD[2] > 1000 ? aD[0] : aD[2], aD[1]-1, aD[2] > 1000 ? aD[2] : aD[0], aT[0], aT[1]);
                            } else {
                              end = new Date(start.getTime());
                              end.setHours(aT[0], aT[1], 0, 0);
                              if (end < start) end.setDate(end.getDate() + 1);
                            }
                            const diff = end.getTime() - start.getTime();
                            if (diff > 0) {
                              const tmin = Math.floor(diff / 60000);
                              return `${Math.floor(tmin / 60).toString().padStart(2, '0')}h ${(tmin % 60).toString().padStart(2, '0')} min`;
                            }
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
                  <span className="relative z-10 text-[9px] font-black uppercase text-slate-400 bg-white px-3 py-1 border border-slate-100 rounded-full tracking-[0.15em] whitespace-nowrap shadow-sm">
                    {hasConnections ? 'Com Conexão' : 'Voo Direto'}
                  </span>
               </div>
            </div>

            {/* Right Block - Arrival */}
            <div className="text-right w-[200px] flex flex-col items-end justify-start">
              <p className="text-3xl font-black text-slate-900 leading-none">{lastSeg?.arrivalTime ? fmt(lastSeg.arrivalTime) : '--:--'}</p>
              <div className="mt-1.5 h-7 flex items-start justify-end overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 leading-tight tracking-tight uppercase text-right">
                  {AIRPORT_INFO[lastSeg?.destination || '']?.name || lastSeg?.destination || '---'}
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
                                       <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">Duração: {seg.duration || '--'}</span>
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
                                             {AIRPORT_INFO[seg.origin]?.name || `Aeroporto ${seg.origin}`}
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
                                             {AIRPORT_INFO[seg.destination]?.name || `Aeroporto ${seg.destination}`}
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
                          label: 'Mochila / Mão', 
                          weight: isLatamGol ? '12kg' : '10kg',
                          val: segments[0]?.carryOn ?? 1,
                          icon: <Backpack className="w-5 h-5" />,
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
  const [fallbackRates, setFallbackRates] = useState<{USD: number, EUR: number, GBP: number} | null>(null);
  const { isIntl, region: tripRegion } = checkInternational(lead || undefined);

  useEffect(() => {
    if (!id) return;
    fetchLead();
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
    
    const getDurationText = (days: number) => {
      if (days <= 0) return null;
      const nights = days - 1;
      const daysText = `${days} ${days === 1 ? 'dia' : 'dias'}`;
      const nightsText = `${nights} ${nights === 1 ? 'noite' : 'noites'}`;
      return `${daysText} e ${nightsText}`;
    };

    if (!flight) {
      const d = parseInt(lead.duration || '0');
      return d > 0 ? getDurationText(d) : null;
    }

    if (flight.flightType === 'ida') return 'Somente Ida';
    
    const outbound = flight.outboundSegments || [];
    const inbound = flight.inboundSegments || [];
    
    const startStr = outbound[0]?.departureDate;
    const endStr = inbound[inbound.length - 1]?.departureDate || inbound[inbound.length - 1]?.arrivalDate;
    
    if (!startStr || !endStr) {
      const d = parseInt(lead.duration || '0');
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
      const d = parseInt(lead.duration || '0');
      return d > 0 ? getDurationText(d) : null;
    }
  };

  const tripDuration = calculateDuration();
  
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
               <img src={AGENCY.logoUrl} alt="Logo" className="w-24 h-24 object-contain" />
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
            <SectionTitle icon={<CreditCard className="w-4 h-4" />} title="Investimento" />
            <div className="bg-gradient-to-br from-[#19727d] to-[#0d5c66] rounded-2xl p-6 text-white shadow-xl shadow-[#19727d]/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/70 text-sm font-bold uppercase tracking-widest leading-none mb-3">INVESTIMENTO TOTAL</p>
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <p className="text-5xl font-black tracking-tighter leading-none">{formatCurrency(lead.value)}</p>
                    <div className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-xl border border-white/5">
                       <span className="text-[10px] font-black text-white uppercase tracking-wider">À vista</span>
                       <div className="flex items-center gap-1.5">
                          {(lead.adults || 0) > 0 && (
                            <span className="text-[10px] font-black text-cyan-200 uppercase tracking-tight">
                               {(lead.adults || 0)} {(lead.adults || 0) === 1 ? 'Adulto' : 'Adultos'}
                            </span>
                          )}
                          {(lead.children || 0) > 0 && (
                            <span className="text-[10px] font-black text-cyan-200 uppercase tracking-tight">
                               • {(lead.children || 0)} {(lead.children || 0) === 1 ? 'Criança' : 'Crianças'}
                            </span>
                          )}
                          {(lead.babies || 0) > 0 && (
                            <span className="text-[10px] font-black text-cyan-200 uppercase tracking-tight">
                               • {(lead.babies || 0)} {(lead.babies || 0) === 1 ? 'Bebê' : 'Bebês'}
                            </span>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
                {/* CÂMBIO E ÍCONE PRINCIPAL */}
                <div className="flex flex-col items-end gap-3 shrink-0 self-start -mt-2">
                   {/* CÂMBIO (SEGURO OU FALLBACK) */}
                   {(() => {
                     const isPersisted = lead.usd_rate > 0;
                     const displayRates = isPersisted ? 
                       { USD: lead.usd_rate, EUR: lead.eur_rate, GBP: lead.gbp_rate } : 
                       fallbackRates;

                     if (!displayRates || displayRates.USD <= 0) return null;

                     return (
                       <div className="flex gap-2.5">
                          {[
                            { code: 'USD', symbol: '$', rate: displayRates.USD },
                            { code: 'EUR', symbol: '€', rate: displayRates.EUR },
                            { code: 'GBP', symbol: '£', rate: displayRates.GBP }
                          ].filter(c => c.rate > 0).map(c => (
                            <div key={c.code} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 py-2.5 flex flex-col items-center min-w-[85px] shadow-sm animate-in fade-in zoom-in duration-500">
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

              <div className="border-t border-white/20 pt-4">
                <div className="flex items-center gap-2 mb-3">
                   <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Simulação de parcelamento no cartão</p>
                   <CreditCard className="w-3.5 h-3.5 text-white/40" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INSTALLMENTS.map((n: number) => (
                    <div key={n} className="bg-white/10 rounded-xl p-2.5 text-center hover:bg-white/20 transition-colors">
                      <p className="text-[11px] text-white/60 font-bold">{n}x de</p>
                      <p className="text-sm font-black text-white">{formatCurrency(lead.value / n)}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/60 text-[10px] mt-4 text-center leading-relaxed">
                  * Os valores apresentados podem sofrer alterações a qualquer momento, de acordo com as regras das companhias aéreas.<br />
                  A reserva só é garantida após confirmação de pagamento.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CHECKLIST DE REQUISITOS */}
        <section className="space-y-6">
          <SectionTitle icon={<ShieldAlert className="w-4 h-4" />} title="Checklist de embarque e segurança" />
          <TravelChecklist isIntl={isIntl} region={tripRegion} />
        </section>

        {lead.notes && (
          <section>
            <SectionTitle icon={<Package className="w-4 h-4" />} title="Observações" />
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-gray-700 text-sm leading-relaxed font-medium">{lead.notes}</p>
            </div>
          </section>
        )}

        {/* INFORMAÇÕES GERAIS */}
        <section className="space-y-6">
          <SectionTitle icon={<Info className="w-4 h-4" />} title="Informações gerais" />
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Formas de Pagamento:</p>
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
        <section className="space-y-6 pb-20">
          <SectionTitle icon={<Phone className="w-4 h-4" />} title="Informações e contato" />
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
             <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Side */}
                <div className="p-10 pt-8 pb-12 flex flex-col items-center justify-start text-center bg-slate-50/50">
                   <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-5 transform hover:rotate-2 transition-transform mb-8">
                      <img src={AGENCY.logoUrl} alt="Easy Fly" className="w-full h-full object-contain" />
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

                      <div className="flex items-center gap-4 group">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-600 transition-all border border-slate-100">
                            <Instagram className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-600 leading-none">{AGENCY.instagram}</p>
                         </div>
                      </div>
                   </div>

                   <a 
                    href={`https://wa.me/${AGENCY.whatsapp}?text=${whatsappMsg}`} 
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
