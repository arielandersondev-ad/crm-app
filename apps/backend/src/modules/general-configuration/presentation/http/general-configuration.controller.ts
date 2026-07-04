import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { GetGeneralConfigurationUseCase } from "../../application/use-cases/get-general-configuration.use-case";
import { UpdateGeneralConfigurationUseCase } from "../../application/use-cases/update-general-configuration.use-case";
import { UpdateGeneralConfigurationDto } from "../dto/update-general-configuration.dto";

@Controller("configuration")
@UseGuards(JwtAuthGuard)
export class GeneralConfigurationController {
  constructor(
    private readonly getConfigUseCase: GetGeneralConfigurationUseCase,
    private readonly updateConfigUseCase: UpdateGeneralConfigurationUseCase,
  ) {}

  @Get()
  async getConfig(@CurrentUser("tenantId") tenantId: string) {
    return this.getConfigUseCase.execute(tenantId);
  }

  @Put()
  async updateConfig(
    @CurrentUser("tenantId") tenantId: string,
    @Body() dto: UpdateGeneralConfigurationDto,
  ) {
    return this.updateConfigUseCase.execute(tenantId, dto);
  }
}
