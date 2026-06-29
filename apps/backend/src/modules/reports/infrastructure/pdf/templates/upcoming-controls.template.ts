import type { UpcomingControl } from "../../../domain/interfaces/report.interface";

export function buildUpcomingControlsDoc(
  data: UpcomingControl[],
  timezone: string,
): any {
  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-BO", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" });

  return {
    content: [
      { text: "Controles Programados", style: "header" },
      { text: `Generado el ${formatDate(new Date())}`, style: "subheader" },
      { text: "\n" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "*", "auto"],
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
      },
      { text: "\n" },
      { text: `Total de controles programados: ${data.length}`, style: "bold" },
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
