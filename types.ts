export type ItemType = 'passagem' | 'hospedagem' | 'seguro' | 'aluguel' | 'adicionais';
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
  checkOut?: string;
  hasBreakfast?: boolean;
  hotelName?: string;
  description?: string;
  passengerName?: string;
  saleModel?: string;
  ticket_url?: string;
  ticket_url2?: string;
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
}
