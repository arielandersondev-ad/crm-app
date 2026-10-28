import { Injectable } from "@nestjs/common";
import { ConsultationRepository } from "../../domain/repositories/consultation.repository";
import { ConsultationEntity } from "../../domain/entities/consultation.entity";
import { CreateConsultationDto } from "../../presentation/dto/create-consultation.dto";
import { CitaRepository } from "../../../cita/domain/repositories/cita.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";
import { toUTC } from "../../../../common/utils/timezone.util";

@Injectable()
export class CreateConsultationUseCase {
  constructor(
    private readonly repo: ConsultationRepository,
    private readonly citaRepo: CitaRepository,
    private readonly prisma: PrismaService,
    private readonly sucursalRepo: SucursalRepository,
  ) {}

  async execute(dto: CreateConsultationDto, tenantId: string, userId: string, sucursalId: string): Promise<ConsultationEntity> {
    if (!dto.motivo) throw new Error("El motivo de consulta es obligatorio");

    const sucursal = await this.sucursalRepo.findById(sucursalId);
    const timezone = sucursal?.timezone ?? "America/La_Paz";
    const normalizedDto = {
      ...dto,
      nextControlAt: dto.nextControlAt ? toUTC(dto.nextControlAt, timezone).toISOString() : undefined,
      consultationDate: dto.consultationDate ? toUTC(dto.consultationDate, timezone).toISOString() : undefined,
    };

    if (normalizedDto.nextControlAt) {
      const nextDate = new Date(normalizedDto.nextControlAt);
      const appointments = await this.citaRepo.findByClientId(dto.clientId);
      const hasAppointment = appointments.some((appointment) =>
        appointment.tenantId === tenantId && appointment.sucursalId === sucursalId &&
        appointment.scheduledAt.getTime() === nextDate.getTime() &&
        (appointment.status === "PENDING" || appointment.status === "CONFIRMED"),
      );
      if (!hasAppointment) await this.citaRepo.create({
        clientId: dto.clientId,
        scheduledAt: nextDate,
        tenantId,
        userId,
        sucursalId,
      });
    }

    const consultation = await this.repo.create({ ...normalizedDto, tenantId, userId });

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        accion: "CREATE_CONSULTATION",
        entidad: "Consultation",
        entidadId: consultation.id,
        detalle: `Creada consulta para paciente ${dto.clientId}`,
      },
    });

    return consultation;
  }
}
