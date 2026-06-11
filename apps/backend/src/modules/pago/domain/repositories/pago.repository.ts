import { PagoEntity } from "../entities/entity";

export abstract class PagoRepository{
  abstract create (data: Omit<PagoEntity, 'id' | 'createdAt' | 'paidAt'>): Promise<PagoEntity>
  abstract update (data: Partial<PagoEntity> & {id: string}): Promise<PagoEntity>
  abstract findAll(): Promise<PagoEntity[]>
  abstract findById(id: string): Promise<PagoEntity>
  abstract findByVisitId(visitId: string): Promise<PagoEntity[]>
} 