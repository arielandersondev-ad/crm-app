import { Injectable } from "@nestjs/common";
import { FaqRepository } from "../../domain/repositories/faq.repository";
import { EmbeddingService } from "../../infrastructure/nlp/embedding.service";
import { FAQCategory } from "@prisma/client";

@Injectable()
export class UpdateFaqUseCase {
  constructor(
    private readonly faqRepo: FaqRepository,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async execute(id: string, data: { question?: string; answer?: string; category?: string; isActive?: boolean }) {
    let embedding: number[] | undefined;
    if (data.question) {
      embedding = await this.embeddingService.generate(data.question);
    }
    return this.faqRepo.update(id, { ...data, category: data.category as FAQCategory, embedding });
  }
}
