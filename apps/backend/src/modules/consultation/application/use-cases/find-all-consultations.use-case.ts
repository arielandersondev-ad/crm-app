import { Injectable } from "@nestjs/common";
import { ConsultationRepository } from "../../domain/repositories/consultation.repository";

@Injectable()
export class FindAllConsultationsUseCase {
  constructor(private readonly repo: ConsultationRepository) {}

  async execute(tenantId: string): Promise<any[]> {
    return this.repo.findAllByTenant(tenantId);
  }
}