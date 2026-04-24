import { NextRequest, NextResponse } from 'next/server';

const EVOLUTION_URL = process.env.EVOLUTION_URL || 'http://localhost:8080';
const EVOLUTION_TOKEN = process.env.EVOLUTION_TOKEN || 'easyfly_token_123';
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE || 'EasyFly_Bot';

const headers = {
  'apikey': EVOLUTION_TOKEN,
  'Content-Type': 'application/json'
};

async function deleteEvolutionInstance() {
  console.log(`[PROXY] Deletando instância: ${INSTANCE_NAME}`);
  return fetch(`${EVOLUTION_URL}/instance/delete/${INSTANCE_NAME}`, {
    method: 'DELETE',
    headers
  });
}

async function createEvolutionInstance() {
  console.log(`[PROXY] Criando instância: ${INSTANCE_NAME}`);
  return fetch(`${EVOLUTION_URL}/instance/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      instanceName: INSTANCE_NAME,
      token: EVOLUTION_TOKEN,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS'
    })
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'status') {
      const response = await fetch(`${EVOLUTION_URL}/instance/connectionState/${INSTANCE_NAME}`, { headers });
      const data = await response.json();
      console.log('Evolution Status Response:', data);
      return NextResponse.json(data);
    }

    if (action === 'connect') {
      console.log(`[PROXY] Solicitando conexão para: ${INSTANCE_NAME}`);
      
      // 1. Garante que a instância existe
      const checkRes = await fetch(`${EVOLUTION_URL}/instance/fetchInstances?instanceName=${INSTANCE_NAME}`, { headers });
      const instances = await checkRes.json();
      
      // Evolution API v1/v2 podem retornar 'name' ou 'instanceName'
      const instanceExists = Array.isArray(instances) 
        ? instances.some((i: any) => i.instanceName === INSTANCE_NAME || i.name === INSTANCE_NAME) 
        : false;

      if (!instanceExists) {
        console.log(`[PROXY] Instância ${INSTANCE_NAME} não existe. Criando...`);
        const createRes = await createEvolutionInstance();
        const createData = await createRes.json();
        console.log(`[PROXY] Resultado da criação:`, createData);
        // Pequena pausa para a API processar a criação
        await new Promise(r => setTimeout(r, 2000));
      }

      // 2. Tenta obter o QR Code
      const connectUrl = `${EVOLUTION_URL}/instance/connect/${INSTANCE_NAME}`;
      console.log(`[PROXY] Chamando URL: ${connectUrl}`);
      
      let response = await fetch(connectUrl, { headers });
      console.log(`[PROXY] Status da Resposta Connect: ${response.status}`);
      let data = await response.json();
      console.log(`[PROXY] Dados da Resposta Connect:`, JSON.stringify(data));

      // 3. Se retornar vazio ou erro, tenta Hard Reset (Delete + Create + Connect)
      if (!data.base64 && !data.qrcode?.base64) {
        // Se já estiver conectado, retorna sucesso com aviso
        if (data.instance?.state === 'open' || data.state === 'open') {
          return NextResponse.json({ 
            ...data, 
            base64: 'CONNECTED', // Sinaliza para o frontend que já está conectado
            message: 'Já conectado' 
          });
        }

        console.log(`[PROXY] Dados recebidos sem QR Code:`, data);
        console.log(`[PROXY] Falha persistente no QR Code. Executando Hard Reset (Delete + Create)...`);
        
        try {
          await deleteEvolutionInstance();
          await new Promise(r => setTimeout(r, 2000));
          await createEvolutionInstance();
          await new Promise(r => setTimeout(r, 3000));
          
          response = await fetch(`${EVOLUTION_URL}/instance/connect/${INSTANCE_NAME}`, { headers });
          data = await response.json();
        } catch (resetError) {
          console.error('[PROXY] Erro durante Hard Reset:', resetError);
        }
      }

      console.log(`[PROXY] Resposta Final Connect:`, data);
      return NextResponse.json(data, { status: response.status || 200 });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Proxy GET Error:', error);
    return NextResponse.json({ error: 'Falha na comunicação com Evolution API' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await createEvolutionInstance();
    const data = await response.json();
    console.log('Evolution Create Response:', response.status, data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy POST Error:', error);
    return NextResponse.json({ error: 'Erro ao criar instância' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const response = await fetch(`${EVOLUTION_URL}/instance/logout/${INSTANCE_NAME}`, {
      method: 'DELETE',
      headers
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy DELETE Error:', error);
    return NextResponse.json({ error: 'Erro ao desconectar' }, { status: 500 });
  }
}
