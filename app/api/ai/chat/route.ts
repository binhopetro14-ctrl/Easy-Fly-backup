import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicialização lazy para evitar erro de build se a chave estiver ausente
let openaiInstance: OpenAI | null = null;

function getOpenAI() {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }
    openaiInstance = new OpenAI({ apiKey });
  }
  return openaiInstance;
}

export async function POST(req: NextRequest) {
  try {
    const { message, settings, knowledgeBase, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 });
    }

    // Preparar a base de conhecimento para o prompt (Inserida como regras adicionais)
    const knowledgeContext = knowledgeBase && knowledgeBase.length > 0 
      ? `\nREGRAS ADICIONAIS DE CONHECIMENTO:\n${knowledgeBase.map((k: any) => `- ${k.content}`).join('\n')}`
      : '';

    const systemMessage = `Você é o Raul, do time da Easy Fly.
Sua identidade e comportamento devem seguir RIGOROSAMENTE as instruções abaixo:

PERSONALIDADE: ${settings.personality || ''}
TOM DE VOZ: ${settings.toneOfVoice || ''}

INSTRUÇÕES E REGRAS:
${settings.coreInstructions || ''}
${knowledgeContext}

OBJETIVO: Venda consultiva de passagens e pacotes.
Responda sempre de forma humana, simpática e focada em ajudar o cliente a viajar.`;

    // Mapear o histórico para o formato da OpenAI
    const mappedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        ...mappedHistory,
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiMessage = response.choices[0].message.content;

    return NextResponse.json({ text: aiMessage });
  } catch (error: any) {
    console.error('Chat Simulation Error:', error);
    return NextResponse.json({ error: 'Falha ao processar simulação: ' + error.message }, { status: 500 });
  }
}
