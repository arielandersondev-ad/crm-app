import { Injectable } from "@nestjs/common";
import { ClienteRepository } from "../../domain/repository/cliente.repository";
import { UpdateClienteDto } from "../../presentation/dto/update-cliente.dto";

@Injectable()
export class UpdateClienteUseCase {
  constructor(
    private readonly clienteRepo: ClienteRepository
  ) {}
  async execute(id: string,dto: UpdateClienteDto): Promise<void> {
    if (!id) {
      throw new Error('Id es requerido');
    }
    await this.clienteRepo.update(
      id,
      dto.tenantId,
      dto.fullname,
      dto.email,
      dto.phone,
      dto.documentNumber,
      dto.birthday,
      dto.address,
      dto.notes
    );

  }
}