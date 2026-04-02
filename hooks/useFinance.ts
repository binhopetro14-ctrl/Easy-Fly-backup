import { useState, useCallback, useEffect } from 'react';
import { FinancialAccount, FinancialTransaction } from '../types';
import { financeService } from '../services/supabaseService';

export function useFinance() {
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinanceData = useCallback(async (filters?: { startDate?: string; endDate?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const [accs, trans] = await Promise.all([
        financeService.getAccounts(),
        financeService.getTransactions(filters)
      ]);
      setAccounts(accs);
      setTransactions(trans);
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
    deleteTransaction
  };
}
