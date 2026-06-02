export interface Client {
  id: string;
  tenantId: string;
  type: string;
  fullName: string;
  phone?: string;
  email?: string;
  documentNumber?: string;
  birthday?: string;
  address?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}