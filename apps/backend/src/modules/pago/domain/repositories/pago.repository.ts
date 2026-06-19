import { PagoEntity } from "../entities/entity";

export abstract class PagoRepository{
  abstract create (data: Omit<PagoEntity, 'id' | 'createdAt' | 'paidAt'|'voidedAt'|'status'>): Promise<PagoEntity>
  abstract update (data: Partial<PagoEntity> & {id: string}): Promise<PagoEntity>
  abstract findAll(): Promise<PagoEntity[]>
  abstract findById(id: string): Promise<PagoEntity>
  abstract findByVisitId(visitId: string): Promise<PagoEntity[]>
  abstract desactivar(id: string): Promise <PagoEntity>
  abstract activar(id: string): Promise <PagoEntity>
}