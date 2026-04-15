import { supabase } from '../lib/supabase';
import { Customer, Group, Sale, Supplier, SaleItem, Lead, FinancialAccount, FinancialTransaction, FinancialCategory, FinancialSettings, CalendarEvent, TeamMember, CustomerDocument, CustomerPassenger } from '../types';

import { mapperService } from './mapperService';

export const teamMemberService = {
  getAll: async (): Promise<TeamMember[]> => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('name');

    if (error) {
      console.error('Supabase Error (getAll team_members):', extractError(error));
      throw new Error(error.message || 'Erro ao buscar membros da equipe');
    }
    return data ? data.map(mapperService.fromSupabase.teamMember) : [];
  }
};
const extractError = (error: any) => {
  try {
    return JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
  } catch (e) {
    return String(error);
  }
};

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        customer_documents(*),
        customer_passengers(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error (getAll customers):', extractError(error));
      throw new Error(error.message || 'Erro ao buscar clientes');
    }
    return data ? data.map(mapperService.fromSupabase.customer) : [];
  },

  save: async (customer: Partial<Customer>): Promise<Customer> => {
    const payload = mapperService.toSupabase.customer(customer);

    // Se for um novo cliente (sem ID), removemos o campo para o Supabase gerar o UUID
    if (!payload.id) {
      delete payload.id;
    }

    console.log('Tentando salvar Cliente com o seguinte Payload:', JSON.stringify(payload, null, 2));

    const { data, error } = await supabase
      .from('customers')
      .upsert(payload)
      .select();

    if (error) {
      const errorDetails = extractError(error);
      console.error('Supabase Error (save customer):', errorDetails);
      throw new Error(`Falha no banco de dados ao salvar cliente: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.error('Supabase Error: Nenhum dado retornado no salvamento do cliente.');
      throw new Error('Erro ao salvar cliente: O banco de dados não retornou o registro criado.');
    }

    return mapperService.fromSupabase.customer(data[0]);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Error (delete customer):', extractError(error));
      throw new Error(error.message || 'Erro ao deletar cliente');
    }
  },

  // Documentos do Cliente
  saveDocument: async (doc: Partial<CustomerDocument>): Promise<CustomerDocument> => {
    const payload = mapperService.toSupabase.document(doc);
    if (!payload.id) delete payload.id;

    const { data, error } = await supabase
      .from('customer_documents')
      .upsert(payload)
      .select();

    if (error) throw new Error(`Erro ao salvar documento: ${error.message}`);
    return mapperService.fromSupabase.document(data[0]);
  },

  deleteDocument: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('customer_documents')
      .delete()
      .eq('id', id);
    if (error) throw new Error(`Erro ao deletar documento: ${error.message}`);
  },

  // Passageiros do Cliente
  savePassenger: async (p: Partial<CustomerPassenger>): Promise<CustomerPassenger> => {
    const payload = mapperService.toSupabase.passenger(p);
    if (!payload.id) delete payload.id;

    const { data, error } = await supabase
      .from('customer_passengers')
      .upsert(payload)
      .select();

    if (error) throw new Error(`Erro ao salvar passageiro: ${error.message}`);
    return mapperService.fromSupabase.passenger(data[0]);
  },

  deletePassenger: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('customer_passengers')
      .delete()
      .eq('id', id);
    if (error) throw new Error(`Erro ao deletar passageiro: ${error.message}`);
  }
};

export const groupService = {
  getAll: async (): Promise<Group[]> => {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error (getAll groups):', extractError(error));
      throw new Error(error.message || 'Erro ao buscar grupos');
    }
    return data ? data.map(mapperService.fromSupabase.group) : [];
  },

  save: async (group: Partial<Group>): Promise<Group> => {
    const payload = mapperService.toSupabase.group(group);

    if (!payload.id) {
      delete payload.id;
    }

    console.log('Tentando salvar Grupo com Payload:', JSON.stringify(payload, null, 2));

    const { data, error } = await supabase
      .from('groups')
      .upsert(payload)
      .select();

    if (error) {
      console.error('Supabase Error (save group):', extractError(error));
      throw new Error(error.message || 'Erro ao salvar grupo');
    }

    if (!data || data.length === 0) {
      throw new Error('Erro ao salvar grupo: Registro não retornado.');
    }

    return mapperService.fromSupabase.group(data[0]);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Error (delete group):', extractError(error));
      throw new Error(error.message || 'Erro ao deletar grupo');
    }
  }
};

export const supplierService = {
  getAll: async (): Promise<Supplier[]> => {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');

    if (error) {
      console.error('Supabase Error (getAll suppliers):', extractError(error));
      throw new Error(error.message || 'Erro ao buscar fornecedores');
    }
    return data ? data.map(mapperService.fromSupabase.supplier) : [];
  },

  save: async (supplier: Partial<Supplier>): Promise<Supplier> => {
    const payload = mapperService.toSupabase.supplier(supplier);

    if (!payload.id) {
      delete payload.id;
    }

    console.log('Tentando salvar Fornecedor com Payload:', JSON.stringify(payload, null, 2));

    const { data, error } = await supabase
      .from('suppliers')
      .upsert(payload)
      .select();

    if (error) {
      console.error('Supabase Error (save supplier):', extractError(error));
      throw new Error(error.message || 'Erro ao salvar fornecedor');
    }

    if (!data || data.length === 0) {
      throw new Error('Erro ao salvar fornecedor: Registro não retornado.');
    }

    return mapperService.fromSupabase.supplier(data[0]);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Error (delete supplier):', extractError(error));
      throw new Error(error.message || 'Erro ao deletar fornecedor');
    }
  }
};

export const saleService = {
  getAll: async (filters?: { startDate?: string; endDate?: string }): Promise<Sale[]> => {
    let query = supabase
      .from('sales')
      .select(`
        *,
        customer:customers(name),
        group:groups(name),
        sale_items!inner(*)
      `)
      .order('sale_date', { ascending: false });

    if (filters?.startDate) {
      query = query.filter('sale_items.emission_date', 'gte', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.filter('sale_items.emission_date', 'lte', filters.endDate);
    }

    const { data: sales, error: salesError } = await query;

    if (salesError) {
      console.error('Supabase Error (getAll sales):', extractError(salesError));
      throw new Error('Não foi possível carregar as vendas. Tente novamente em breve.');
    }

    if (!sales || sales.length === 0) return [];

    return sales.map((sale: any) => {
      const dataWithNames = {
        ...sale,
        customer_name: sale.customer?.name || 'Cliente Removido',
        group_name: sale.group?.name || ''
      };
      return mapperService.fromSupabase.sale(dataWithNames, sale.sale_items || []);
    });
  },

  save: async (sale: Partial<Sale>, items: SaleItem[]): Promise<Sale> => {
    const payload = mapperService.toSupabase.sale(sale);

    if (!payload.id) {
      delete payload.id;
    }

    console.log('Tentando salvar Venda com Payload:', JSON.stringify(payload, null, 2));

    const { data: savedSales, error: saleError } = await supabase
      .from('sales')
      .upsert(payload)
      .select();

    if (saleError) {
      console.error('Supabase Error (save sale):', extractError(saleError));
      throw new Error(saleError.message || 'Erro ao salvar venda');
    }

    if (!savedSales || savedSales.length === 0) {
      throw new Error('Erro ao salvar venda: Registro não retornado.');
    }

    const savedSale = savedSales[0];

    if (sale.id) {
      const { error: deleteError } = await supabase.from('sale_items').delete().eq('sale_id', sale.id);
      if (deleteError) {
        console.error('Supabase Error (delete old sale_items):', extractError(deleteError));
        throw new Error(deleteError.message || 'Erro ao limpar itens antigos');
      }
    }

    if (items.length > 0) {
      const itemsPayload = items.map(item => {
        const mappedItem = mapperService.toSupabase.saleItem(item, savedSale.id);
        if (!mappedItem.id) delete mappedItem.id;
        return mappedItem;
      });

      console.log('Tentando salvar Itens da Venda com Payload:', JSON.stringify(itemsPayload, null, 2));

      const { data: savedItems, error: itemsError } = await supabase
        .from('sale_items')
        .insert(itemsPayload)
        .select();

      if (itemsError) {
        console.error('Supabase Error (save sale_items):', extractError(itemsError));
        throw new Error(itemsError.message || 'Erro ao salvar itens da venda');
      }
      // Preserve o customer_name e group_name originais que o Supabase não retorna no .upsert()
      const saleDataWithNames = {
        ...savedSale,
        customer_name: sale.customerName || '',
        group_name: sale.groupName || ''
      };

      // --- AUTOMAÇÃO DE CHECK-IN NO CALENDÁRIO ---
      try {
        const flightItems = items.filter(item => item.type === 'passagem' && item.departureDate && item.boardingTime);
        
        // Remove eventos de check-in antigos para reconstruir (evita duplicidade)
        await supabase
          .from('calendar_events')
          .delete()
          .eq('sale_id', savedSale.id)
          .eq('type', 'Check-in');

        for (const flightItem of flightItems) {
          try {
            const boardingDateTime = new Date(`${flightItem.departureDate}T${flightItem.boardingTime}`);
            const checkInDateTime = new Date(boardingDateTime.getTime() - 24 * 60 * 60 * 1000);
            
            await calendarService.save({
              title: `Check-in: ${flightItem.passengerName || sale.customerName || 'Passageiro'} - ${flightItem.origin || ''}/${flightItem.destination || ''}`,
              type: 'Check-in',
              startDate: checkInDateTime.toISOString(),
              saleId: savedSale.id,
              description: `Venda #${savedSale.order_number || savedSale.id.slice(0, 8)} | Localizador: ${flightItem.locator || 'N/A'}`
            });
          } catch (itemErr) {
            console.error('Erro ao salvar item de check-in individual:', itemErr);
          }
        }
      } catch (calErr) {
        console.error('Erro ao processar automação de check-in:', calErr);
      }

      return mapperService.fromSupabase.sale(saleDataWithNames, savedItems);
    }

    const saleDataWithNames = {
      ...savedSale,
      customer_name: sale.customerName || '',
      group_name: sale.groupName || ''
    };
    return mapperService.fromSupabase.sale(saleDataWithNames, []);
  },

  delete: async (id: string): Promise<void> => {
    // Remove itens da venda primeiro
    await supabase.from('sale_items').delete().eq('sale_id', id);
    // Remove transações financeiras vinculadas
    await supabase.from('financial_transactions').delete().eq('sale_id', id);
    // Remove eventos de calendário vinculados
    await supabase.from('calendar_events').delete().eq('sale_id', id);

    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Error (delete sale):', extractError(error));
      throw new Error(error.message || 'Erro ao excluir venda');
    }
  },
};

