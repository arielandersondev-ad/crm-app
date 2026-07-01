import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { FaqRepository } from "../../domain/repositories/faq.repository";
import { SimilarityService } from "../nlp/similarity.service";
import type { FAQ } from "@prisma/client";

@Injectable()
export class PrismaFaqRepository implements FaqRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly similarityService: SimilarityService,
  ) {}

  async findTopSimilar(tenantId: string, embedding: number[], limit = 5): Promise<{ faq: FAQ; score: number }[]> {
    const faqs = await this.prisma.fAQ.findMany({
      where: { tenantId, isActive: true, embedding: { not: null } },
    });

    const scored = faqs
      .map((faq) => ({
        faq,
        score: this.similarityService.cosineSimilarity(embedding, faq.embedding as unknown as number[]),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored;
  }

  async findActiveByTenant(tenantId: string): Promise<FAQ[]> {
    return this.prisma.fAQ.findMany({ where: { tenantId, isActive: true } });
  }

  async findById(id: string): Promise<FAQ | null> {
    return this.prisma.fAQ.findUnique({ where: { id } });
  }

  async create(data: { tenantId: string; question: string; answer: string; category?: string; embedding?: number[] }): Promise<FAQ> {
    return this.prisma.fAQ.create({
      data: {
        tenantId: data.tenantId,
        question: data.question,
        answer: data.answer,
        category: data.category as any,
        embedding: data.embedding ?? undefined,
      },
    });
  }

  async update(id: string, data: { question?: string; answer?: string; category?: string; isActive?: boolean; embedding?: number[] }): Promise<FAQ> {
    return this.prisma.fAQ.update({
      where: { id },
      data: {
        ...(data.question !== undefined && { question: data.question }),
        ...(data.answer !== undefined && { answer: data.answer }),
        ...(data.category !== undefined && { category: data.category as any }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.embedding !== undefined && { embedding: data.embedding }),
      },
    });
  }

  async softDelete(id: string): Promise<FAQ> {
    return this.prisma.fAQ.update({ where: { id }, data: { isActive: false } });
  }
}
