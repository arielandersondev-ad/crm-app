export interface Client {
  id: string;
  tenantId: string;
  type: string;
  fullName: string;
  phone?: string;
  email?: string;
  documentNumber?: string;
  birthDate?: string;
  address?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateClientDto {
  tenantId: string;
  type?: string;
  fullName: string;
  phone: string;
  email: string;
  documentNumber?: string;
  birthDate?: string;
  address?: string;
  notes?: string;
}
export interface UpdateClientDto {
  id: string;
  type?: string;
  fullName: string;
  phone: string;
  email: string;
  documentNumber?: string;
  birthDate?: string;
  address?: string;
  notes?: string;
}
