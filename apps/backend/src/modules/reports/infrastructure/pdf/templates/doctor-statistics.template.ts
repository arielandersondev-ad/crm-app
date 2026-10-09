import type { DoctorStatistic } from "../../../domain/interfaces/report.interface";
import { buildReportDocument, reportTableLayout } from "./report-document";

export function buildDoctorStatisticsDoc(
  data: DoctorStatistic[],
  filters: { startDate: string; endDate: string },
): any {
  return buildReportDocument([
    { text: "Reporte Estadístico por Médico", style: "header" },
    {
      text: `Del ${filters.startDate} al ${filters.endDate}`,
      style: "subheader",
    },
    { text: "\n" },
    {
      table: {
        headerRows: 1,
        dontBreakRows: true,
        widths: ["*", "auto", "auto", "auto", "auto", "auto"],
        body: [
          [
            { text: "Médico", style: "tableHeader" },
            { text: "Consultas", style: "tableHeader" },
            { text: "Pacientes", style: "tableHeader" },
            { text: "Atendidas", style: "tableHeader" },
            { text: "Canceladas", style: "tableHeader" },
            { text: "Controles", style: "tableHeader" },
          ],
          ...data.map((s) => [
            s.doctorName,
            s.totalConsultations,
            s.uniquePatients,
            s.completedConsultations,
            s.cancelledConsultations,
            s.upcomingControls,
          ]),
          [
            { text: "Totales", style: "bold" },
            data.reduce((a, s) => a + s.totalConsultations, 0),
            data.reduce((a, s) => a + s.uniquePatients, 0),
            data.reduce((a, s) => a + s.completedConsultations, 0),
            data.reduce((a, s) => a + s.cancelledConsultations, 0),
            data.reduce((a, s) => a + s.upcomingControls, 0),
          ],
        ],
      },
      layout: reportTableLayout(data.length + 1),
    },
  ]);
}
