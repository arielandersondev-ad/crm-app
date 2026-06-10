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

export interface CreateVisitDetailDto {
  serviceId: string;
  quantity: number;
  notes?: string;
}

export interface UpdateVisitDetailDto {
  id: string;
  quantity?: number;
  notes?: string;
}