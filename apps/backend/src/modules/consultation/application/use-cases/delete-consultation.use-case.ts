import { Injectable, NotFoundException } from "@nestjs/common";
import { ConsultationRepository } from "../../domain/repositories/consultation.repository";

@Injectable()
export class DeleteConsultationUseCase {
  constructor(private readonly repo: ConsultationRepository) {}

  async execute(id: string, tenantId: string): Promise<void> {
    const existing = await this.repo.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException("Consulta no encontrada");
    }
    await this.repo.softDelete(id, tenantId);
  }
}
