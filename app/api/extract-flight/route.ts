import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configurações para o Vercel
export const maxDuration = 60; // Aumentar para 60 segundos (Hobby limit)
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada' }, { status: 400 });
    }

    const base64Data = image.split(',')[1] || image;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GOOGLE_API_KEY não configurada' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

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
      Regras:
      1. Se houver conexões, liste cada trecho separadamente.
      2. Identifique onde começa a volta e marque 'isReturn: true' a partir desse trecho.
      3. Seja extremamente preciso com horários e códigos IATA.
    `;

    // Lista de modelos a tentar, priorizando o solicitado pelo usuário e os estáveis
    const modelsToTry = [
      'gemini-3-flash-preview', // Solicitado pelo usuário como funcional
      'gemini-2.0-flash-exp',    // Experimental rápido
      'gemini-1.5-flash',        // Estável e rápido
      'gemini-1.5-flash-latest'
    ];

    let lastError = '';

    for (const modelName of modelsToTry) {
      try {
        console.log(`[extract-flight] Tentando modelo: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' }
        });

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Data
            }
          }
        ]);

        const textOutput = result.response.text();
        if (textOutput) {
          console.log(`[extract-flight] Sucesso com modelo: ${modelName}`);
          return NextResponse.json(JSON.parse(textOutput));
        }
      } catch (e: any) {
        console.warn(`[extract-flight] Erro no modelo ${modelName}:`, e.message);
        lastError = e.message;
        // Continua para o próximo modelo se este falhar
        continue;
      }
    }

    throw new Error(`Falha em todos os modelos. Último erro: ${lastError}`);

  } catch (err: any) {
    console.error('[extract-flight ERROR]', err);
    return NextResponse.json({ 
      error: 'Erro ao processar imagem: ' + err.message,
      details: err.stack 
    }, { status: 500 });
  }
}
