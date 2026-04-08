export type ItemType = 'passagem' | 'hospedagem' | 'translado' | 'seguro' | 'aluguel' | 'adicionais';
export type TransactionStatus = 'Pendente' | 'Recebido' | 'Parcial' | 'Atrasado' | 'Cancelado' | 'Pago';

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Customer {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  rg: string;
  passportNumber: string;
  passportExpiry: string;
  birthDate: string;
  notes: string;
  address: Address;
  createdAt: string;
  emissor?: string;
}

export interface Group {
  id: string;
  name: string;
  memberIds: string[];
  createdAt: string;
}

export interface SaleItem {
  id: string;
  type: ItemType;
  flightType?: 'ida' | 'ida_volta';
  adults?: number;
  children?: number;
  babies?: number;
  bags23kg?: number;
  valuePaidByCustomer: number;
  emissionValue: number;
  additionalCosts: number;
  vendor?: string;
  origin?: string;
  destination?: string;
  locator?: string;
  emissionDate?: string;
  departureDate?: string;
  returnDate?: string;
  checkIn?: string;
  checkInTime?: string;
  checkOut?: string;
  checkOutTime?: string;
  hasBreakfast?: boolean;
  hotelName?: string;
  description?: string;
  passengerName?: string;
  saleModel?: string;
  ticket_url?: string;
  ticket_url2?: string;
  commissionDate?: string;
  hotelId?: string;
  hotelImages?: string[];
  hotelDescription?: string;
  hotelAmenities?: string[];
}

export interface Sale {
  id: string;
  orderNumber: string;
  saleDate: string;
  customerId: string;
  customerName: string;
  groupId?: string;
  groupName?: string;
  items: SaleItem[];
  totalValue: number;
  totalCost: number;
  costStatus: TransactionStatus;
  saleStatus: TransactionStatus;
  paymentMethod: string;
  notes: string;
  createdAt: string;
  productName?: string;
  emissor?: string;
  fees_type?: 'with_interest' | 'interest_free';
  fees_installments?: number;
  usd_rate?: number;
  eur_rate?: number;
  gbp_rate?: number;
  adults?: number;
  children?: number;
  babies?: number;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  emissor?: string;
}
export interface TeamMember {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  role: 'Administrador' | 'Gerente' | 'Vendedor' | 'Suporte' | 'Representante' | 'Contador';
  status: 'Ativo' | 'Inativo';
  salary: number;
  commissionPercent?: number;
  permissionsCount: number;
  birthDate?: string;
  address?: string;
  avatarUrl?: string;
}

export type CRMStatus = 'novo_contato' | 'em_cotacao' | 'proposta_enviada' | 'aprovado' | 'perdido';

export interface Lead {
  id: string;
  name: string;
  value: number;
  status: CRMStatus;
  phone?: string;
  email?: string;
  notes?: string;
  emissor: string;
  createdAt: string;
  updatedAt: string;
  source?: string; // Ex: Instagram, Indicação, etc.
  items?: any[]; // Itens da cotação
  tags?: string[];
  duration?: string;
  adults?: number;
  children?: number;
  babies?: number;
  luggage23kg?: number;
  title?: string;
  responded?: boolean;
  slaStartAt?: string;
  propostaEnviadaAt?: string;
  followUpHistory?: Record<string, { completed: boolean; completedBy?: string; completedAt?: string }>;
  markup?: number;
  taxes?: number;
  markup_type?: 'percentage' | 'fixed';
  cost?: number;
  usd_rate?: number;
  eur_rate?: number;
  gbp_rate?: number;
  fees_type?: 'with_interest' | 'interest_free';
  fees_installments?: number;
}
export interface FinancialAccount {
  id: string;
  name: string;
  type: 'Ativo' | 'Passivo';
  category: 'Banco' | 'Caixa' | 'Cartão de Crédito' | 'Milhas' | string;
  balance: number;
  status: 'Ativo' | 'Inativo';
  color?: string;
  icon?: string;
  createdAt: string;
}

export interface FinancialTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'Receita' | 'Despesa' | 'Transferência';
  category: string;
  accountId?: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  dueDate?: string;
  saleId?: string;
  supplierId?: string;
  competenceDate?: string;
  paymentDate?: string;
  recurrence?: string;
  reminder?: boolean;
  observations?: string;
  attachments?: any[];
  customerName?: string;
  supplierName?: string;
  createdAt: string;
}

export interface FinancialCategory {
  id: string;
  name: string;
  type: 'Receita' | 'Despesa';
  parentId?: string;
  status: 'Ativo' | 'Inativo';
  color?: string;
  count?: number; // Representar o contador visual (e.g., 68 despesas)
  sortOrder?: number;
}

export interface FinancialSettings {
  defaultIncomeAccountId?: string;
  defaultExpenseAccountId?: string;
  defaultBoardingTaxCardId?: string;
}

export type CalendarEventType = 'Check-in' | 'Embarque' | 'Hospedagem' | 'Follow-up' | 'Tarefa' | 'Reunião' | 'Lembrete' | 'Aniversariante';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  startDate: string;
  endDate?: string;
  description?: string;
  userId?: string;
  isAllDay?: boolean;
  createdAt: string;
}
