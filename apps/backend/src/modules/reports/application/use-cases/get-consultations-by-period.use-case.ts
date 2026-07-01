import { Injectable } from "@nestjs/common";
import { ReportRepository, ConsultationFilters } from "../../domain/repositories/report.repository";
import { PdfService } from "../../infrastructure/pdf/pdf.service";
import { buildConsultationsByPeriodDoc } from "../../infrastructure/pdf/templates/consultations-by-period.template";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";

@Injectable()
export class GetConsultationsByPeriodUseCase {
  constructor(
    private readonly reportRepo: ReportRepository,
    private readonly pdfService: PdfService,
    private readonly sucursalRepo: SucursalRepository,
  ) {}

  async execute(filters: ConsultationFilters): Promise<Buffer> {
    const data = await this.reportRepo.getConsultationsByPeriod(filters);

    const sucursal = filters.sucursalId
      ? await this.sucursalRepo.findById(filters.sucursalId)
      : null;
    const timezone = sucursal?.timezone ?? "America/La_Paz";

    console.log("[ConsultationsByPeriod] registros:", data.length, "filtros:", JSON.stringify(filters));
    if (data.length > 0) console.log("[ConsultationsByPeriod] muestra:", JSON.stringify(data[0]));

    const docDef = buildConsultationsByPeriodDoc(data, {
      startDate: filters.startDate,
      endDate: filters.endDate,
      doctorName: filters.userId ? undefined : undefined,
    }, timezone);

    return this.pdfService.generatePdf(docDef);
  }
}
