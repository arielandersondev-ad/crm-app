import { Injectable } from "@nestjs/common";
import { SucursalRepository } from "../../domain/repositories/sucursal.repository";

@Injectable()
export class FindAllSucursalesUseCase {
  constructor(
    private readonly sucursalRepository: SucursalRepository,
  ){}
  async execute(tenantId:string) {
    if (tenantId){
      return this.sucursalRepository.findByTenantId(tenantId);
    }
    return this.sucursalRepository.findAll();
  }
}
