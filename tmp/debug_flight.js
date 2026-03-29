const flight = 'LA791';
const date = '2026-07-09';
const RAPIDAPI_KEY = '6816acf794mshac1db758dbe0275p1e9678jsn96efab635a73';

async function test() {
  const res = await fetch(
    `https://aerodatabox.p.rapidapi.com/flights/number/${encodeURIComponent(flight)}/${date}`,
    {
      headers: {
        'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      }
    }
  );
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
