import { supabase } from '../lib/supabase';

type Table = 'customers' | 'groups' | 'sales' | 'suppliers' | 'sale_items';

export const syncService = {
  // Ativa a subscrição em tempo real para uma tabela específica
  subscribe: (table: Table, onUpdate: (payload: any) => void) => {
    const channel = supabase
      .channel(`${table}_realtime`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          console.log(`Real-time change in ${table}:`, payload);
          onUpdate(payload);
        }
      )
      .subscribe();

    return channel;
  },

  // Sincronização automática em intervalos regulares (como solicitado)
  startAutoSync: (callback: () => Promise<void>, intervalMs: number = 300000) => {
    // Sincroniza a cada 5 minutos por padrão
    const interval = setInterval(async () => {
      console.log('Auto-syncing data...');
      await callback();
    }, intervalMs);

    return () => clearInterval(interval);
  },

  // Verifica a saúde da conexão com timeout de 10s
  checkConnection: async (): Promise<boolean> => {
    const timeout = new Promise<boolean>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 10000)
    );

    try {
      const query = supabase.from('customers').select('id', { count: 'exact', head: true });
      const result = await Promise.race([query, timeout]);
      
      if (typeof result === 'boolean') return result;
      return !result.error;
    } catch (err) {
      console.error('Connection health check failed:', err);
      return false;
    }
  }
};
