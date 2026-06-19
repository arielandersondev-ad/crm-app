import { Injectable } from "@nestjs/common";
import { CitaRepository } from "../../domain/repositories/cita.repository";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";
import { UpdateCitaDto } from "../../presentation/dto/update-cita.dto";
import { toUTC } from "../../../../common/utils/timezone.util";

@Injectable()
export class UpdateCitaUseCase{
  constructor(
    private readonly citaRepo: CitaRepository,
    private readonly sucursalRepo: SucursalRepository,
  ){}
  async execute(tenantId:string,sucursalId: string,id:string,data: UpdateCitaDto){
    if(!tenantId) throw 'el tenantId es requerido'
    if(!sucursalId) throw 'el sucursalId es requerido'
    
    const sucursal = await this.sucursalRepo.findById(sucursalId);
    const timezone = sucursal?.timezone ?? 'America/La_Paz';

    const {scheduledAt, ...more} = data
    const payload = {id,tenantId,sucursalId,scheduledAt: scheduledAt ? toUTC(scheduledAt, timezone) : undefined, ...more}
    return this.citaRepo.update(payload)
  }
}