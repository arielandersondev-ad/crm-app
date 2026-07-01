import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { ConsultationRepository } from "../../domain/repositories/consultation.repository";
import { ConsultationEntity, ConsultationStatus } from "../../domain/entities/consultation.entity";
import { CreateConsultationDto } from "../../presentation/dto/create-consultation.dto";
import { UpdateConsultationDto } from "../../presentation/dto/update-consultation.dto";

@Injectable()
export class PrismaConsultationRepository implements ConsultationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(item: any): ConsultationEntity {
    return new ConsultationEntity(
      item.id,
      item.tenantId,
      item.clientId,
      item.userId,
      item.visitId ?? null,
      item.appointmentId ?? null,
      item.consultationDate,
      item.status as ConsultationStatus,
      item.motivo,
      item.diagnostico ?? null,
      item.observaciones ?? null,
      item.nextControlAt ?? null,
      item.createdAt,
      item.updatedAt,
      item.refraction ?? null,
    );
  }

  async create(data: CreateConsultationDto & { tenantId: string; userId: string }): Promise<ConsultationEntity> {
    const result = await this.prisma.consultation.create({
      data: {
        tenantId: data.tenantId,
        clientId: data.clientId,
        userId: data.userId,
        visitId: data.visitId ?? null,
        appointmentId: data.appointmentId ?? null,
        consultationDate: data.consultationDate ? new Date(data.consultationDate) : new Date(),
        motivo: data.motivo,
        diagnostico: data.diagnostico ?? null,
        observaciones: data.observaciones ?? null,
        nextControlAt: data.nextControlAt ? new Date(data.nextControlAt) : null,
      },
    });
    return this.toEntity(result);
  }

  async update(id: string, tenantId: string, data: UpdateConsultationDto): Promise<ConsultationEntity> {
    const result = await this.prisma.consultation.update({
      where: { id, tenantId },
      data: {
        motivo: data.motivo ?? undefined,
        diagnostico: data.diagnostico ?? undefined,
        observaciones: data.observaciones ?? undefined,
        nextControlAt: data.nextControlAt ? new Date(data.nextControlAt) : undefined,
        consultationDate: data.consultationDate ? new Date(data.consultationDate) : undefined,
        status: data.status as any ?? undefined,
      },
    });
    return this.toEntity(result);
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    await this.prisma.consultation.update({
      where: { id, tenantId },
      data: { status: "CANCELLED" as any },
    });
  }

  async findById(id: string, tenantId: string): Promise<ConsultationEntity | null> {
    const result = await this.prisma.consultation.findUnique({
      where: { id, tenantId },
      include: {
        refraction: true,
      },
    });
    if (!result) return null;
    return this.toEntity(result);
  }

  async findByClientId(clientId: string, tenantId: string): Promise<ConsultationEntity[]> {
    const results = await this.prisma.consultation.findMany({
      where: { clientId, tenantId },
      orderBy: { consultationDate: "desc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        refraction: true,
      },
    });
    //console.log("[Prisma findByClientId] refraction data:", JSON.stringify(results.map((r) => ({ id: r.id, hasRefraction: !!r.refraction, refraction: r.refraction })), null, 2));
    return results.map((r) => this.toEntity(r));
  }
}
