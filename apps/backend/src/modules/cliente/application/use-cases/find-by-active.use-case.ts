import { Injectable } from "@nestjs/common";
import { Cliente } from "../../domain/entities/cliente.entity";
import { ClienteRepository } from "../../domain/repository/cliente.repository";

@Injectable()
export class FindByTenantIdActivoClienteUseCase {
  constructor(
    private readonly clienteRepo: ClienteRepository,
  ){}
  async execute(tenantId: string): Promise<Cliente[]> {
    if (!tenantId) {
      throw new Error('TenantId is required');
    }
    return this.clienteRepo.findByTenantIdActivo(tenantId);
  }
}
