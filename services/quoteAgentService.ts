// ============================================================
// quoteAgentService.ts — Motor de Cotação Inteligente
// ============================================================

import { ALL_AIRPORTS } from '@/lib/airports';

// Lista de aeroportos brasileiros para detecção de voos domésticos
const BR_AIRPORTS = ALL_AIRPORTS
  .filter(a => a.country === 'BR')
  .map(a => a.iata.toUpperCase());


export interface FlightSearchParams {
  origin: string;         // Código IATA ex: GRU
  destination: string;    // Código IATA ex: DUB
  departureDate: string;  // YYYY-MM-DD
  returnDate?: string;    // YYYY-MM-DD
  adults: number;
  hasBaggage: boolean;
  tripType: 'oneway' | 'roundtrip';
  // Novos campos para flexibilidade
  flexibility?: number;   // 0 a 7 dias
  minStay?: number;       // Mínimo de dias (modo duração)
  maxStay?: number;       // Máximo de dias (modo duração)
  useStayDuration?: boolean; // Se verdadeiro, ignora returnDate e usa min/max stay
}

export interface FlightResult {
  airline: string;
  price: number;          // Preço em BRL
  stops: number;
  duration: string;
  connection?: string;    // Código IATA da conexão ex: AMS
  hasBaggage: boolean;
  currency: string;
}

export interface MilesOption {
  program: string;        // Ex: 'Iberia / Avios'
  miles: number;          // Qtde de milhas estimada
  taxesBrl: number;       // Taxas em R$ (convertidas)
  ratePerThousand: number;// R$ por mil milhas
  totalCostBrl: number;   // Custo real para você
}

export interface QuoteAgentResult {
  googleFlights: FlightResult[];      // Resultados do Google Flights
  bestGooglePrice: number | null;     // Menor preço no GF
  milesOptions: MilesOption[];        // Opções calculadas por milhas
  bestMilesOption: MilesOption | null;// Melhor opção de milhas
  searchedAt: string;
}

export interface MilesRates {
  smiles: number;
  azul: number;
  latam: number;
  iberia: number;
  tap: number;
  usdRate: number;
  serpApiKey: string;
}

// Estimativas de milhas por rota (valores para IDA E VOLTA)
const ESTIMATES: Record<string, { smiles: number; azul: number; latam: number; iberia: number }> = {
  'GRU-DUB': { smiles: 120000, azul: 110000, latam: 130000, iberia: 99000 },
  'GRU-LIS': { smiles: 110000, azul: 100000, latam: 120000, iberia: 85000 },
  'REC-GRU': { smiles: 36000, azul: 32000, latam: 36400, iberia: 65000 },
  'SAO-RIO': { smiles: 18000, azul: 16000, latam: 16000, iberia: 50000 },
};

function getEstimates(origin: string, dest: string) {
  // Mapeamento de Metacódigos para Aeroportos principais (para fins de estimativa)
  const metaMap: Record<string, string> = {
    'SAO': 'GRU', 'RIO': 'GIG', 'LON': 'LHR', 'PAR': 'CDG', 'NYC': 'JFK', 'ROM': 'FCO', 'MIL': 'MXP', 'BHZ': 'CNF'
  };

  const normOrigin = (metaMap[origin.toUpperCase()] || origin).toUpperCase();
  const normDest = (metaMap[dest.toUpperCase()] || dest).toUpperCase();

  const key = `${normOrigin}-${normDest}`;
  const keyReverse = `${normDest}-${normOrigin}`;
  
  // Fallback mais realista (40k Smiles = ida e volta nacional médio)
  return ESTIMATES[key] || ESTIMATES[keyReverse] || {
    smiles: 40000, azul: 35000, latam: 40000, iberia: 80000
  };
}

/**
 * Busca voos no Google Flights via SerpAPI
 */
async function getEffectiveApiKey(providedKey: string) {
  const HARDCODED_KEY = 'fdb37769c95be514edeb722668ce6e3360191bac56879ee57bd4d73ec9a8387b';
  return (providedKey && providedKey.trim() !== '') ? providedKey : HARDCODED_KEY;
}

/**
 * Busca voos no Google Flights via SerpAPI
 */
