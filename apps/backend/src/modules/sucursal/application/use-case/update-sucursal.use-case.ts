import { Injectable } from "@nestjs/common";
import { SucursalRepository } from "../../domain/repositories/sucursal.repository";
import { UpdateSucursalDto } from "../../presentation/dto/update-sucursal.dto";

@Injectable()
export class UpdateSucursalUseCase {
  constructor(
    private readonly sucursalRepository: SucursalRepository,
  ) {}
  async execute(id: string, dto: UpdateSucursalDto) {
    return this.sucursalRepository.update(id, dto.name, dto.direccion, dto.latitude, dto.longitude, dto.telefono, dto.correo);
  }
}