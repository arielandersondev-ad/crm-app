import { Injectable } from "@nestjs/common";
import { ClienteRepository } from "../../domain/repository/cliente.repository";

@Injectable()
export class FindByTenantIdUseCase {
  constructor(private readonly clienteRepo: ClienteRepository) {}
  async execute(tenantId: string) {
    if (!tenantId) {
      throw new Error('TenantId es requerido');
    }
    return this.clienteRepo.findByTenantId(tenantId);
  }
}