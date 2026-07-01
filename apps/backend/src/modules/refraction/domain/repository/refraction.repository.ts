import { RefractionEntity } from "../entities/refraction.entity";

export abstract class RefractionRepository {
  abstract findByConsultationId(consultationId: string): Promise<RefractionEntity | null>;
  abstract upsert(consultationId: string, data: Record<string, any>): Promise<RefractionEntity>;
}
