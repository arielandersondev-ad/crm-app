import { Injectable } from "@nestjs/common";
import { FaqRepository } from "../../domain/repositories/faq.repository";
import { EmbeddingService } from "../../infrastructure/nlp/embedding.service";

@Injectable()
export class ReindexFaqsUseCase {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly faqRepo: FaqRepository,
  ) {}
async execute(tenantId: string) {
  const faqs = await this.faqRepo.findActiveByTenant(tenantId);
  let count = 0;
  for (const faq of faqs) {
    if (!faq.embedding) {
      const embedding = await this.embeddingService.generate(faq.question);
      await this.faqRepo.update(faq.id, { embedding });
      count++;
    }
  }
  return { reindexed: count };
}
}