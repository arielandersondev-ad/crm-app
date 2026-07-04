import { Injectable } from "@nestjs/common";
import { ConsultationRepository } from "../../domain/repositories/consultation.repository";
import { ConsultationEntity } from "../../domain/entities/consultation.entity";

@Injectable()
export class GetPatientHistoryUseCase {
  constructor(private readonly repo: ConsultationRepository) {}

  async execute(clientId: string, tenantId: string): Promise<ConsultationEntity[]> {
    return this.repo.findByClientId(clientId, tenantId);
  }
}
