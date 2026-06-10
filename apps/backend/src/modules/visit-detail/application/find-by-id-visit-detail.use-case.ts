import { Injectable } from "@nestjs/common";
import { VisitDetailRepository } from "../domain/repositories/visit-detail.repository";
import { VisitDetailEntity } from "../domain/entities/visit-detail.entity";

@Injectable()
export class FindByIdVisitDetailUseCase {
  constructor(
    private readonly visitDetailRepo: VisitDetailRepository,
  ) {}

  execute(id: string): Promise<VisitDetailEntity> {
    return this.visitDetailRepo.findById(id);
  }
}
