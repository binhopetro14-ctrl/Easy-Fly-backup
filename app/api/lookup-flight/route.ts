import { NextResponse } from 'next/server';

// Mapeamento de IATA de cias aéreas para nomes completos
const AIRLINE_NAMES: Record<string, string> = {
  LA: 'LATAM', G3: 'Gol', AD: 'Azul', O6: 'Avianca',
  TP: 'TAP Portugal', BA: 'British Airways', IB: 'Iberia',
  AF: 'Air France', KL: 'KLM', LH: 'Lufthansa', AZ: 'ITA Airways',
  LX: 'Swiss Airlines', TK: 'Turkish Airlines', FR: 'Ryanair',
  U2: 'easyJet', VY: 'Vueling', DY: 'Norwegian', UX: 'Air Europa',
  AY: 'Finnair', SK: 'SAS', AA: 'American Airlines', DL: 'Delta Air Lines',
  UA: 'United Airlines', EK: 'Emirates', QR: 'Qatar Airways',
  CM: 'Copa Airlines', AM: 'Aeromexico', AC: 'Air Canada',
};

function parseLocalTime(dateTimeStr?: string): string {
  if (!dateTimeStr) return '';
  // Format: "2024-03-15 09:00+03:00" or "2024-03-15T09:00:00+03:00"
  const match = dateTimeStr.match(/(\d{2}:\d{2})/);
  return match ? match[1] : '';
}

function parseLocalDate(dateTimeStr?: string): string {
  if (!dateTimeStr) return '';
  const match = dateTimeStr.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}

function calcDuration(depStr?: string, arrStr?: string): string {
  if (!depStr || !arrStr) return '';
  try {
    const dep = new Date(depStr.replace(' ', 'T'));
    const arr = new Date(arrStr.replace(' ', 'T'));
    const diffMs = arr.getTime() - dep.getTime();
    if (diffMs <= 0) return '';
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    return `${h}h${m.toString().padStart(2, '0')}`;
  } catch {
    return '';
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flight = searchParams.get('flight')?.replace(/\s/g, '').toUpperCase();
  let date = searchParams.get('date'); // YYYY-MM-DD ou DD/MM/YYYY

  if (!flight || !date) {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
  }

  // Normalizar data para YYYY-MM-DD se vier em formato DD/MM/YYYY
  if (date.includes('/')) {
    const parts = date.split('/');
    if (parts.length === 3) {
      const [d, m, y] = parts;
      date = `${y}-${m}-${d}`;
    }
  }

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

  if (!RAPIDAPI_KEY) {
    return NextResponse.json(
      { error: 'API de voos não configurada. Adicione RAPIDAPI_KEY ao .env.local' },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `https://aerodatabox.p.rapidapi.com/flights/number/${encodeURIComponent(flight)}/${date}`,
      {
        headers: {
          'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
        next: { revalidate: 3600 }, // cache 1 hour
      }
    );

    if (!res.ok) {
      if (res.status === 404 || res.status === 204) {
        return NextResponse.json({ error: 'Voo não encontrado para esta data' }, { status: 404 });
      }
      if (res.status === 403) {
        return NextResponse.json({ error: 'API key inválida ou plano expirado' }, { status: 403 });
      }
      return NextResponse.json({ error: `Erro na API: ${res.status}` }, { status: 502 });
    }

    const text = await res.text();
    if (!text || text === 'null') {
      return NextResponse.json({ error: 'Voo não encontrado' }, { status: 404 });
    }

    const data = JSON.parse(text);
    const info = Array.isArray(data) ? data[0] : data;
    
    // DEBUG: Ver conteúdo da resposta da API
    console.log('[DEBUG] Info do voo:', JSON.stringify(info, null, 2));

    if (!info) {
      return NextResponse.json({ error: 'Voo não encontrado' }, { status: 404 });
    }

    const d = info.departure || {};
    const a = info.arrival || {};

    // A AeroDataBox organiza os horários dentro de sub-objetos (scheduledTime, revisedTime, actualTime)
    // Cada um tem as propriedades 'local' e 'utc'
    const depTimeRaw = d.scheduledTime?.local || d.revisedTime?.local || d.actualTime?.local || 
                       d.scheduledTime?.utc || d.revisedTime?.utc || d.actualTime?.utc;
    
    const arrTimeRaw = a.scheduledTime?.local || a.revisedTime?.local || a.actualTime?.local || 
                       a.scheduledTime?.utc || a.revisedTime?.utc || a.actualTime?.utc;
    
    // Tempos em UTC/Local para cálculo de duração (preferencialmente UTC)
    const depUtcRaw = d.scheduledTime?.utc || d.revisedTime?.utc || d.actualTime?.utc || depTimeRaw;
    const arrUtcRaw = a.scheduledTime?.utc || a.revisedTime?.utc || a.actualTime?.utc || arrTimeRaw;

    const departureTime = parseLocalTime(depTimeRaw);
    const arrivalTime = parseLocalTime(arrTimeRaw);
    const departureDate = parseLocalDate(depTimeRaw) || date;
    const arrivalDate = parseLocalDate(arrTimeRaw) || departureDate;
    const duration = calcDuration(depUtcRaw, arrUtcRaw);

    // Airline name: from response or IATA code mapping
    const airlineCode = info.airline?.iata || '';
    const airlineName = info.airline?.name || AIRLINE_NAMES[airlineCode] || airlineCode;

    return NextResponse.json({
      origin: d.airport?.iata || '',
      destination: a.airport?.iata || '',
      originName: d.airport?.name || d.airport?.shortName || '',
      destinationName: a.airport?.name || a.airport?.shortName || '',
      airline: airlineName,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      duration,
      connections: 'Voo direto',
      aircraft: info.aircraft?.model || '',
    });
  } catch (err) {
    console.error('[lookup-flight]', err);
    return NextResponse.json({ error: 'Erro interno ao buscar voo' }, { status: 500 });
  }
}
