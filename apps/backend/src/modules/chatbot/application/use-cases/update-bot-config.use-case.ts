import { Injectable } from "@nestjs/common";
import { BotConfigRepository } from "../../domain/repositories/bot-config.repository";
import type { BotConfig } from "@prisma/client";

@Injectable()
export class UpdateBotConfigUseCase {
  constructor(private readonly botConfigRepo: BotConfigRepository) {}

  async execute(tenantId: string, data: Partial<BotConfig>) {
    return this.botConfigRepo.upsert(tenantId, data);
  }
}
