import type { UpcomingControl } from "../../../domain/interfaces/report.interface";
import { buildReportDocument, reportTableLayout } from "./report-document";

export function buildUpcomingControlsDoc(
  data: UpcomingControl[],
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
    { text: "Controles Programados", style: "header" },
    { text: "\n" },
    {
      table: {
        headerRows: 1,
        dontBreakRows: true,
        widths: ["*", "*", "*", 72],
        body: [
          [
            { text: "Paciente", style: "tableHeader" },
            { text: "Médico", style: "tableHeader" },
            { text: "Motivo", style: "tableHeader" },
            { text: "Próximo Control", style: "tableHeader" },
          ],
          ...data.map((c) => [
            c.clientFullName,
            c.doctorName,
            c.motivo,
            formatDate(c.nextControlAt),
          ]),
        ],
      },
      layout: reportTableLayout(),
    },
    { text: "\n" },
    { text: `Total de controles programados: ${data.length}`, style: "bold" },
  ]);
}
