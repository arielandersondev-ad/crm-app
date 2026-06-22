import { Injectable } from "@nestjs/common";
import { VisitRepository } from "../domain/repositories/visit.repository";
import { CreateVisitDto } from "../presentation/dto/create-visit.dto";
import { VisitEntity } from "../domain/entities/visit.entity";
import { CitaRepository } from "../../cita/domain/repositories/cita.repository";

@Injectable()
export class CreateVisitUseCase {
  constructor(
    private readonly visitRepo: VisitRepository,
    private readonly citaRepo: CitaRepository,
  ) {}
  async execute(createVisitDto: CreateVisitDto, tenantId: string, sucursalId: string, userId: string): Promise<VisitEntity> {
    if (!sucursalId) throw new Error('Sucursal ID is requerido')
    if (!tenantId) throw new Error('Tenant ID is requerido')

    let clientId = createVisitDto.clientId;
    let assignedUserId = userId;

    if (createVisitDto.appointmentId) {
      const appointment = await this.citaRepo.findById(createVisitDto.appointmentId, sucursalId, tenantId);
      if (!appointment) throw new Error('Cita no encontrada');
      clientId = appointment.clientId;
      assignedUserId = appointment.userId || userId;
    }

    if (!clientId) throw new Error('clientId es requerido');

    return this.visitRepo.create(tenantId, sucursalId, assignedUserId, {
      ...createVisitDto,
      clientId,
    });
  }
}