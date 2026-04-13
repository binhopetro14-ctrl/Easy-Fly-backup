import { Customer, Group, Sale, Supplier, SaleItem, Lead, FinancialAccount, FinancialTransaction, FinancialCategory, FinancialSettings, CalendarEvent, TeamMember, CustomerDocument, CustomerPassenger } from '../types';


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
      emissor: data.emissor,
      documents: data.customer_documents ? data.customer_documents.map(mapperService.fromSupabase.document) : [],
      passengers: data.customer_passengers ? data.customer_passengers.map(mapperService.fromSupabase.passenger) : []
    }),
    document: (data: any): CustomerDocument => ({
      id: data.id,
      customerId: data.customer_id,
      name: data.name,
      url: data.url,
      type: data.type,
      createdAt: data.created_at
    }),
    passenger: (data: any): CustomerPassenger => ({
      id: data.id,
      customerId: data.customer_id,
      name: data.name,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      passportNumber: data.passport_number,
      passportExpiry: data.passport_expiry,
      birthDate: data.birth_date,
      createdAt: data.created_at
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
        ticket_url2: item.ticket_url2,
        boardingTime: item.boarding_time
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
      propostaEnviadaAt: data.proposta_enviada_at,
      followUpHistory: (Array.isArray(data.follow_up_history) && data.follow_up_history.length === 0) ? {} : (data.follow_up_history || {}),
      usd_rate: Number(data.usd_rate) || 0,
      eur_rate: Number(data.eur_rate) || 0,
      gbp_rate: Number(data.gbp_rate) || 0,
      fees_type: data.fees_type,
      fees_installments: Number(data.fees_installments) || 12,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }),
    financialAccount: (data: any): FinancialAccount => ({
      id: data.id,
      name: data.name,
      type: data.type,
      category: data.category,
      balance: Number(data.balance) || 0,
      status: data.status || 'Ativo',
      color: data.color || '#3b82f6',
      icon: data.icon || 'Wallet',
      createdAt: data.created_at
    }),
    financialTransaction: (data: any): FinancialTransaction => ({
      id: data.id,
      description: data.description,
      amount: Number(data.amount) || 0,
      type: data.type,
      category: data.category,
      accountId: data.account_id,
      status: data.status,
      dueDate: data.due_date,
      saleId: data.sale_id,
      supplierId: data.supplier_id,
      competenceDate: data.competence_date,
      paymentDate: data.payment_date,
      recurrence: data.recurrence || 'Única',
      reminder: data.reminder || false,
      observations: data.observations,
      attachments: data.attachments || [],
      createdAt: data.created_at
    }),
    financialSettings: (data: any[]): FinancialSettings => {
      const settings: FinancialSettings = {};
      data.forEach(item => {
        if (item.key === 'default_income_account') settings.defaultIncomeAccountId = item.value;
        if (item.key === 'default_expense_account') settings.defaultExpenseAccountId = item.value;
        if (item.key === 'default_boarding_tax_card') settings.defaultBoardingTaxCardId = item.value;
      });
      return settings;
    },
    financialCategory: (data: any): FinancialCategory => ({
      id: data.id,
      name: data.name,
      type: data.type,
      parentId: data.parent_id,
      status: data.status || 'Ativo',
      color: data.color,
      sortOrder: data.sort_order
    }),
    calendarEvent: (data: any): CalendarEvent => ({
      id: data.id,
      title: data.title,
      type: data.type,
      startDate: data.start_date,
      endDate: data.end_date,
      description: data.description,
      userId: data.user_id,
      saleId: data.sale_id,
      isAllDay: data.is_all_day,
      createdAt: data.created_at
    }),
    teamMember: (data: any): TeamMember => ({
      id: data.id,
      name: data.name,
      lastName: data.last_name,
      email: data.email,
      role: data.role,
      status: data.status,
      salary: Number(data.salary) || 0,
      commissionPercent: Number(data.commission_percent) || 0,
      permissionsCount: Number(data.permissions_count) || 0,
      birthDate: data.birth_date,
      address: data.address,
      avatarUrl: data.avatar_url
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
    document: (doc: Partial<CustomerDocument>) => {
      const data: any = {
        customer_id: doc.customerId,
        name: doc.name,
        url: doc.url,
        type: doc.type
      };
      if (doc.id) data.id = doc.id;
      return data;
    },
    passenger: (p: Partial<CustomerPassenger>) => {
      const data: any = {
        customer_id: p.customerId,
        name: p.name,
        first_name: p.firstName,
        last_name: p.lastName,
        email: p.email,
        phone: p.phone,
        passport_number: p.passportNumber,
        passport_expiry: p.passportExpiry,
        birth_date: p.birthDate
      };
      if (p.id) data.id = p.id;
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
        ticket_url2: item.ticket_url2,
        boarding_time: item.boardingTime
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
      if (lead.value !== undefined) data.value = Number(lead.value) || 0;
      if (lead.notes !== undefined) data.notes = lead.notes;
      if (lead.emissor !== undefined) data.emissor = lead.emissor;
      if (lead.items !== undefined) data.items = lead.items;
      if (lead.tags !== undefined) data.tags = lead.tags;
      if (lead.duration !== undefined) data.duration = String(lead.duration || '');
      if (lead.adults !== undefined) data.adults = Number(lead.adults) || 0;
      if (lead.children !== undefined) data.children = Number(lead.children) || 0;
      if (lead.babies !== undefined) data.babies = Number(lead.babies) || 0;
      if (lead.luggage23kg !== undefined) data.luggage23kg = Number(lead.luggage23kg) || 0;
      if (lead.title !== undefined) data.title = lead.title;
      if (lead.responded !== undefined) data.responded = lead.responded;
      if (lead.slaStartAt !== undefined) data.sla_start_at = lead.slaStartAt;
      if (lead.propostaEnviadaAt !== undefined) data.proposta_enviada_at = lead.propostaEnviadaAt;
      if (lead.followUpHistory !== undefined) data.follow_up_history = lead.followUpHistory;
      if (lead.usd_rate !== undefined) data.usd_rate = Number(lead.usd_rate) || 0;
      if (lead.eur_rate !== undefined) data.eur_rate = Number(lead.eur_rate) || 0;
      if (lead.gbp_rate !== undefined) data.gbp_rate = Number(lead.gbp_rate) || 0;
      if (lead.fees_type !== undefined) data.fees_type = lead.fees_type;
      if (lead.fees_installments !== undefined) data.fees_installments = Number(lead.fees_installments) || 12;

      // Se o ID for novo (gerado pelo frontend como string aleatória não-UUID), não enviamos para o Supabase gerar um UUID real
      const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      
      if (lead.id && isUuid(lead.id)) {
        data.id = lead.id;
      }
      
      return data;
    },
    financialAccount: (account: Partial<FinancialAccount>) => {
      const data: any = {
        name: account.name,
        type: account.type,
        category: account.category,
        balance: account.balance,
        status: account.status,
        color: account.color,
        icon: account.icon
      };
      if (account.id) data.id = account.id;
      return data;
    },
    financialTransaction: (transaction: Partial<FinancialTransaction>) => {
      const data: any = {
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        account_id: transaction.accountId,
        status: transaction.status,
        due_date: transaction.dueDate,
        sale_id: transaction.saleId,
        supplier_id: transaction.supplierId,
        competence_date: transaction.competenceDate,
        payment_date: transaction.paymentDate,
        recurrence: transaction.recurrence,
        reminder: transaction.reminder,
        observations: transaction.observations,
        attachments: transaction.attachments
      };
      if (transaction.id) data.id = transaction.id;
      return data;
    },
    financialCategory: (category: Partial<FinancialCategory>) => {
      const data: any = {
        name: category.name,
        type: category.type,
        parent_id: category.parentId,
        status: category.status,
        color: category.color,
        sort_order: category.sortOrder
      };
      if (category.id) data.id = category.id;
      return data;
    },
    calendarEvent: (event: Partial<CalendarEvent>) => {
      const data: any = {
        title: event.title,
        type: event.type,
        start_date: event.startDate ? new Date(event.startDate).toISOString() : undefined,
        end_date: event.endDate ? new Date(event.endDate).toISOString() : undefined,
        description: event.description,
        is_all_day: event.isAllDay,
        user_id: event.userId,
        sale_id: event.saleId
      };
      if (event.id) data.id = event.id;
      return data;
    },
    teamMember: (member: Partial<TeamMember>) => {
      const data: any = {
        name: member.name,
        last_name: member.lastName,
        email: member.email,
        role: member.role,
        status: member.status,
        salary: member.salary,
        commission_percent: member.commissionPercent,
        permissions_count: member.permissionsCount,
        birth_date: member.birthDate,
        address: member.address,
        avatar_url: member.avatarUrl
      };
      if (member.id) data.id = member.id;
      return data;
    }
  }
};
