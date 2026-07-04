import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { AppointmentStatus } from "@prisma/client";
import { CitaRepository } from "../../../cita/domain/repositories/cita.repository";
import { CreateConsultationUseCase } from "./create-consultation.use-case";

@Injectable()
export class StartConsultationUseCase {
  constructor(
    private readonly citaRepo: CitaRepository,
    private readonly createConsultationUseCase: CreateConsultationUseCase,
  ) {}

  async execute(appointmentId: string, tenantId: string, userId: string, sucursalId: string) {
    const appointment = await this.citaRepo.findById(appointmentId, sucursalId, tenantId);
    if (!appointment) {
      throw new NotFoundException("Cita no encontrada");
    }

    if (appointment.status === "CANCELLED" || appointment.status === "NO_SHOW") {
      throw new BadRequestException("No se puede iniciar una consulta desde una cita cancelada o con inasistencia");
    }

    if (appointment.status === "COMPLETED") {
      throw new BadRequestException("Esta cita ya fue atendida");
    }

    const consultation = await this.createConsultationUseCase.execute(
      {
        clientId: appointment.clientId,
        appointmentId: appointment.id,
        motivo: "Atención desde cita programada",
      },
      tenantId,
      userId,
      sucursalId,
    );

    await this.citaRepo.update({
      id: appointment.id,
      tenantId: appointment.tenantId,
      sucursalId: appointment.sucursalId,
      clientId: appointment.clientId,
      userId: appointment.userId,
      scheduledAt: appointment.scheduledAt,
      status: AppointmentStatus.COMPLETED,
    });

    return consultation;
  }
}