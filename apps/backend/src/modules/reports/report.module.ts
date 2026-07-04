import { Module } from "@nestjs/common";
import { ReportController } from "./presentation/http/report.controller";
import { GetConsultationsByPeriodUseCase } from "./application/use-cases/get-consultations-by-period.use-case";
import { GetDoctorStatisticsUseCase } from "./application/use-cases/get-doctor-statistics.use-case";
import { GetUpcomingControlsUseCase } from "./application/use-cases/get-upcoming-controls.use-case";
import { GetClinicalSummaryUseCase } from "./application/use-cases/get-clinical-summary.use-case";
import { PrismaReportRepository } from "./infrastructure/prisma/prisma-report.repository";
import { ReportRepository } from "./domain/repositories/report.repository";
import { PdfService } from "./infrastructure/pdf/pdf.service";
import { PrismaService } from "../../common/infrastructure/database/prisma/prisma.service";
import { SucursalModule } from "../sucursal/sucursal.module";

@Module({
  imports: [SucursalModule],
  controllers: [ReportController],
  providers: [
    GetConsultationsByPeriodUseCase,
    GetDoctorStatisticsUseCase,
    GetUpcomingControlsUseCase,
    GetClinicalSummaryUseCase,
    PdfService,
    PrismaService,
    { provide: ReportRepository, useClass: PrismaReportRepository },
  ],
  exports: [ReportRepository, PdfService],
})
export class ReportModule {}
