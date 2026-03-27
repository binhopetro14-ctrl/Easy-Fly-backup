import { useState, useCallback } from 'react';
import { Group } from '@/types';
import { groupService } from '@/services/supabaseService';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupService.getAll();
      setGroups(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar grupos');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveGroup = async (group: Partial<Group>) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await groupService.save(group);
      setGroups(prev => {
        const index = prev.findIndex(g => g.id === saved.id);
        if (index >= 0) {
          const newGroups = [...prev];
          newGroups[index] = saved;
          return newGroups;
        }
        return [saved, ...prev];
      });
      return saved;
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await groupService.delete(id);
      setGroups(prev => prev.filter(g => g.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    groups,
    loading,
    error,
    fetchGroups,
    saveGroup,
    deleteGroup,
    setGroups
  };
}
