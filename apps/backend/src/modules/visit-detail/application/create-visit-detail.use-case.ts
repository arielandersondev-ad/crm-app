import { Injectable } from "@nestjs/common";
import { VisitDetailRepository } from "../domain/repositories/visit-detail.repository";
import { CreateVisitDetailDto } from "../presentation/dto/create-visit-detail.dto";
import { VisitDetailEntity } from "../domain/entities/visit-detail.entity";

@Injectable()
export class CreateVisitDetailUseCase {
  constructor(
    private readonly visitDetailRepo: VisitDetailRepository,
  ) {}

  execute(visitDetail: CreateVisitDetailDto): Promise<VisitDetailEntity> {
    return this.visitDetailRepo.create(visitDetail);
  }
}
