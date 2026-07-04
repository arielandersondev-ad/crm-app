import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { ChatLogRepository } from "../../domain/repositories/chat-log.repository";
import type { ChatLog } from "@prisma/client";

@Injectable()
export class PrismaChatLogRepository implements ChatLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    tenantId: string;
    userId?: string;
    question: string;
    answer: string;
    source: string;
    intent?: string;
    confidence?: number;
    responseTime?: number;
    modelName?: string;
    usedAI?: boolean;
  }): Promise<ChatLog> {
    return this.prisma.chatLog.create({ data } as any);
  }

  async findByTenant(tenantId: string, limit = 50): Promise<ChatLog[]> {
    return this.prisma.chatLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
