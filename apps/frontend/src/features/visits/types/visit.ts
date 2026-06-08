export interface Visit {
  id: string;
  tenantId: string;
  sucursalId: string;
  clientId: string;
  serviceId: string;
  userId: string;
  apointmentId: string;
  status: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVisitDto {

  clientId: string;
  serviceId: string | null;
  userId: string | null;
  apointmentId: string | null;
}
export interface UpdateVisitDto {
  id: string;
  tenantId: string;
  sucursalId: string;
  clientId: string;
  serviceId: string;
  userId: string;
  apointmentId: string;
  status: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
