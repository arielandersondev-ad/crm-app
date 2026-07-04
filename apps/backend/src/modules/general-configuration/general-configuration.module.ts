import { Module } from "@nestjs/common";
import { GeneralConfigurationController } from "./presentation/http/general-configuration.controller";
import { GetGeneralConfigurationUseCase } from "./application/use-cases/get-general-configuration.use-case";
import { UpdateGeneralConfigurationUseCase } from "./application/use-cases/update-general-configuration.use-case";
import { GeneralConfigurationRepository } from "./domain/repositories/general-configuration.repository";
import { PrismaGeneralConfigurationRepository } from "./infrastructure/prisma/prisma-general-configuration.repository";

@Module({
  controllers: [GeneralConfigurationController],
  providers: [
    GetGeneralConfigurationUseCase,
    UpdateGeneralConfigurationUseCase,
    {
      provide: GeneralConfigurationRepository,
      useClass: PrismaGeneralConfigurationRepository,
    },
  ],
  exports: [GeneralConfigurationRepository],
})
export class GeneralConfigurationModule {}
