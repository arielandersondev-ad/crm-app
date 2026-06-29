import { Controller, Get, Param, Post, Body, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { RolesGuard } from "../../../../common/guards/roles.guard";
import { Roles } from "../../../../common/decorators/roles.decorator";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { GetConsultationsByPeriodUseCase } from "../../application/use-cases/get-consultations-by-period.use-case";
import { GetDoctorStatisticsUseCase } from "../../application/use-cases/get-doctor-statistics.use-case";
import { GetUpcomingControlsUseCase } from "../../application/use-cases/get-upcoming-controls.use-case";
import { GetClinicalSummaryUseCase } from "../../application/use-cases/get-clinical-summary.use-case";
import { ReportFiltersDto } from "./dto/report-filters.dto";

@Controller("report")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportController {
  constructor(
    private readonly getConsultationsByPeriod: GetConsultationsByPeriodUseCase,
    private readonly getDoctorStatistics: GetDoctorStatisticsUseCase,
    private readonly getUpcomingControls: GetUpcomingControlsUseCase,
    private readonly getClinicalSummary: GetClinicalSummaryUseCase,
  ) {}

  @Post("consultations-by-period")
  @Roles("ADMIN", "OWNER", "EMPLOYEE", "MANAGER")
  async consultationsByPeriod(
    @Body() filters: ReportFiltersDto,
    @CurrentUser("tenantId") tenantId: string,
    @CurrentUser("sucursalId") sucursalId: string,
    @Res() res: Response,
  ) {
    const pdf = await this.getConsultationsByPeriod.execute({
      ...filters,
      tenantId,
      sucursalId,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="consultas-por-periodo.pdf"`,
    });
    res.send(pdf);
  }

  @Post("doctor-statistics")
  @Roles("ADMIN", "OWNER", "EMPLOYEE", "MANAGER")
  async doctorStatistics(
    @Body() filters: ReportFiltersDto,
    @CurrentUser("tenantId") tenantId: string,
    @CurrentUser("sucursalId") sucursalId: string,
    @Res() res: Response,
  ) {
    const pdf = await this.getDoctorStatistics.execute({
      ...filters,
      tenantId,
      sucursalId,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="estadisticas-por-medico.pdf"`,
    });
    res.send(pdf);
  }

  @Get("upcoming-controls")
  @Roles("ADMIN", "OWNER", "EMPLOYEE", "MANAGER")
  async upcomingControls(
    @CurrentUser("tenantId") tenantId: string,
    @CurrentUser("sucursalId") sucursalId: string,
    @Res() res: Response,
  ) {
    const pdf = await this.getUpcomingControls.execute(tenantId, sucursalId);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="controles-programados.pdf"`,
    });
    res.send(pdf);
  }

  @Get("clinical-summary/:consultationId")
  @Roles("ADMIN", "OWNER", "EMPLOYEE")
  async clinicalSummary(
    @Param("consultationId") consultationId: string,
    @CurrentUser("tenantId") tenantId: string,
    @CurrentUser("sucursalId") sucursalId: string,
    @Res() res: Response,
  ) {
    const pdf = await this.getClinicalSummary.execute(consultationId, tenantId, sucursalId);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resumen-consulta.pdf"`,
    });
    res.send(pdf);
  }

}
