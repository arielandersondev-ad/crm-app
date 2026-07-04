import { Injectable } from "@nestjs/common";
import { ReportRepository, ConsultationFilters } from "../../domain/repositories/report.repository";
import { PdfService } from "../../infrastructure/pdf/pdf.service";
import { buildDoctorStatisticsDoc } from "../../infrastructure/pdf/templates/doctor-statistics.template";

@Injectable()
export class GetDoctorStatisticsUseCase {
  constructor(
    private readonly reportRepo: ReportRepository,
    private readonly pdfService: PdfService,
  ) {}

  async execute(filters: ConsultationFilters): Promise<Buffer> {
    const data = await this.reportRepo.getDoctorStatistics(filters);
    console.log("[DoctorStatistics] doctores:", data.length, "filtros:", JSON.stringify(filters));
    if (data.length > 0) console.log("[DoctorStatistics] muestra:", JSON.stringify(data[0]));

    const docDef = buildDoctorStatisticsDoc(data, {
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    return this.pdfService.generatePdf(docDef);
  }
}
