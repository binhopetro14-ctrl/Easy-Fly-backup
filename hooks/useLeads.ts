import { useState, useCallback } from 'react';
import { Lead, CRMStatus } from '@/types';
import { crmService } from '@/services/supabaseService';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await crmService.getAll();
      setLeads(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveLead = async (lead: Partial<Lead>) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await crmService.save(lead);
      setLeads(prev => {
        const index = prev.findIndex(l => l.id === saved.id);
        if (index >= 0) {
          const newLeads = [...prev];
          newLeads[index] = saved;
          return newLeads;
        }
        return [saved, ...prev];
      });
      return saved;
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar lead');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: CRMStatus) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    try {
      const updated = await crmService.save({ ...lead, status: newStatus });
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar status do lead');
      throw err;
    }
  };

  const deleteLead = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await crmService.delete(id);
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir lead');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    leads,
    loading,
    error,
    fetchLeads,
    saveLead,
    updateLeadStatus,
    deleteLead,
    setLeads
  };
}
