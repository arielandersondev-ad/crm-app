import { Injectable } from "@nestjs/common";
import { ClienteRepository } from "../../domain/repository/cliente.repository";

@Injectable()
export class ActivateClienteUseCase {
  constructor(
    private readonly clienteRepository: ClienteRepository,
  ) {}
  async execute(tenantId: string, id: string): Promise<void> {
    return this.clienteRepository.restore(tenantId, id);
  }
}
