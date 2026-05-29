import { Injectable } from "@nestjs/common";
import { SucursalRepository } from "../../domain/repositories/sucursal.repository";

@Injectable()
export class FindOneSucursalUseCase {
  constructor(
    private readonly sucursalRepository: SucursalRepository,
  ) {}
  async execute(id: string) {
    return this.sucursalRepository.findById(id);
  }
}