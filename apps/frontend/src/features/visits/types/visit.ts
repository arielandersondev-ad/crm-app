export interface Visit {
  id: string;
  tenantId: string;
  sucursalId: string;
  clientId: string;
  userId: string;
  appointmentId: string | null;
  status: string;
  notes: string;
  startedAt: string;
  completedAt: string;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones (para la página de detalle)
  client?: {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  details?: VisitDetail[];
}

export interface VisitDetail {
  id: string;
  visitId: string;
  serviceId: string;
  quantity: number;
  serviceName: string;
  unitPrice: number; // Decimal
  totalPrice: number; // Decimal
  notes?: string;
  createdAt: Date;
}
export interface CreateVisitDto {
  clientId?: string;
  appointmentId?: string;
}
export interface CreateVisitDetailDto {
  visitId: string;
  serviceId: string;
  quantity: number;
  notes?: string;
}

export interface CreateVisitItemDto {
  serviceId: string;
  quantity: number;
  notes?: string;
}

export interface CreateManyVisitDetailDto {
  visitId: string;
  details: CreateVisitItemDto[];
}

export interface UpdateVisitDetailDto {
  id: string;
  visitId?: string;
  serviceId?: string;
  quantity?: number;
  notes?: string;
}

export interface Payment {
  id: string;
  visitId: string;
  sucursalId: string;
  amount: number;
  method: 'CASH' | 'QR' | 'TRANSFER' | 'CARD';
  reference?: string;
  notes?: string;
  createdAt: Date;
  paidAt: Date;
  status?: 'ACTIVE' | 'VOIDED'
  voidedAt?: Date
}

export interface CreatePaymentDto {
  visitId: string;
  amount: number;
  method: Payment['method'];
  reference?: string;
  notes?: string;
}
export interface UpdatePaymentDto {
  id: string
  visitId: string;
  amount: number;
  method: Payment['method'];
  reference?: string;
  notes?: string;
  paidAt: Date
  status?: 'ACTIVE' | 'VOIDED'
  voidedAt?: Date
}