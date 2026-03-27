import { useState, useCallback } from 'react';
import { Supplier } from '@/types';
import { supplierService } from '@/services/supabaseService';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSupplier = async (supplier: Partial<Supplier>) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await supplierService.save(supplier);
      setSuppliers(prev => {
        const index = prev.findIndex(s => s.id === saved.id);
        if (index >= 0) {
          const newSuppliers = [...prev];
          newSuppliers[index] = saved;
          return newSuppliers;
        }
        return [saved, ...prev];
      });
      return saved;
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar fornecedor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await supplierService.delete(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir fornecedor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    suppliers,
    loading,
    error,
    fetchSuppliers,
    saveSupplier,
    deleteSupplier,
    setSuppliers
  };
}
