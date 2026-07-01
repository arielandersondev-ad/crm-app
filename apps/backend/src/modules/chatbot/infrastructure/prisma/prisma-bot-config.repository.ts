import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { BotConfigRepository } from "../../domain/repositories/bot-config.repository";
import type { BotConfig } from "@prisma/client";

@Injectable()
export class PrismaBotConfigRepository implements BotConfigRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenant(tenantId: string): Promise<BotConfig | null> {
    return this.prisma.botConfig.findUnique({ where: { tenantId } });
  }

  async upsert(tenantId: string, data?: Partial<BotConfig>): Promise<BotConfig> {
    return this.prisma.botConfig.upsert({
      where: { tenantId },
      update: data ?? {},
      create: { tenantId, ...data } as any,
    });
  }
}
