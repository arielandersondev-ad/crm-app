import { Injectable } from "@nestjs/common";
import { ClienteRepository } from "../../domain/repository/cliente.repository";
import { UpdateClienteDto } from "../../presentation/dto/update-cliente.dto";

@Injectable()
export class UpdateClienteUseCase {
  constructor(
    private readonly clienteRepo: ClienteRepository
  ) {}
  async execute(tenantId: string, id: string, dto: UpdateClienteDto): Promise<void> {
    if (!tenantId) {
      throw new Error('TenantId es requerido');
    }
    await this.clienteRepo.update(
      id,
      tenantId,
      dto.fullName,
      dto.email,
      dto.phone,
      dto.documentNumber,
      dto.birthDate,
      dto.address,
      dto.notes
    );

  }
}