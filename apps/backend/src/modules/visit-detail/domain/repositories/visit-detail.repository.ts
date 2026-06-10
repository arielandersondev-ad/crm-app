import { CreateVisitDetailDto } from "../../presentation/dto/create-visit-detail.dto";
import { UpdateVisitDetailDto } from "../../presentation/dto/update-visit-detail.dto";
import { VisitDetailEntity } from "../entities/visit-detail.entity";

export abstract class VisitDetailRepository {
  abstract create(visitDetail: CreateVisitDetailDto): Promise<VisitDetailEntity>;
  abstract update(visitDetail: UpdateVisitDetailDto): Promise<VisitDetailEntity>;
  abstract findById(id: string): Promise<VisitDetailEntity>;
 }
