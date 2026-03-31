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
      customerName: data.customer_name || '',
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
      productName: data.product_name || '',
      fees_type: data.fees_type,
      fees_installments: Number(data.fees_installments) || 12,
      usd_rate: Number(data.usd_rate) || 0,
      eur_rate: Number(data.eur_rate) || 0,
      gbp_rate: Number(data.gbp_rate) || 0,
      adults: Number(data.adults) || 1,
      children: Number(data.children) || 0,
      babies: Number(data.babies) || 0,
      items: items.map(item => ({
        id: item.id,
        type: item.type,
        flightType: item.flight_type,
        adults: item.adults,
        children: item.children,
        babies: item.babies,
        bags23kg: item.bags_23kg || 0,
        valuePaidByCustomer: Number(item.value_paid_by_customer),
        emissionValue: Number(item.emission_value),
        additionalCosts: Number(item.additional_costs),
        vendor: item.vendor,
        origin: item.origin,
        destination: item.destination,
        locator: item.locator,
        emissionDate: item.emission_date,
        departureDate: item.departure_date,
        returnDate: item.return_date,     // FIX: was 'return_date' (snake_case)
        checkIn: item.check_in,
        checkInTime: item.check_in_time,
        checkOut: item.check_out,
        checkOutTime: item.check_out_time,
        hasBreakfast: item.has_breakfast,
        hotelName: item.hotel_name,
        description: item.description,
        passengerName: item.passenger_name, // FIX: was 'passenger_name' (snake_case)
        saleModel: item.sale_model,         // FIX: was 'sale_model' (snake_case)
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
      items: data.items || [],
      tags: data.tags || [],
      duration: data.duration || '',
      adults: Number(data.adults) || 1,
      children: Number(data.children) || 0,
      babies: Number(data.babies) || 0,
      luggage23kg: Number(data.luggage23kg) || 0,
      title: data.title || '',
      responded: data.responded || false,
      slaStartAt: data.sla_start_at || data.created_at,
      usd_rate: Number(data.usd_rate) || 0,
      eur_rate: Number(data.eur_rate) || 0,
      gbp_rate: Number(data.gbp_rate) || 0,
      fees_type: data.fees_type,
      fees_installments: Number(data.fees_installments) || 12,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    })
  },

  // Converte dados do formato do Sistema para o formato Supabase
  toSupabase: {
    customer: (customer: Partial<Customer>) => {
      const data: any = {
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
      };
      if (customer.id) data.id = customer.id;
      return data;
    },
    group: (group: Partial<Group>) => {
      const data: any = { name: group.name, member_ids: group.memberIds };
      if (group.id) data.id = group.id;
      return data;
    },
    sale: (sale: Partial<Sale>) => {
      const data: any = {
        customer_id: sale.customerId || undefined,
        group_id: sale.groupId || undefined,
        total_value: sale.totalValue,
        total_cost: sale.totalCost,
        cost_status: sale.costStatus,
        sale_status: sale.saleStatus,
        payment_method: sale.paymentMethod,
        sale_date: sale.saleDate,
        notes: sale.notes,
        emissor: sale.emissor,
        product_name: sale.productName || null,
        fees_type: sale.fees_type,
        fees_installments: sale.fees_installments,
        usd_rate: sale.usd_rate,
        eur_rate: sale.eur_rate,
        gbp_rate: sale.gbp_rate,
        adults: sale.adults,
        children: sale.children,
        babies: sale.babies,
      };
      if (sale.id) data.id = sale.id;
      return data;
    },
    saleItem: (item: Partial<SaleItem>, saleId: string) => {
      const data: any = {
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
        check_in_time: item.checkInTime,
        check_out: item.checkOut,
        check_out_time: item.checkOutTime,
        has_breakfast: item.hasBreakfast,
        description: item.description,
        passenger_name: item.passengerName,
        sale_model: item.saleModel,
        ticket_url: item.ticket_url,
        ticket_url2: item.ticket_url2
      };
      if (item.id && !item.id.startsWith('temp_')) data.id = item.id;
      return data;
    },
    supplier: (supplier: Partial<Supplier>) => {
      const data: any = {
        name: supplier.name,
        cnpj: supplier.cnpj,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
        description: supplier.description,
        emissor: supplier.emissor
      };
      if (supplier.id) data.id = supplier.id;
      return data;
    },
    lead: (lead: Partial<Lead>) => {
      const data: any = {};
      
      if (lead.name !== undefined) data.name = lead.name;
      if (lead.email !== undefined) data.email = lead.email;
      if (lead.phone !== undefined) data.phone = lead.phone;
      if (lead.status !== undefined) data.status = lead.status;
      if (lead.source !== undefined) data.source = lead.source;
      if (lead.value !== undefined) data.value = lead.value;
      if (lead.notes !== undefined) data.notes = lead.notes;
      if (lead.emissor !== undefined) data.emissor = lead.emissor;
      if (lead.items !== undefined) data.items = lead.items;
      if (lead.tags !== undefined) data.tags = lead.tags;
      if (lead.duration !== undefined) data.duration = lead.duration;
      if (lead.adults !== undefined) data.adults = lead.adults;
      if (lead.children !== undefined) data.children = lead.children;
      if (lead.babies !== undefined) data.babies = lead.babies;
      if (lead.luggage23kg !== undefined) data.luggage23kg = lead.luggage23kg;
      if (lead.title !== undefined) data.title = lead.title;
      if (lead.responded !== undefined) data.responded = lead.responded;
      if (lead.slaStartAt !== undefined) data.sla_start_at = lead.slaStartAt;
      if (lead.usd_rate !== undefined) data.usd_rate = lead.usd_rate;
      if (lead.eur_rate !== undefined) data.eur_rate = lead.eur_rate;
      if (lead.gbp_rate !== undefined) data.gbp_rate = lead.gbp_rate;
      if (lead.fees_type !== undefined) data.fees_type = lead.fees_type;
      if (lead.fees_installments !== undefined) data.fees_installments = lead.fees_installments;

      // CRITICAL: Apenas incluir o ID se ele for válido e não for uma string vazia
      if (lead.id && lead.id.trim() !== '') {
        data.id = lead.id;
      }
      
      return data;
    }
  }
};
