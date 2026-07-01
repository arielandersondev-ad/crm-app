import type { ChatLog } from "@prisma/client";

export abstract class ChatLogRepository {
  abstract create(data: {
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
  }): Promise<ChatLog>;
  abstract findByTenant(tenantId: string, limit?: number): Promise<ChatLog[]>;
}