export const crmService = {
  getAll: async (): Promise<Lead[]> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error (getAll leads):', extractError(error));
      throw new Error(error.message || 'Erro ao buscar leads');
    }

    return (data || []).map(mapperService.fromSupabase.lead);
  },

  save: async (lead: Partial<Lead>): Promise<Lead> => {
    const dataToSave = mapperService.toSupabase.lead(lead);
    
    console.log('Tentando salvar Lead com Payload:', JSON.stringify(dataToSave, null, 2));

    if (lead.id) {
      const { data, error } = await supabase
        .from('leads')
        .update({ ...dataToSave, updated_at: new Date().toISOString() })
        .eq('id', lead.id)
        .select();

      if (error) {
        console.error('Supabase Error (update lead):', extractError(error));
        throw new Error(error.message || 'Erro ao atualizar lead');
      }

      if (!data || data.length === 0) {
        console.warn('Lead não encontrado para atualização ou RLS ativo:', lead.id);
        throw new Error('Erro ao salvar: Lead não encontrado ou sem permissão de acesso.');
      }

      return mapperService.fromSupabase.lead(data[0]);
    } else {
      const { data, error } = await supabase
        .from('leads')
        .insert([dataToSave])
        .select();

      if (error) {
        console.error('Supabase Error (insert lead):', extractError(error));
        throw new Error(error.message || 'Erro ao inserir lead');
      }

      if (!data || data.length === 0) {
        console.error('Erro de inserção: Nenhum dado retornado no insert do Lead.');
        throw new Error('Erro ao criar lead: O banco de dados não retornou o registro. Verifique as políticas de RLS.');
      }

      return mapperService.fromSupabase.lead(data[0]);
    }
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Error (delete lead):', extractError(error));
      throw new Error(error.message || 'Erro ao excluir lead');
    }
  }
};

