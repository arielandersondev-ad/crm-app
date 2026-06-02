import { Injectable } from '@nestjs/common';
import { ClienteRepository } from '../../domain/repository/cliente.repository';
@Injectable()
export class FindAllUseCase {
  constructor(private readonly clienteRepo: ClienteRepository) {}
  async execute() {
    return this.clienteRepo.findAll();
  }
}
