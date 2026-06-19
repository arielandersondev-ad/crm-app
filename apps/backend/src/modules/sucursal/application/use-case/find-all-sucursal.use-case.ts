import { Injectable } from "@nestjs/common";
import { SucursalRepository } from "../../domain/repositories/sucursal.repository";

@Injectable()
export class FindAllSucursalesUseCase {
  constructor(
    private readonly sucursalRepository: SucursalRepository,
  ){}
  async execute() {
    return this.sucursalRepository.findAll();
  }
}
