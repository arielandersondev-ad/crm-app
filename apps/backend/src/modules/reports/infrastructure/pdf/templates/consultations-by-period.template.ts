import type { ConsultationReport } from "../../../domain/interfaces/report.interface";
import { buildReportDocument, reportTableLayout } from "./report-document";

export function buildConsultationsByPeriodDoc(
  data: ConsultationReport[],
  filters: { startDate: string; endDate: string; doctorName?: string },
  timezone: string,
): any {
  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-BO", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return buildReportDocument([
    { text: "Reporte de Consultas por Período", style: "header" },
    {
      text: `Del ${filters.startDate} al ${filters.endDate}`,
      style: "subheader",
    },
    ...(filters.doctorName
      ? [{ text: `Médico: ${filters.doctorName}`, style: "subheader" }]
      : []),
    { text: "\n" },
    {
      table: {
        headerRows: 1,
        dontBreakRows: true,
        widths: [60, "*", "*", 54],
        body: [
          [
            { text: "Fecha", style: "tableHeader" },
            { text: "Paciente", style: "tableHeader" },
            { text: "Motivo", style: "tableHeader" },
            { text: "Estado", style: "tableHeader" },
          ],
          ...data.map((c) => [
            formatDate(c.consultationDate),
            c.clientFullName,
            c.motivo,
            c.status === "COMPLETED"
              ? "Atendida"
              : c.status === "DRAFT"
                ? "Borrador"
                : "Cancelada",
          ]),
        ],
      },
      layout: reportTableLayout(),
    },
    { text: "\n" },
    { text: `Total de consultas: ${data.length}`, style: "bold" },
  ]);
}
