import { Body, Controller, Param, ParseUUIDPipe, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { RolesGuard } from "../../../../common/guards/roles.guard";
import { Roles } from "../../../../common/decorators/roles.decorator";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { UpsertRefractionUseCase } from "../../application/use-cases/upsert-refraction.use-case";
import { UpsertRefractionDto } from "../dto/upsert-refraction.dto";

@Controller("consultation")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RefractionController {
  constructor(
    private readonly upsertRefractionUseCase: UpsertRefractionUseCase,
  ) {}

  @Patch(":id/refraction")
  @Roles("ADMIN", "OWNER", "EMPLOYEE")
  async upsert(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpsertRefractionDto,
    @CurrentUser("tenantId") tenantId: string,
  ) {
    return this.upsertRefractionUseCase.execute(id, tenantId, dto);
  }
}
