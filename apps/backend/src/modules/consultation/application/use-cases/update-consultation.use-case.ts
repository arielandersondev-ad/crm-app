import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { ConsultationRepository } from "../../domain/repositories/consultation.repository";
import { ConsultationEntity, ConsultationStatus } from "../../domain/entities/consultation.entity";
import { UpdateConsultationDto } from "../../presentation/dto/update-consultation.dto";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { CitaRepository } from "../../../cita/domain/repositories/cita.repository";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";
import { toUTC } from "../../../../common/utils/timezone.util";

@Injectable()
export class UpdateConsultationUseCase {
  constructor(
    private readonly repo: ConsultationRepository,
    private readonly citaRepo: CitaRepository,
    private readonly prisma: PrismaService,
    private readonly sucursalRepo: SucursalRepository,
  ) {}

  async execute(id: string, dto: UpdateConsultationDto, tenantId: string, userId: string, sucursalId: string): Promise<ConsultationEntity> {
    const existing = await this.repo.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException("Consulta no encontrada");
    }

    const isFinalizing = dto.status === ConsultationStatus.COMPLETED && existing.status === ConsultationStatus.DRAFT;

    // Solo DRAFT puede editarse, excepto cuando se finaliza (DRAFT→COMPLETED)
    if (!isFinalizing && existing.status !== ConsultationStatus.DRAFT) {
      throw new ForbiddenException("Solo se pueden editar consultas en estado borrador");
    }

    const sucursal = await this.sucursalRepo.findById(sucursalId);
    const timezone = sucursal?.timezone ?? "America/La_Paz";
    const normalizedDto = {
      ...dto,
      nextControlAt: dto.nextControlAt ? toUTC(dto.nextControlAt, timezone).toISOString() : undefined,
      consultationDate: dto.consultationDate ? toUTC(dto.consultationDate, timezone).toISOString() : undefined,
    };

    if (normalizedDto.nextControlAt) {
      const existingAppointments = await this.citaRepo.findByClientId(existing.clientId);
      const nextDate = new Date(normalizedDto.nextControlAt);
      const hasAppointment = existingAppointments.some(
        (a) =>
          a.tenantId === tenantId && a.sucursalId === sucursalId &&
          a.id !== existing.appointmentId &&
          a.scheduledAt.getTime() === nextDate.getTime() &&
          (a.status === "PENDING" || a.status === "CONFIRMED"),
      );

      if (!hasAppointment) {
        await this.citaRepo.create({
          clientId: existing.clientId,
          scheduledAt: nextDate,
          tenantId,
          userId,
          sucursalId,
        });
      }
    }

    const updated = await this.repo.update(id, tenantId, normalizedDto);

    // Si se finaliza la consulta, sincronizar la cita asociada a COMPLETED
    if (isFinalizing && existing.appointmentId) {
      await this.prisma.appointment.update({
        where: { id: existing.appointmentId, tenantId, sucursalId },
        data: { status: "COMPLETED" },
      });
    }

    // Registrar en AuditLog
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        accion: isFinalizing ? "COMPLETE_CONSULTATION" : "UPDATE_CONSULTATION",
        entidad: "Consultation",
        entidadId: id,
        detalle: isFinalizing
          ? `Consulta finalizada para paciente ${existing.clientId}`
          : `Editada consulta para paciente ${existing.clientId}`,
      },
    });

    return updated;
  }
}
