import { useState, useCallback, useEffect } from 'react';
import { FinancialAccount, FinancialTransaction, FinancialCategory, FinancialSettings } from '../types';
import { financeService } from '../services/supabaseService';

export function useFinance() {
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [settings, setSettings] = useState<FinancialSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinanceData = useCallback(async (filters?: { startDate?: string; endDate?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const [accs, trans, cats, sets] = await Promise.all([
        financeService.getAccounts(),
        financeService.getTransactions(filters),
        financeService.getCategories(),
        financeService.getSettings()
      ]);
      setAccounts(accs);
      setTransactions(trans);
      setCategories(cats);
      setSettings(sets);
    } catch (err: any) {
      console.error('Error fetching finance data:', err);
      setError(err.message || 'Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTransaction = async (transaction: Partial<FinancialTransaction>) => {
    try {
      const saved = await financeService.saveTransaction(transaction);
      setTransactions(prev => {
        const index = prev.findIndex(t => t.id === saved.id);
        if (index >= 0) {
          const newTrans = [...prev];
          newTrans[index] = saved;
          return newTrans;
        }
        return [saved, ...prev];
      });
      // Refresh accounts as balance might have changed
      const accs = await financeService.getAccounts();
      setAccounts(accs);
      return saved;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao salvar transação');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await financeService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      // Refresh accounts
      const accs = await financeService.getAccounts();
      setAccounts(accs);
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao deletar transação');
    }
  };

  const saveAccount = async (account: Partial<FinancialAccount>) => {
    try {
      const saved = await financeService.saveAccount(account);
      setAccounts(prev => {
        const index = prev.findIndex(a => a.id === saved.id);
        if (index >= 0) {
          const newAccs = [...prev];
          newAccs[index] = saved;
          return newAccs;
        }
        return [...prev, saved];
      });
      return saved;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao salvar conta');
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await financeService.deleteAccount(id);
      setAccounts(prev => prev.filter(a => a.id !== id));
      // Refresh transactions as they might have been deleted by CASCADE
      await fetchFinanceData();
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao deletar conta');
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  return {
    accounts,
    transactions,
    loading,
    error,
    fetchFinanceData,
    saveTransaction,
    deleteTransaction,
    saveAccount,
    deleteAccount,
    categories,
    settings,
    saveCategory: async (category: Partial<FinancialCategory>) => {
      try {
        const saved = await financeService.saveCategory(category);
        setCategories(prev => {
          const index = prev.findIndex(c => c.id === saved.id);
          if (index >= 0) {
            const newCats = [...prev];
            newCats[index] = saved;
            return newCats;
          }
          return [...prev, saved];
        });
        return saved;
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao salvar categoria');
      }
    },
    deleteCategory: async (id: string) => {
      try {
        await financeService.deleteCategory(id);
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao deletar categoria');
      }
    },
    saveSettings: async (newSettings: FinancialSettings) => {
      try {
        await financeService.saveSettings(newSettings);
        setSettings(newSettings);
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao salvar configurações');
      }
    },
    recalculateBalances: async () => {
      try {
        setLoading(true);
        await financeService.recalculateBalances();
        const accs = await financeService.getAccounts();
        setAccounts(accs);
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao recalcular saldos');
      } finally {
        setLoading(false);
      }
    }
  };
}
