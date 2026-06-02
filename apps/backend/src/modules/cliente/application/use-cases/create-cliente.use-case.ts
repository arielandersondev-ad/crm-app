import { Injectable } from "@nestjs/common";
import { ClienteRepository } from "../../domain/repository/cliente.repository";
import { Cliente } from "../../domain/entities/cliente.entity";
import { CreateClienteDto } from "../../presentation/dto/create-cliente.dto";

@Injectable()
export class CreateClienteUseCase {
  constructor(
    private readonly clienteRepo: ClienteRepository
  ) {}
  async execute(createClienteDto: CreateClienteDto): Promise<Cliente> {
    if (!createClienteDto.tenantId) {
      throw new Error('TenantId es requerido');
    }
    if (!createClienteDto.fullname) {
      throw new Error('Fullname es requerido');
    }
    if (!createClienteDto.email) {
      throw new Error('Email es requerido');
    }
    if (!createClienteDto.phone) {
      throw new Error('Phone es requerido');
    }
    return await this.clienteRepo.create(createClienteDto.tenantId, createClienteDto.fullname, createClienteDto.email, createClienteDto.phone, createClienteDto.documentNumber, createClienteDto.birthday, createClienteDto.address, createClienteDto.notes);
  }
}
