import { Injectable } from "@nestjs/common";
import { CitaRepository } from "../../domain/repositories/cita.repository";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";

@Injectable()
export class FindAgendaUseCase{
  constructor(
    private readonly citaRepo: CitaRepository,
    private readonly sucursalRepo: SucursalRepository,
  ){}
  async execute(tenantId: string, sucursalId:string){
    const sucursal = await this.sucursalRepo.findById(sucursalId);
    const timezone = sucursal?.timezone ?? 'America/La_Paz';

    const appointments = await this.citaRepo.getAgenda(tenantId, sucursalId)
    return {
      timezone,
      appointments: appointments.map((appointment) => ({
        id: appointment.id,
        status: appointment.status,
        scheduledAt: appointment.scheduledAt,
        hora: appointment.scheduledAt.toLocaleTimeString('es-BO',{
          hour: '2-digit',
          minute: '2-digit',
          timeZone: timezone
        }),
        clientFullName: appointment.client.fullName,
        userName: appointment.user
          ? `${appointment.user.firstName} ${appointment.user.lastName}`
          : null,
        visit: appointment.visit,
      })),
    };
  }
}