export async function searchGoogleFlights(
  params: FlightSearchParams,
  serpApiKey: string
): Promise<FlightResult[]> {
  // Chamamos nossa rota local (Proxy) para evitar erro de CORS e proteger a chave
  const baseUrl = '/api/flights';
  const query = new URLSearchParams({
    departure_id: params.origin,
    arrival_id: params.destination,
    outbound_date: params.departureDate,
    type: params.tripType === 'roundtrip' ? '1' : '2',
    adults: String(params.adults),
    currency: 'BRL',
  });

  if (params.tripType === 'roundtrip' && params.returnDate) {
    query.set('return_date', params.returnDate);
  }

  const response = await fetch(`${baseUrl}?${query.toString()}`);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Erro na busca: ${err.error || response.statusText}`);
  }

  const data = await response.json();

  // Parsear resultado da SerpAPI (google_flights)
  const rawFlights: any[] = [
    ...(data.best_flights || []),
    ...(data.other_flights || []),
  ];

  if (rawFlights.length === 0) {
    return [];
  }

  return rawFlights.slice(0, 10).map((f: any): FlightResult => {
    const firstLeg = f.flights?.[0];
    const lastLeg = f.flights?.[f.flights?.length - 1];
    const stops = (f.flights?.length || 1) - 1;
    const connectionIata = stops > 0 ? f.flights?.[0]?.arrival_airport?.id : undefined;

    return {
      airline: firstLeg?.airline || 'N/D',
      price: f.price || 0,
      stops,
      duration: f.total_duration ? `${Math.floor(f.total_duration / 60)}h${f.total_duration % 60}min` : 'N/D',
      connection: connectionIata,
      hasBaggage: !!(f.extensions?.find((e: string) => e?.toLowerCase().includes('bag'))),
      currency: 'BRL',
    };
  });
}

/**
 * Motor de Busca Inteligente - Gera combinações e encontra o melhor preço
 */
export async function searchSmartFlexibleFlights(
  params: FlightSearchParams,
  serpApiKey: string,
  onProgress?: (msg: string) => void
): Promise<{ results: FlightResult[], bestDateInfo?: string }> {
  
  // 1. Gerar combinações de datas
  const baseOut = new Date(params.departureDate);
  const flex = params.flexibility || 0;
  
  const combinations: { out: string, ret?: string }[] = [];
  
  // Combinação 1: Data Base (Exata)
  let baseRet = params.returnDate;
  if (params.useStayDuration && params.minStay) {
    const d = new Date(baseOut);
    d.setDate(d.getDate() + params.minStay);
    baseRet = d.toISOString().split('T')[0];
  }
  combinations.push({ out: params.departureDate, ret: baseRet });

  // Só fazemos mais buscas se houver flexibilidade ou intervalo de estadia
  if (flex > 0 || (params.useStayDuration && (params.maxStay || 0) > (params.minStay || 0))) {
    
    // Combinação 2: Ida antecipada (-Flex)
    if (flex > 0) {
      const d = new Date(baseOut);
      d.setDate(d.getDate() - flex);
      combinations.push({ out: d.toISOString().split('T')[0], ret: baseRet });
    }

    // Combinação 3: Ida tardia (+Flex)
    if (flex > 0) {
      const d = new Date(baseOut);
      d.setDate(d.getDate() + flex);
      combinations.push({ out: d.toISOString().split('T')[0], ret: baseRet });
    }

    // Combinação 4: Se for modo duração, testar o máximo de estadia
    if (params.useStayDuration && params.maxStay) {
      const d = new Date(baseOut);
      d.setDate(d.getDate() + params.maxStay);
      combinations.push({ out: params.departureDate, ret: d.toISOString().split('T')[0] });
    }
  }

  // 2. Executar buscas (limitado a 5 para poupar créditos)
  onProgress?.(`Escaneando ${combinations.length} combinações de datas...`);
  
  let allFlights: FlightResult[] = [];
  let bestPriceFound = Infinity;
  let bestInfo = "";

  for (const combo of combinations.slice(0, 5)) {
    try {
      const subParams = { ...params, departureDate: combo.out, returnDate: combo.ret };
      const res = await searchGoogleFlights(subParams, serpApiKey);
      
      if (res.length > 0) {
        const cheapest = Math.min(...res.map(f => f.price));
        if (cheapest < bestPriceFound) {
          bestPriceFound = cheapest;
          allFlights = res; // Pegamos o set de voos dessa data melhor
          bestInfo = `${combo.out.split('-').reverse().slice(0, 2).join('/')} a ${combo.ret?.split('-').reverse().slice(0, 2).join('/')}`;
        }
      }
    } catch (e) {
      console.warn('Erro em sub-busca flexível:', e);
    }
  }

  return { 
    results: allFlights, 
    bestDateInfo: bestPriceFound !== Infinity ? `Melhor preço em: ${bestInfo}` : undefined 
  };
}

/**
 * Calcula as opções de milhas para a rota com base nas taxas configuradas
 */
export function calculateMilesOptions(
  params: FlightSearchParams,
  rates: MilesRates,
  // Milhas inseridas manualmente pelo usuário (opcional)
  manualMiles?: {
    smiles?: number;
    azul?: number;
    latam?: number;
    iberia?: number;
    taxis_usd?: number; // Taxas em USD para Iberia
  }
): MilesOption[] {
  const estimates = getEstimates(params.origin, params.destination);
  const multiplier = params.tripType === 'roundtrip' ? 2 : 1;
  const isDomestic = BR_AIRPORTS.includes(params.origin.toUpperCase()) && BR_AIRPORTS.includes(params.destination.toUpperCase());

  // Taxas de embarque estimadas por programa (em BRL)
  // Doméstico: ~R$ 45 por trecho. Internacional: ~R$ 450 médio
  const taxBase = isDomestic ? 48 : 450;

  const defaultTaxes = {
    smiles: taxBase * params.adults * multiplier,
    azul: (isDomestic ? 40 : 350) * params.adults * multiplier,
    latam: (isDomestic ? 47 : 500) * params.adults * multiplier,
    iberia: (manualMiles?.taxis_usd ?? (isDomestic ? 15 : 254.30)) * rates.usdRate * params.adults,
  };

  const programs: MilesOption[] = [
    {
      program: 'Smiles (GOL)',
      miles: (manualMiles?.smiles ?? estimates.smiles) * params.adults,
      taxesBrl: defaultTaxes.smiles,
      ratePerThousand: rates.smiles,
      totalCostBrl: 0,
    },
    {
      program: 'Azul pelo Mundo',
      miles: (manualMiles?.azul ?? estimates.azul) * params.adults,
      taxesBrl: defaultTaxes.azul,
      ratePerThousand: rates.azul,
      totalCostBrl: 0,
    },
    {
      program: 'LATAM Pass',
      miles: (manualMiles?.latam ?? estimates.latam) * params.adults,
      taxesBrl: defaultTaxes.latam,
      ratePerThousand: rates.latam,
      totalCostBrl: 0,
    },
    {
      program: 'Iberia / Avios',
      miles: (manualMiles?.iberia ?? estimates.iberia) * params.adults,
      taxesBrl: defaultTaxes.iberia,
      ratePerThousand: rates.iberia,
      totalCostBrl: 0,
    },
  ];

  // Calcular custo total: (milhas / 1000) * taxaPorMilhar + taxasAeroporto
  return programs
    .map(p => ({
      ...p,
      totalCostBrl: parseFloat(
        ((p.miles / 1000) * p.ratePerThousand + p.taxesBrl).toFixed(2)
      ),
    }))
    .sort((a, b) => a.totalCostBrl - b.totalCostBrl);
}


/**
 * Busca aeroportos pelo código IATA ou nome da cidade
 */
export function searchAirports(query: string) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  const scored = ALL_AIRPORTS
    .map(a => {
      const iata = a.iata.toLowerCase();
      const city = a.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const name = a.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      let score = 0;
      if (iata === q) score += 100;
      else if (iata.startsWith(q)) score += 80;
      else if (city.startsWith(q)) score += 60;
      else if (name.startsWith(q)) score += 40;
      else if (city.includes(q) || name.includes(q)) score += 10;
      
      // Bônus para Metacódigos (Cidade Toda)
      if ((a as any).isCity && score > 0) score += 50;
      
      return { ...a, score };
    })
    .filter(a => a.score > 0)
    .sort((a, b) => b.score - a.score); // Ordena pela maior pontuação

  // Remove duplicatas de IATA garantindo que o primeiro (maior score) prevaleça
  const uniqueResults: any[] = [];
  const seen = new Set();
  for (const res of scored) {
    if (!seen.has(res.iata)) {
      seen.add(res.iata);
      uniqueResults.push(res);
    }
  }

  return uniqueResults.slice(0, 10);
}
