import { useState, useCallback, useMemo } from 'react';
import { Sale, SaleItem } from '@/types';
import { saleService } from '@/services/supabaseService';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async (filters?: { startDate?: string; endDate?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await saleService.getAll(filters);
      setSales(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSale = async (sale: Partial<Sale>, items: SaleItem[]) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await saleService.save(sale, items);
      setSales(prev => {
        const index = prev.findIndex(s => s.id === saved.id);
        if (index >= 0) {
          const newSales = [...prev];
          newSales[index] = saved;
          return newSales;
        }
        return [saved, ...prev];
      });
      return saved;
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar venda');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await saleService.delete(id);
      setSales(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir venda');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cálculos Financeiros (Memoizados para performance)
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthSales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });

    const faturamento = currentMonthSales.reduce((sum, sale) => sum + sale.totalValue, 0);
    const custo = currentMonthSales.reduce((sum, sale) => sum + sale.totalCost, 0);
    const lucro = faturamento - custo;

    // Ranking de Vendedores
    const rankingMap = currentMonthSales.reduce((acc, sale) => {
      const emissor = sale.emissor || 'Sistema';
      if (!acc[emissor]) {
        acc[emissor] = { name: emissor, count: 0, totalValue: 0 };
      }
      acc[emissor].count += 1;
      acc[emissor].totalValue += sale.totalValue;
      return acc;
    }, {} as Record<string, { name: string; count: number; totalValue: number }>);

    const ranking = Object.values(rankingMap).sort((a, b) => b.totalValue - a.totalValue);

    return {
      faturamento,
      custo,
      lucro,
      ranking,
      currentMonthSales
    };
  }, [sales]);

  return {
    sales,
    loading,
    error,
    stats,
    fetchSales,
    saveSale,
    deleteSale,
    setSales
  };
}
