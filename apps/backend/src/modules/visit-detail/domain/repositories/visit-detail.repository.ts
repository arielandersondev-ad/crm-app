import { VisitDetailEntity } from "../entities/visit-detail.entity";

export abstract class VisitDetailRepository {
  abstract create(visitDetail: Omit<VisitDetailEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<VisitDetailEntity>;
  abstract update(visitDetail: Partial<VisitDetailEntity> & { id: string }): Promise<VisitDetailEntity>;
  abstract findById(id: string): Promise<VisitDetailEntity>;
  abstract createMany(visitDetails: Omit<VisitDetailEntity,'id' | 'createdAt' | 'updatedAt'>[]): Promise<VisitDetailEntity[]>;
  abstract findByVisitId(visitId: string): Promise<VisitDetailEntity[]>;
  abstract delete(id: string): Promise<VisitDetailEntity>;
}
