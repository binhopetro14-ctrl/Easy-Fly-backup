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

  // Verifica a saúde da conexão
  checkConnection: async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from('customers').select('id', { count: 'exact', head: true });
      return !error;
    } catch {
      return false;
    }
  }
};
