import { Injectable } from "@nestjs/common";
import { CitaRepository } from "../../domain/repositories/cita.repository";

@Injectable()
export class FindAllBySucursalUseCase{
  constructor(
    private readonly citaRepo: CitaRepository
  ){}
  execute(sucursalId: string, tenantId: string){
    if(!sucursalId) throw 'sucursalId es requerido'
    if(!tenantId) throw 'en tenantId es requerido'
    return this.citaRepo.findAllBySucursal(sucursalId, tenantId)
  }
}