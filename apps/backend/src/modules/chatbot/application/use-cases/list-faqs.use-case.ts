import { Injectable } from "@nestjs/common";
import { FaqRepository } from "../../domain/repositories/faq.repository";

@Injectable()
export class ListFaqsUseCase {
  constructor(private readonly faqRepo: FaqRepository) {}

  async execute(tenantId: string) {
    return this.faqRepo.findActiveByTenant(tenantId);
  }
}
