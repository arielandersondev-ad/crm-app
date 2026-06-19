import { Injectable } from "@nestjs/common";
import { VisitDetailRepository } from "../domain/repositories/visit-detail.repository";
import { VisitDetailEntity } from "../domain/entities/visit-detail.entity";

@Injectable()
export class FindVisitDetailUseCase {
  constructor(
    private readonly visitDetailRepo: VisitDetailRepository,
  ) {}
  async execute(visitId: string): Promise<VisitDetailEntity[]> {
    if (!visitId) throw new Error('Id de la visita no proporcionado')
    return await this.visitDetailRepo.findByVisitId(visitId);
  }
}
