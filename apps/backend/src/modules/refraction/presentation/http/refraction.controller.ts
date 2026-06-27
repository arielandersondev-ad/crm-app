import { Body, Controller, Param, ParseUUIDPipe, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { UpsertRefractionUseCase } from "../../application/use-cases/upsert-refraction.use-case";
import { UpsertRefractionDto } from "../dto/upsert-refraction.dto";

@Controller("consultation")
@UseGuards(JwtAuthGuard)
export class RefractionController {
  constructor(
    private readonly upsertRefractionUseCase: UpsertRefractionUseCase,
  ) {}

  @Patch(":id/refraction")
  async upsert(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpsertRefractionDto,
    @CurrentUser("tenantId") tenantId: string,
  ) {
    return this.upsertRefractionUseCase.execute(id, tenantId, dto);
  }
}
