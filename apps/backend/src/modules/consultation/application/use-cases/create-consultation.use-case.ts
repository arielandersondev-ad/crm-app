import { Injectable } from "@nestjs/common";
import { ConsultationRepository } from "../../domain/repositories/consultation.repository";
import { ConsultationEntity } from "../../domain/entities/consultation.entity";
import { CreateConsultationDto } from "../../presentation/dto/create-consultation.dto";
import { CitaRepository } from "../../../cita/domain/repositories/cita.repository";

@Injectable()
export class CreateConsultationUseCase {
  constructor(
    private readonly repo: ConsultationRepository,
    private readonly citaRepo: CitaRepository,
  ) {}

  async execute(dto: CreateConsultationDto, tenantId: string, userId: string, sucursalId: string): Promise<ConsultationEntity> {
    if (!dto.motivo) throw new Error("El motivo de consulta es obligatorio");

    if (dto.nextControlAt) {
      await this.citaRepo.create({
        clientId: dto.clientId,
        scheduledAt: new Date(dto.nextControlAt),
        tenantId,
        userId,
        sucursalId,
      });
    }

    return this.repo.create({ ...dto, tenantId, userId });
  }
}
