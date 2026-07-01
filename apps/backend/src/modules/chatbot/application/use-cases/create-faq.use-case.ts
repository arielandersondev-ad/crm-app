import { Injectable } from "@nestjs/common";
import { FaqRepository } from "../../domain/repositories/faq.repository";
import { EmbeddingService } from "../../infrastructure/nlp/embedding.service";
import { FAQCategory } from "@prisma/client";

@Injectable()
export class CreateFaqUseCase {
  constructor(
    private readonly faqRepo: FaqRepository,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async execute(data: { tenantId: string; question: string; answer: string; category?: string }) {
    const embedding = await this.embeddingService.generate(data.question);
    return this.faqRepo.create({ ...data, category: data.category as FAQCategory, embedding });
  }
}
