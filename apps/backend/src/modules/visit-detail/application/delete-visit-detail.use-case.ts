import { Injectable } from "@nestjs/common";
import { VisitDetailRepository } from "../domain/repositories/visit-detail.repository";
import { VisitDetailEntity } from "../domain/entities/visit-detail.entity";

@Injectable()
export class DeleteVisitDetailUseCase {
  constructor(
    private readonly visitDetailRepo: VisitDetailRepository,
  ) {}
  async execute(id: string): Promise<VisitDetailEntity> {
    if (!id) throw new Error('Id no proporcionado')
    return await this.visitDetailRepo.delete(id);
  }
}
