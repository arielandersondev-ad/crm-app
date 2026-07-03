import { Injectable } from "@nestjs/common";
import { GeneralConfigurationRepository } from "../../domain/repositories/general-configuration.repository";

@Injectable()
export class GetGeneralConfigurationUseCase {
  constructor(
    private readonly configRepository: GeneralConfigurationRepository,
  ) {}

  async execute(tenantId: string) {
    const config = await this.configRepository.findByTenantId(tenantId);
    if (!config) {
      return null;
    }
    return {
      id: config.id,
      tenantId: config.tenantId,
      botName: config.botName,
      welcomeMessage: config.welcomeMessage,
      fallbackMessage: config.fallbackMessage,
      disclaimer: config.disclaimer,
    };
  }
}
