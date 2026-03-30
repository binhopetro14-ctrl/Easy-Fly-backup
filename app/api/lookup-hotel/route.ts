import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const name = searchParams.get('name');
  const hotelId = searchParams.get('hotelId');

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

  const headers = {
    'x-rapidapi-key': RAPIDAPI_KEY || '',
    'x-rapidapi-host': 'apidojo-booking-v1.p.rapidapi.com'
  };

  try {
    // 1. BUSCA DE SUGESTÕES (AUTOCOMPLETE)
    if (type === 'search' && name) {
      const url = `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${encodeURIComponent(name)}&languagecode=pt-br`;
      const res = await fetch(url, { headers, next: { revalidate: 3600 } });
      if (!res.ok) throw new Error(`Search Error: ${res.status}`);
      const data = await res.json();
      const suggestions = (data || [])
        .filter((l: any) => l.dest_type === 'hotel' || l.dest_type === 'city')
        .map((l: any) => {
          const score = l.review_score || 8.0;
          return {
            hotelId: l.dest_id,
            name: l.name || l.label.split(',')[0],
            address: l.label,
            type: l.dest_type,
            rating: Number((score / 2).toFixed(1)),
            source: 'booking'
          };
        }).slice(0, 10);
      return NextResponse.json({ suggestions });
    }

    // 2. DETALHES (FOTOS COM ROOM_IDS)
    if (type === 'details' && hotelId) {
      const url = `https://apidojo-booking-v1.p.rapidapi.com/properties/get-hotel-photos?hotel_ids=${encodeURIComponent(hotelId)}`;
      const res = await fetch(url, { headers, next: { revalidate: 86400 } });
      if (!res.ok) throw new Error('Photos Error');
      const data = await res.json();
      const hotelPhotosList = data?.data?.[hotelId] || [];
      const photos = hotelPhotosList.map((p: any) => ({
        roomIds: p[1] || [], // Array de IDs de quartos vinculados
        url: p[4].startsWith('http') ? p[4] : `https://cf.bstatic.com${p[4]}`
      }));
      return NextResponse.json({ photos });
    }

    // 3. FACILIDADES E DESCRIÇÃO
    if (type === 'facilities' && hotelId) {
      const descUrl = `https://apidojo-booking-v1.p.rapidapi.com/properties/get-description?hotel_ids=${encodeURIComponent(hotelId)}`;
      const facUrl = `https://apidojo-booking-v1.p.rapidapi.com/properties/get-facilities?hotel_ids=${encodeURIComponent(hotelId)}`;
      
      const [descRes, facRes] = await Promise.all([
        fetch(descUrl, { headers }),
        fetch(facUrl, { headers })
      ]);

      const descData = await descRes.json();
      const facData = await facRes.json();

      return NextResponse.json({
        description: descData?.[0]?.description || '',
        facilities: (facData || []).slice(0, 15).map((f: any) => f.facility_name)
      });
    }

    // 4. LISTA DE QUARTOS (DUMMY SEARCH PARA HOJE+1)
    if (type === 'rooms' && hotelId) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const url = `https://apidojo-booking-v1.p.rapidapi.com/properties/v2/get-rooms?hotel_id=${hotelId}&arrival_date=${today}&departure_date=${tomorrow}&adults_number=1&units=metric&room_number=1`;
      
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error('Rooms Error');
      const data = await res.json();

      // Mapear tipos de quartos únicos
      const roomTypes = (data?.data || []).map((r: any) => ({
        id: r.room_id,
        name: r.room_name || 'Quarto Standard',
        beds: r.bed_configurations?.[0]?.bed_types?.[0]?.name || ''
      }));

      return NextResponse.json({ rooms: roomTypes });
    }

    return NextResponse.json({ error: 'Parâmetro inválido' }, { status: 400 });

  } catch (error: any) {
    console.error('Hotel API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
