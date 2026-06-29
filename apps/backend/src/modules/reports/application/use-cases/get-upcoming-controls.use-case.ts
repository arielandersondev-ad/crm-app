import { Injectable } from "@nestjs/common";
import { ReportRepository } from "../../domain/repositories/report.repository";
import { PdfService } from "../../infrastructure/pdf/pdf.service";
import { buildUpcomingControlsDoc } from "../../infrastructure/pdf/templates/upcoming-controls.template";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";

@Injectable()
export class GetUpcomingControlsUseCase {
  constructor(
    private readonly reportRepo: ReportRepository,
    private readonly pdfService: PdfService,
    private readonly sucursalRepo: SucursalRepository,
  ) {}

  async execute(tenantId: string, sucursalId?: string): Promise<Buffer> {
    const data = await this.reportRepo.getUpcomingControls(tenantId, sucursalId);
    console.log("[UpcomingControls] registros:", data.length, "tenantId:", tenantId, "sucursalId:", sucursalId);
    if (data.length > 0) console.log("[UpcomingControls] muestra:", JSON.stringify(data[0]));

    const sucursal = sucursalId
      ? await this.sucursalRepo.findById(sucursalId)
      : null;
    const timezone = sucursal?.timezone ?? "America/La_Paz";

    const docDef = buildUpcomingControlsDoc(data, timezone);
    return this.pdfService.generatePdf(docDef);
  }
}
