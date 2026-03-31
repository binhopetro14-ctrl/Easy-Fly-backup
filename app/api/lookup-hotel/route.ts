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
      const descUrl = `https://apidojo-booking-v1.p.rapidapi.com/properties/get-description?hotel_ids=${encodeURIComponent(hotelId)}&languagecode=pt-br`;
      const facUrl = `https://apidojo-booking-v1.p.rapidapi.com/properties/get-facilities?hotel_ids=${encodeURIComponent(hotelId)}&languagecode=pt-br`;
      
      const [descRes, facRes] = await Promise.all([
        fetch(descUrl, { headers, next: { revalidate: 86400 } }),
        fetch(facUrl, { headers, next: { revalidate: 86400 } })
      ]);

      const descData = await descRes.json();
      const facData = await facRes.json();

      return NextResponse.json({
        description: descData?.[0]?.description || '',
        facilities: (facData || []).slice(0, 15).map((f: any) => f.facility_name)
      });
    }

    // 4. LISTA DE QUARTOS (USANDO DATAS PARA PEGAR VARIEDADE REAL)
    if (type === 'rooms' && hotelId) {
      const arrival = searchParams.get('arrival_date') || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0];
      const departure = searchParams.get('departure_date') || new Date(Date.now() + 86400000 * 31).toISOString().split('T')[0];
      
      const url = `https://apidojo-booking-v1.p.rapidapi.com/properties/v2/get-rooms?hotel_id=${hotelId}&arrival_date=${arrival}&departure_date=${departure}&adults_number=1&units=metric&room_number=1&languagecode=pt-br`;
      
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error('Rooms API Error');
      const rawData = await res.json();

      // A API v2 retorna um array na raiz
      const result = Array.isArray(rawData) ? rawData[0] : (rawData.data?.[0] || rawData);
      
      const blocks = result?.block || [];
      const roomsInfo = result?.rooms || {}; // Às vezes as informações extras do quarto estão aqui
      
      const roomsMap = new Map();
      
      blocks.forEach((b: any) => {
        const roomId = b.room_id;
        if (roomId && !roomsMap.has(roomId)) {
          const translatedName = roomsInfo[roomId]?.translated_name;
          const name = translatedName || b.room_name || 'Quarto';
          
          roomsMap.set(roomId, {
            id: roomId,
            name: name,
            beds: b.room_info?.bed_configurations?.[0]?.bed_types?.[0]?.name || '',
            price: b.price_breakdown?.all_inclusive_price || b.min_total_price || 0,
            maxOccupancy: b.nr_adults || 2
          });
        }
      });

      const roomTypes = Array.from(roomsMap.values());

      return NextResponse.json({ rooms: roomTypes.length > 0 ? roomTypes : [{ id: 0, name: 'Geral / Standard' }] });
    }

    return NextResponse.json({ error: 'Parâmetro inválido' }, { status: 400 });

  } catch (error: any) {
    console.error('Hotel API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
