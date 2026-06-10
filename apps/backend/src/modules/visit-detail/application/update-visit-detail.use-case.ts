import { Injectable } from "@nestjs/common";
import { VisitDetailRepository } from "../domain/repositories/visit-detail.repository";
import { VisitDetailEntity } from "../domain/entities/visit-detail.entity";
import { UpdateVisitDetailDto } from "../presentation/dto/update-visit-detail.dto";

@Injectable()
export class UpdateVisitDetailUseCase {
  constructor(
    private readonly visitDetailRepo: VisitDetailRepository,
  ) {}

  execute(visitDetail: UpdateVisitDetailDto): Promise<VisitDetailEntity> {
    return this.visitDetailRepo.update(visitDetail);
  }
}
