import { Cliente } from "../entities/cliente.entity";

export abstract class ClienteRepository {
  abstract findAll(): Promise<Cliente[]>;
  abstract findById(id: string): Promise<Cliente | null>;
  abstract findByTenantId(tenantId: string): Promise<Cliente[]>;
  abstract create(tenantId: string, fullname: string, email: string, phone: string, documentNumber?: string, birthday?: string, address?: string, notes?: string): Promise<Cliente>;
  abstract update(id: string, tenantId: string, fullname: string, email: string, phone: string, documentNumber: string, birthday?: string, address?: string, notes?: string, isActive?: boolean): Promise<Cliente>;
  abstract delete(id: string): Promise<void>;
  abstract softDeleteById(tenantId: string, id: string): Promise<void>;
  abstract restore(tenantId: string, id: string): Promise<void>;
  abstract findByTenantIdActivo(tenantId: string): Promise<Cliente[]>;
}