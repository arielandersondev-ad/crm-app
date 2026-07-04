import { Injectable } from "@nestjs/common";
import { GeneralConfigurationRepository } from "../../domain/repositories/general-configuration.repository";
import { UpdateGeneralConfigurationDto } from "../../presentation/dto/update-general-configuration.dto";

@Injectable()
export class UpdateGeneralConfigurationUseCase {
  constructor(
    private readonly configRepository: GeneralConfigurationRepository,
  ) {}

  async execute(tenantId: string, dto: UpdateGeneralConfigurationDto) {
    return this.configRepository.upsert(tenantId, dto);
  }
}
