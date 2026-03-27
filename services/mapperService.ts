import { Customer, Group, Sale, Supplier, SaleItem, Lead } from '../types';

export const mapperService = {
  // Converte dados do formato Supabase para o formato do Sistema
  fromSupabase: {
    customer: (data: any): Customer => ({
      id: data.id,
      name: data.name,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      cpfCnpj: data.cpf_cnpj,
      rg: data.rg,
      passportNumber: data.passport_number,
      passportExpiry: data.passport_expiry,
      birthDate: data.birth_date,
      notes: data.notes,
      address: data.address || {
        cep: '', street: '', number: '', complement: '', 
        neighborhood: '', city: '', state: ''
      },
      createdAt: data.created_at,
      emissor: data.emissor
    }),
    group: (data: any): Group => ({
      id: data.id,
      name: data.name,
      memberIds: data.member_ids || [],
      createdAt: data.created_at
    }),
    sale: (data: any, items: any[] = []): Sale => ({
      id: data.id,
      orderNumber: data.order_number?.toString() || '',
      saleDate: data.sale_date,
      customerId: data.customer_id,
      customerName: data.customer_name || '', // Use joined data or customer_id
      groupId: data.group_id,
      groupName: data.group_name || '',
      totalValue: Number(data.total_value),
      totalCost: Number(data.total_cost),
      costStatus: data.cost_status,
      saleStatus: data.sale_status,
      paymentMethod: data.payment_method,
      notes: data.notes,
      createdAt: data.created_at,
      emissor: data.emissor,
      items: items.map(item => ({
        id: item.id,
        type: item.type,
        flightType: item.flight_type,
        adults: item.adults,
        children: item.children,
        babies: item.babies,
        valuePaidByCustomer: Number(item.value_paid_by_customer),
        emissionValue: Number(item.emission_value),
        additionalCosts: Number(item.additional_costs),
        vendor: item.vendor,
        origin: item.origin,
        destination: item.destination,
        locator: item.locator,
        emissionDate: item.emission_date,
        departureDate: item.departure_date,
        returnDate: item.return_date,
        checkIn: item.check_in,
        checkOut: item.check_out,
        hasBreakfast: item.has_breakfast,
        hotelName: item.hotel_name,
        description: item.description,
        passengerName: item.passenger_name,
        saleModel: item.sale_model,
        ticket_url: item.ticket_url,
        ticket_url2: item.ticket_url2
      }))
    }),
    supplier: (data: any): Supplier => ({
      id: data.id,
      name: data.name,
      cnpj: data.cnpj,
      phone: data.phone,
      email: data.email,
      address: data.address,
      description: data.description,
      emissor: data.emissor
    }),
    lead: (data: any): Lead => ({
      id: data.id,
      name: data.name,
      value: Number(data.value),
      status: data.status,
      phone: data.phone,
      email: data.email,
      notes: data.notes,
      emissor: data.emissor,
      source: data.source,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    })
  },

  // Converte dados do formato do Sistema para o formato Supabase
  toSupabase: {
    customer: (customer: Partial<Customer>) => ({
      id: customer.id || undefined,
      first_name: customer.firstName,
      last_name: customer.lastName,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      cpf_cnpj: customer.cpfCnpj,
      rg: customer.rg,
      passport_number: customer.passportNumber,
      passport_expiry: customer.passportExpiry,
      birth_date: customer.birthDate,
      notes: customer.notes,
      address: customer.address,
      emissor: customer.emissor
      // created_at handled by DB
    }),
    group: (group: Partial<Group>) => ({
      id: group.id || undefined,
      name: group.name,
      member_ids: group.memberIds
    }),
    sale: (sale: Partial<Sale>) => ({
      id: sale.id || undefined,
      customer_id: sale.customerId || undefined,
      group_id: sale.groupId || undefined,
      total_value: sale.totalValue,
      total_cost: sale.totalCost,
      cost_status: sale.costStatus,
      sale_status: sale.saleStatus,
      payment_method: sale.paymentMethod,
      sale_date: sale.saleDate,
      notes: sale.notes,
      emissor: sale.emissor
      // order_number is serial/identity
    }),
    saleItem: (item: Partial<SaleItem>, saleId: string) => ({
      id: (item.id && !item.id.startsWith('temp_')) ? item.id : undefined,
      sale_id: saleId,
      type: item.type,
      vendor: item.vendor,
      value_paid_by_customer: item.valuePaidByCustomer,
      emission_value: item.emissionValue,
      additional_costs: item.additionalCosts,
      flight_type: item.flightType,
      origin: item.origin,
      destination: item.destination,
      locator: item.locator,
      emission_date: item.emissionDate,
      departure_date: item.departureDate,
      return_date: item.returnDate,
      adults: item.adults,
      children: item.children,
      babies: item.babies,
      hotel_name: item.hotelName,
      check_in: item.checkIn,
      check_out: item.checkOut,
      has_breakfast: item.hasBreakfast,
      description: item.description,
      passenger_name: item.passengerName,
      sale_model: item.saleModel,
      ticket_url: item.ticket_url,
      ticket_url2: item.ticket_url2
    }),
    supplier: (supplier: Partial<Supplier>) => ({
      id: supplier.id || undefined,
      name: supplier.name,
      cnpj: supplier.cnpj,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      description: supplier.description,
      emissor: supplier.emissor
    }),
    lead: (lead: Partial<Lead>) => ({
      id: lead.id || undefined,
      name: lead.name,
      value: lead.value,
      status: lead.status,
      phone: lead.phone,
      email: lead.email,
      notes: lead.notes,
      emissor: lead.emissor,
      source: lead.source
      // created_at, updated_at handled by DB or explicit update
    })
  }
};
