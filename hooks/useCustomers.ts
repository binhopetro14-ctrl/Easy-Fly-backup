import { useState, useCallback } from 'react';
import { Customer } from '@/types';
import { customerService } from '@/services/supabaseService';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCustomer = async (customer: Partial<Customer>) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await customerService.save(customer);
      setCustomers(prev => {
        const index = prev.findIndex(c => c.id === saved.id);
        if (index >= 0) {
          const newCustomers = [...prev];
          newCustomers[index] = saved;
          return newCustomers;
        }
        return [saved, ...prev];
      });
      return saved;
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await customerService.delete(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    saveCustomer,
    deleteCustomer,
    setCustomers
  };
}
