import { Injectable } from "@nestjs/common";
import { FaqRepository } from "../../domain/repositories/faq.repository";

@Injectable()
export class DeleteFaqUseCase {
  constructor(private readonly faqRepo: FaqRepository) {}

  async execute(id: string) {
    return this.faqRepo.softDelete(id);
  }
}
