import { Injectable } from "@nestjs/common";
import { ClienteRepository } from "../../domain/repository/cliente.repository";

@Injectable()
export class DeleteClienteUseCase {
  constructor(
    private readonly clienteRepo: ClienteRepository
  ) {}
  async execute(tenantId: string, id: string): Promise<void> {
    if (!id) {
      throw new Error('Id es requerido');
    }
    await this.clienteRepo.softDeleteById(tenantId, id);
  }
}