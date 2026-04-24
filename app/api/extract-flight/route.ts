import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

import { correctAirportName, extractIataCode } from '@/lib/airport-utils';

// Configurações para o Vercel
export const maxDuration = 60; // Aumentar para 60 segundos (Hobby limit)
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    // ---- AUTH CHECK ----
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    // --------------------

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
            "departureDate": "DD/MMM (ex: 15/Abr)",
            "arrivalDate": "DD/MMM (ex: 16/Abr)",
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
      4. IMPORTANTE: Identifique se o voo chega no dia seguinte (normalmente indicado por "+1" ao lado do horário de chegada ou pela duração longa) e forneça a 'arrivalDate' correta. Se a imagem não mostrar a data de chegada explicitamente, calcule-a com base na duração e horário de partida.
    `;

    // Lista de modelos a tentar, priorizando os mais recentes e estáveis verificado na API atual (2026)
    const modelsToTry = [
      'gemini-3.1-flash-preview',
      'gemini-3-flash-preview',
      'gemini-2.1-flash',
      'gemini-2.5-flash-lite',
      'gemini-1.5-flash'
    ];

    let modelErrors: string[] = [];

    for (const modelName of modelsToTry) {
      try {
        console.log(`[extract-flight] Tentando modelo: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { 
            responseMimeType: 'application/json',
            temperature: 0.1 // Baixa temperatura para extração mais precisa
          }
        });

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: 'image/png', // A maioria das capturas de itinerário são PNG
              data: base64Data
            }
          }
        ]);

        const response = await result.response;
        const textOutput = response.text();

        if (textOutput) {
          console.log(`[extract-flight] Sucesso absoluto com modelo: ${modelName}`);
          const data = JSON.parse(textOutput);
          
          // ---- PÓS-PROCESSAMENTO PARA CORREÇÃO DE AEROPORTOS ----
          if (data.flights && Array.isArray(data.flights)) {
            data.flights = data.flights.map((f: any) => {
              const originCode = extractIataCode(f.origin) || f.origin;
              const destCode = extractIataCode(f.destination) || f.destination;

              return {
                ...f,
                originAirport: originCode ? correctAirportName(originCode, f.originAirport) : f.originAirport,
                destinationAirport: destCode ? correctAirportName(destCode, f.destinationAirport) : f.destinationAirport
              };
            });
          }
          // -------------------------------------------------------

          return NextResponse.json(data);
        }
      } catch (e: any) {
        const errorMsg = `Modelo ${modelName}: ${e.message}`;
        console.warn(`[extract-flight] Falha no ${errorMsg}`);
        modelErrors.push(errorMsg);
        // Continua para o próximo
        continue;
      }
    }

    throw new Error(`Falha em todos os modelos tentados.\n\nDetalhes:\n${modelErrors.join('\n')}`);

  } catch (err: any) {
    console.error('[extract-flight ERROR]', err);
    return NextResponse.json({ 
      error: 'Erro ao processar imagem: ' + err.message,
      details: err.stack 
    }, { status: 500 });
  }
}
