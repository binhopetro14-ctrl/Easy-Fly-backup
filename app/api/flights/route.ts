import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const departure_id = searchParams.get('departure_id');
  const arrival_id = searchParams.get('arrival_id');
  const outbound_date = searchParams.get('outbound_date');
  const return_date = searchParams.get('return_date');
  const type = searchParams.get('type');
  const adults = searchParams.get('adults');
  const currency = searchParams.get('currency') || 'BRL';

  if (!departure_id || !arrival_id || !outbound_date) {
    return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
  }

  // Chave API Blindada no Backend
  const SERP_API_KEY = 'fdb37769c95be514edeb722668ce6e3360191bac56879ee57bd4d73ec9a8387b';
  
  const queryParams = new URLSearchParams({
    engine: 'google_flights',
    departure_id,
    arrival_id,
    outbound_date,
    type: type || '1',
    adults: adults || '1',
    currency,
    hl: 'pt',
    api_key: SERP_API_KEY,
  });

  if (return_date) {
    queryParams.set('return_date', return_date);
  }

  try {
    const response = await fetch(`https://serpapi.com/search.json?${queryParams.toString()}`);
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json({ error: err.error || 'Erro na SerpAPI' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro no proxy de voos:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
