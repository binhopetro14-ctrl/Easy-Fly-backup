import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada' }, { status: 400 });
    }

    const base64Data = image.split(',')[1] || image;
    const apiKey = process.env.GOOGLE_API_KEY;

    const prompt = `
      Analise esta imagem de um itinerário de voo e extraia os dados dos trechos.
      Retorne APENAS um JSON no seguinte formato:
      {
        "flights": [
          {
            "date": "DD/MMM (ex: 15/Abr)",
            "origin": "Cidade (IATA)",
            "originAirport": "Nome do Aeroporto",
            "destination": "Cidade (IATA)",
            "destinationAirport": "Nome do Aeroporto",
            "departureTime": "HH:MM",
            "arrivalTime": "HH:MM",
            "airline": "Nome da Cia",
            "duration": "XH XMIN",
            "isReturn": boolean (true se for voo de volta)
          }
        ]
      }
      Se houver conexões, liste cada trecho separadamente.
      Identifique onde começa a volta e marque 'isReturn: true' a partir desse trecho.
    `;

    const modelsToTry = [
      'gemini-3-flash-preview',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
    ];

    let lastError = '';

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: 'image/png', data: base64Data } }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textOutput) {
            return NextResponse.json(JSON.parse(textOutput));
          }
        } else {
          const errData = await response.json();
          lastError = errData.error?.message || response.statusText;
          // Se for erro de quota ou sobrecarga, tenta o próximo modelo
          continue;
        }
      } catch (e: any) {
        lastError = e.message;
        continue;
      }
    }

    throw new Error(`Todos os modelos de IA estão sobrecarregados. Último erro: ${lastError}`);

  } catch (err: any) {
    console.error('[extract-flight ERROR]', err);
    return NextResponse.json({ error: 'Erro ao processar imagem: ' + err.message }, { status: 500 });
  }
}
