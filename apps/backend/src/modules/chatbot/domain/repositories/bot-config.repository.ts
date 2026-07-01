import type { BotConfig } from "@prisma/client";

export abstract class BotConfigRepository {
  abstract findByTenant(tenantId: string): Promise<BotConfig | null>;
  abstract upsert(tenantId: string, data?: Partial<BotConfig>): Promise<BotConfig>;
}
