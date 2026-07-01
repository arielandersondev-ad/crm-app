import type { ConsultationReport } from "../../../domain/interfaces/report.interface";

export function buildConsultationsByPeriodDoc(
  data: ConsultationReport[],
  filters: { startDate: string; endDate: string; doctorName?: string },
  timezone: string,
): any {
  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-BO", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" });

  return {
    content: [
      { text: "Reporte de Consultas por Período", style: "header" },
      { text: `Del ${filters.startDate} al ${filters.endDate}`, style: "subheader" },
      ...(filters.doctorName ? [{ text: `Médico: ${filters.doctorName}`, style: "subheader" }] : []),
      { text: "\n" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "*", "auto"],
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
              c.status === "COMPLETED" ? "Atendida" : c.status === "DRAFT" ? "Borrador" : "Cancelada",
            ]),
          ],
        },
      },
      { text: "\n" },
      { text: `Total de consultas: ${data.length}`, style: "bold" },
    ],
    styles: {
      header: { fontSize: 16, bold: true, margin: [0, 0, 0, 8] },
      subheader: { fontSize: 12, margin: [0, 0, 0, 4] },
      tableHeader: { bold: true, fontSize: 10, fillColor: "#e2e8f0" },
      bold: { bold: true, fontSize: 10 },
    },
    defaultStyle: { fontSize: 9 },
    pageSize: "LETTER",
    pageMargins: [40, 40, 40, 40],
  };
}