export const financeService = {
  getAccounts: async (): Promise<FinancialAccount[]> => {
    const { data, error } = await supabase
      .from('financial_accounts')
      .select('*')
      .order('name');
    if (error) throw new Error(error.message);
    return (data || []).map(mapperService.fromSupabase.financialAccount);
  },
  getTransactions: async (filters?: { startDate?: string; endDate?: string }): Promise<FinancialTransaction[]> => {
    let query = supabase.from('financial_transactions').select('*').order('due_date', { ascending: false });
    if (filters?.startDate) query = query.gte('due_date', filters.startDate);
    if (filters?.endDate) query = query.lte('due_date', filters.endDate);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map(mapperService.fromSupabase.financialTransaction);
  },
  saveAccount: async (account: Partial<FinancialAccount>): Promise<FinancialAccount> => {
    const payload = mapperService.toSupabase.financialAccount(account);
    const { data, error } = await supabase.from('financial_accounts').upsert(payload).select();
    if (error) throw new Error(error.message);
    return mapperService.fromSupabase.financialAccount(data[0]);
  },
  deleteAccount: async (id: string): Promise<void> => {
    const { error } = await supabase.from('financial_accounts').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
  saveTransaction: async (transaction: Partial<FinancialTransaction>): Promise<FinancialTransaction> => {
    const payload = mapperService.toSupabase.financialTransaction(transaction);
    const { data, error } = await supabase.from('financial_transactions').upsert(payload).select();
    if (error) throw new Error(error.message);
    return mapperService.fromSupabase.financialTransaction(data[0]);
  },
  deleteTransaction: async (id: string): Promise<void> => {
    const { error } = await supabase.from('financial_transactions').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
  getCategories: async (): Promise<FinancialCategory[]> => {
    const { data, error } = await supabase.from('financial_categories').select('*').order('sort_order');
    if (error) throw new Error(error.message);
    return (data || []).map(mapperService.fromSupabase.financialCategory);
  },
  saveCategory: async (category: Partial<FinancialCategory>): Promise<FinancialCategory> => {
    const payload = mapperService.toSupabase.financialCategory(category);
    const { data, error } = await supabase.from('financial_categories').upsert(payload).select();
    if (error) throw new Error(error.message);
    return mapperService.fromSupabase.financialCategory(data[0]);
  },
  deleteCategory: async (id: string): Promise<void> => {
    const { error } = await supabase.from('financial_categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
  updateCategoriesOrder: async (categories: FinancialCategory[]): Promise<void> => {
    const payloads = categories.map(c => mapperService.toSupabase.financialCategory(c));
    const { error } = await supabase.from('financial_categories').upsert(payloads);
    if (error) throw new Error(error.message);
  },
  getSettings: async (): Promise<FinancialSettings> => {
    const { data, error } = await supabase.from('financial_settings').select('*');
    if (error) throw new Error(error.message);
    return mapperService.fromSupabase.financialSettings(data || []);
  },
  saveSettings: async (settings: FinancialSettings): Promise<void> => {
    const payloads = [
      { key: 'default_income_account', value: settings.defaultIncomeAccountId },
      { key: 'default_expense_account', value: settings.defaultExpenseAccountId },
      { key: 'default_boarding_tax_card', value: settings.defaultBoardingTaxCardId }
    ].filter(p => p.value);
    const { error } = await supabase.from('financial_settings').upsert(payloads);
    if (error) throw new Error(error.message);
  },
  recalculateBalances: async (): Promise<void> => {
    const { data: accounts, error: accError } = await supabase.from('financial_accounts').select('*');
    if (accError) throw new Error(accError.message);
    
    for (const acc of (accounts || [])) {
      const { data: transactions, error: transError } = await supabase
        .from('financial_transactions')
        .select('amount, type')
        .eq('account_id', acc.id);
      
      if (transError) continue;

      const newBalance = transactions.reduce((sum, t) => {
        if (t.type === 'Receita') return sum + Number(t.amount);
        if (t.type === 'Despesa') return sum - Number(t.amount);
        return sum;
      }, 0);

      await supabase.from('financial_accounts').update({ balance: newBalance }).eq('id', acc.id);
    }
  }
};

export const calendarService = {
  getAll: async (): Promise<CalendarEvent[]> => {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Supabase Error (getAll calendar_events):', extractError(error));
      throw new Error(error.message || 'Erro ao buscar eventos do calendário');
    }
    return data ? data.map(mapperService.fromSupabase.calendarEvent) : [];
  },

  save: async (event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    const payload = mapperService.toSupabase.calendarEvent(event);

    if (!payload.id) {
      delete payload.id;
    }

    const { data, error } = await supabase
      .from('calendar_events')
      .upsert(payload)
      .select();

    if (error) {
      console.error('Supabase Error (save calendar_event):', extractError(error));
      throw new Error(error.message || 'Erro ao salvar evento do calendário');
    }

    if (!data || data.length === 0) {
      throw new Error('Erro ao salvar evento: Registro não retornado.');
    }

    return mapperService.fromSupabase.calendarEvent(data[0]);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Error (delete calendar_event):', extractError(error));
      throw new Error(error.message || 'Erro ao deletar evento do calendário');
    }
  }
};