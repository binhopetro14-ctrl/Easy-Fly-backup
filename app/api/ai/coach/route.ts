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
    const { feedback, currentPrompt } = await req.json();

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback vazio' }, { status: 400 });
    }

    const systemPrompt = `Você é um Especialista em Engenharia de Prompt para Agentes de IA de Vendas.
Seu trabalho é pegar as instruções atuais do agente "Raul" e o feedback do usuário, e reescrever as instruções para que fiquem melhores, mais organizadas e sigam o que o usuário pediu.

REGRAS:
1. Mantenha a estrutura de tópicos (🧠 IDENTIDADE, ✈️ SERVIÇOS, ⚠️ REGRAS, 🎯 ESTILO, 🔥 FLUXO).
2. Seja conciso e direto.
3. Não remova informações críticas a menos que o feedback peça explicitamente.
4. Garanta que o tom de voz "Raul" seja preservado.

RETORNE APENAS UM JSON NO FORMATO:
{
  "observation": "Resumo do que foi entendido do feedback",
  "reasoning": "Explicação técnica de por que a mudança foi feita assim",
  "suggested_prompt": "O TEXTO COMPLETO DAS INSTRUÇÕES CORE REESCRITAS"
}`;

    const userPrompt = `
PROMPT ATUAL DO RAUL:
---
${currentPrompt}
---

FEEDBACK DO USUÁRIO:
"${feedback}"

Crie a versão melhorada respeitando o JSON de saída.`;

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Alinhado com o N8N conforme solicitado pelo usuário
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const resultText = response.choices[0].message.content;
    if (!resultText) throw new Error('Falha na resposta da OpenAI');

    return NextResponse.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Coaching Engine Error:', error);
    return NextResponse.json({ error: 'Falha ao processar treinamento: ' + error.message }, { status: 500 });
  }
}
