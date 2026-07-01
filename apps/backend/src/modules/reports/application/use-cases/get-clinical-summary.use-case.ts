import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { PdfService } from "../../infrastructure/pdf/pdf.service";
import { buildClinicalSummaryDoc } from "../../infrastructure/pdf/templates/clinical-summary.template";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";

@Injectable()
export class GetClinicalSummaryUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService,
    private readonly sucursalRepo: SucursalRepository,
  ) {}

  async execute(consultationId: string, tenantId: string, sucursalId?: string): Promise<Buffer> {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id: consultationId, tenantId },
      include: {
        client: { select: { fullName: true, documentNumber: true, birthDate: true } },
        user: { select: { firstName: true, lastName: true } },
        refraction: true,
      },
    });

    if (!consultation) {
      console.log("[ClinicalSummary] no encontrada consultationId:", consultationId, "tenantId:", tenantId);
      throw new NotFoundException("Consulta no encontrada");
    }
    console.log("[ClinicalSummary] encontrada:", consultation.id, "paciente:", consultation.client.fullName);

    const age = consultation.client.birthDate
      ? Math.floor(
          (new Date().getTime() - new Date(consultation.client.birthDate).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000),
        )
      : undefined;

    const sucursal = sucursalId
      ? await this.sucursalRepo.findById(sucursalId)
      : null;
    const timezone = sucursal?.timezone ?? "America/La_Paz";

    const docDef = buildClinicalSummaryDoc(
      {
        patientName: consultation.client.fullName,
        patientDocId: consultation.client.documentNumber ?? undefined,
        patientAge: age,
        consultationDate: consultation.consultationDate,
        doctorName: `${consultation.user.firstName} ${consultation.user.lastName}`,
        motivo: consultation.motivo,
        diagnostico: consultation.diagnostico ?? undefined,
        observaciones: consultation.observaciones ?? undefined,
        nextControlAt: consultation.nextControlAt ?? undefined,
        refraction: consultation.refraction as any,
      },
      timezone,
    );

    return this.pdfService.generatePdf(docDef);
  }
}
