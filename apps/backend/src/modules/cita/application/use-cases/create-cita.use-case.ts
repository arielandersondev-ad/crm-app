import { Injectable } from "@nestjs/common";
import { CitaRepository } from "../../domain/repositories/cita.repository";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";
import { CreateCitaDto } from "../../presentation/dto/create-cita.dto";
import { toUTC } from "../../../../common/utils/timezone.util";

@Injectable()
export class CreateCitaUseCase{
  constructor(
    private readonly citaRepo: CitaRepository,
    private readonly sucursalRepo: SucursalRepository,
  ){}
  async execute(tenantId:string,sucursalId: string,userId:string,data: CreateCitaDto){
    if(!tenantId) throw 'el tenantId es requerido'
    if(!sucursalId) throw 'el sucursalId es requerido'
    if(!userId) throw 'el id del usuario es requerido'

    const sucursal = await this.sucursalRepo.findById(sucursalId);
    const timezone = sucursal?.timezone ?? 'America/La_Paz';
    
    const scheduledAt = toUTC(data.scheduledAt, timezone);
    const payload = {...data,scheduledAt,tenantId,sucursalId,userId}
    return this.citaRepo.create(payload)
  }
}