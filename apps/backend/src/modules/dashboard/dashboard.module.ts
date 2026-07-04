import { Module } from "@nestjs/common";
import { DashboardController } from "./presentation/http/dashboard.controller";
import { GetStatsUseCase } from "./application/use-cases/get-stats.use-case";
import { DashboardRepository } from "./domain/repositories/dashboard.repository";
import { PrismaDashboardRepository } from "./infrastructure/prisma/prisma-dashboard.repository";
import { ReportModule } from "../../modules/reports/report.module";

@Module({
  imports: [ReportModule],
  controllers: [DashboardController],
  providers: [
    GetStatsUseCase,
    {
      provide: DashboardRepository,
      useClass: PrismaDashboardRepository,
    },
  ],
})
export class DashboardModule {}
