import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { GetStatsUseCase } from "../../application/use-cases/get-stats.use-case";

@Controller("dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly getStatsUseCase: GetStatsUseCase) {}

  @Get("stats")
  async getStats(
    @CurrentUser("tenantId") tenantId: string,
    @CurrentUser("sucursalId") sucursalId: string,
  ) {
    return this.getStatsUseCase.execute(tenantId, sucursalId);
  }
}
