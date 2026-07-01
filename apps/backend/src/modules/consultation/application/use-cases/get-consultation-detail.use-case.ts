import { Injectable, NotFoundException } from "@nestjs/common";
import { ConsultationRepository } from "../../domain/repositories/consultation.repository";
import { ConsultationEntity } from "../../domain/entities/consultation.entity";

@Injectable()
export class GetConsultationDetailUseCase {
  constructor(private readonly repo: ConsultationRepository) {}

  async execute(id: string, tenantId: string): Promise<ConsultationEntity> {
    const consultation = await this.repo.findById(id, tenantId);
    if (!consultation) {
      throw new NotFoundException("Consulta no encontrada");
    }
    return consultation;
  }
}
