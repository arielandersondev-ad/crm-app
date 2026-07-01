import { Injectable } from "@nestjs/common";
import { BotConfigRepository } from "../../domain/repositories/bot-config.repository";

@Injectable()
export class GetBotConfigUseCase {
  constructor(private readonly botConfigRepo: BotConfigRepository) {}

  async execute(tenantId: string) {
    return this.botConfigRepo.findByTenant(tenantId);
  }
}
