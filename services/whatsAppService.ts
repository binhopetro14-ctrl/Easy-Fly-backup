export interface WhatsAppStatus {
  state: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 'PAIRING';
  status: string;
}

export interface QrCodeResponse {
  base64?: string;
  code?: string;
  pairingCode?: string;
}

export const whatsAppService = {
  /**
   * Verifica o status da conexão da instância via Proxy
   */
  async getStatus(): Promise<WhatsAppStatus> {
    try {
      const response = await fetch('/api/whatsapp?action=status');
      const data = await response.json();
      
      // A Evolution API pode retornar o estado dentro de 'instance' ou direto na raiz
      const rawState = data.instance?.state || data.instance?.status || data.state || 'DISCONNECTED';
      
      // Normaliza para os estados que a UI entende
      let state: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 'PAIRING' = 'DISCONNECTED';
      
      if (rawState === 'open' || rawState === 'CONNECTED' || rawState === 'connected') {
        state = 'CONNECTED';
      } else if (rawState === 'connecting' || rawState === 'CONNECTING') {
        state = 'CONNECTING';
      } else if (rawState === 'pairing' || rawState === 'PAIRING') {
        state = 'PAIRING';
      } else if (rawState === 'close' || rawState === 'disconnected' || rawState === 'DISCONNECTED') {
        state = 'DISCONNECTED';
      }

      return {
        state,
        status: data.instance?.status || (state === 'CONNECTED' ? 'online' : 'offline')
      };
    } catch (error) {
      console.error('Erro ao verificar status do WhatsApp:', error);
      return { state: 'DISCONNECTED', status: 'error' };
    }
  },

  /**
   * Obtém o QR Code para conexão via Proxy
   */
  async getQrCode(): Promise<QrCodeResponse | null> {
    try {
      const response = await fetch('/api/whatsapp?action=connect');
      const data = await response.json();

      if (response.status === 404) {
        await this.createInstance();
        return this.getQrCode();
      }

      // Normaliza diferentes versões da Evolution API
      const base64 = data.base64 || data.qrcode?.base64;
      const code = data.code || data.qrcode?.code;

      // Se o proxy retornar que já está conectado, não tratamos como erro
      if (base64 === 'CONNECTED') {
        return { base64: 'CONNECTED', code: '' };
      }

      if (!base64) {
        // Se retornar erro estruturado do proxy
        if (data.error) {
          console.error('Erro na API Evolution:', data.error);
        } else {
          console.error('Resposta do QR Code inválida ou incompleta:', data);
        }
        return null;
      }

      return { base64, code };
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      return null;
    }
  },

  /**
   * Cria uma nova instância se necessário via Proxy
   */
  async createInstance(): Promise<void> {
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrcode: true
        })
      });
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      throw error;
    }
  },

  /**
   * Desconecta (Logout) da instância via Proxy
   */
  async logout(): Promise<void> {
    try {
      await fetch('/api/whatsapp', {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Erro ao desconectar WhatsApp:', error);
      throw error;
    }
  }
};
