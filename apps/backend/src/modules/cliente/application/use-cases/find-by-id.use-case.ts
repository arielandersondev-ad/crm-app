import { Injectable } from "@nestjs/common";
import { ClienteRepository } from "../../domain/repository/cliente.repository";

@Injectable()
export class FindByIdUseCase {
  constructor(private readonly clienteRepo: ClienteRepository) {}
  async execute(id: string) {
    if (!id) {
      throw new Error('Id es requerido');
    }
    return this.clienteRepo.findById(id);
  }
}