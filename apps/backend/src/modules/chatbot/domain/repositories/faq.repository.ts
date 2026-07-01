import { FAQ } from "@prisma/client";
import { CreateFaqDto } from "../../presentation/http/dto/create-faq.dto";
import { UpdateFaqDto } from "../../presentation/http/dto/update-faq.dto";

export abstract class FaqRepository {
  abstract findTopSimilar(tenantId: string, embedding: number[], limit: number): Promise<{ faq: FAQ; score: number }[]>;
  abstract findActiveByTenant(tenantId: string): Promise<FAQ[]>;
  abstract create(data: CreateFaqDto & { tenantId: string; embedding: number[] }): Promise<FAQ>;
  abstract update(id: string, data: UpdateFaqDto & { embedding?: number[] }): Promise<FAQ>;
  abstract softDelete(id: string): Promise<FAQ>;
}