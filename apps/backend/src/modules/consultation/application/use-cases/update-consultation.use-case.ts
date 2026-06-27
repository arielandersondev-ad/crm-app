import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { ConsultationRepository } from "../../domain/repositories/consultation.repository";
import { ConsultationEntity, ConsultationStatus } from "../../domain/entities/consultation.entity";
import { UpdateConsultationDto } from "../../presentation/dto/update-consultation.dto";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { CitaRepository } from "../../../cita/domain/repositories/cita.repository";

@Injectable()
export class UpdateConsultationUseCase {
  constructor(
    private readonly repo: ConsultationRepository,
    private readonly citaRepo: CitaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: string, dto: UpdateConsultationDto, tenantId: string, userId: string, sucursalId: string): Promise<ConsultationEntity> {
    const existing = await this.repo.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException("Consulta no encontrada");
    }

    // Solo DRAFT puede editarse
    if (existing.status !== ConsultationStatus.DRAFT) {
      throw new ForbiddenException("Solo se pueden editar consultas en estado borrador");
    }

    if (dto.nextControlAt) {
      await this.citaRepo.create({
        clientId: existing.clientId,
        scheduledAt: new Date(dto.nextControlAt),
        tenantId,
        userId,
        sucursalId,
      });
    }

    const updated = await this.repo.update(id, tenantId, dto);

    // Registrar en AuditLog
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        accion: "UPDATE_CONSULTATION",
        entidad: "Consultation",
        entidadId: id,
        detalle: `Editada consulta para paciente ${existing.clientId}`,
      },
    });

    return updated;
  }
}
