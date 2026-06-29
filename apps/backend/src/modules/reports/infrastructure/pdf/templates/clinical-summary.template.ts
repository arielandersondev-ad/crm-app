import type { ClinicalSummaryData } from "../../../domain/interfaces/report.interface";

export function buildClinicalSummaryDoc(data: ClinicalSummaryData, timezone: string): any {
  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-BO", { timeZone: timezone, year: "numeric", month: "long", day: "numeric" });

  const formatVal = (v?: number) => (v !== undefined && v !== null ? String(v) : "-");

  const refractionRows: any[] = [];

  if (data.refraction) {
    const r = data.refraction;

    refractionRows.push(
      [
        { text: "LEJOS", style: "cellLabel", colSpan: 6, alignment: "center" },
        {}, {}, {}, {}, {},
      ],
      [
        { text: "", style: "tableHeader" },
        { text: "ESF", style: "tableHeader" },
        { text: "CIL", style: "tableHeader" },
        { text: "EJE", style: "tableHeader" },
        { text: "AV", style: "tableHeader" },
        { text: "DIP", style: "tableHeader" },
      ],
      [
        { text: "OD", style: "cellLabel" },
        formatVal(r.odLejosEsf),
        formatVal(r.odLejosCil),
        formatVal(r.odLejosEje),
        formatVal(r.odLejosAv),
        { text: formatVal(r.lejosDip), rowSpan: 2 },
      ],
      [
        { text: "OI", style: "cellLabel" },
        formatVal(r.oiLejosEsf),
        formatVal(r.oiLejosCil),
        formatVal(r.oiLejosEje),
        formatVal(r.oiLejosAv),
        {},
      ],
      [
        { text: "CERCA", style: "cellLabel", colSpan: 6, alignment: "center" },
        {}, {}, {}, {}, {},
      ],
      [
        { text: "", style: "tableHeader" },
        { text: "ESF", style: "tableHeader" },
        { text: "CIL", style: "tableHeader" },
        { text: "EJE", style: "tableHeader" },
        { text: "AV", style: "tableHeader" },
        { text: "DIP", style: "tableHeader" },
      ],
      [
        { text: "OD", style: "cellLabel" },
        formatVal(r.odCercaEsf),
        formatVal(r.odCercaCil),
        formatVal(r.odCercaEje),
        formatVal(r.odCercaAv),
        { text: formatVal(r.cercaDip), rowSpan: 2 },
      ],
      [
        { text: "OI", style: "cellLabel" },
        formatVal(r.oiCercaEsf),
        formatVal(r.oiCercaCil),
        formatVal(r.oiCercaEje),
        formatVal(r.oiCercaAv),
        {},
      ],
    );

    if (r.add !== undefined && r.add !== null) {
      refractionRows.push([
        { text: "ADD", style: "cellLabel", colSpan: 6, alignment: "center" },
        {}, {}, {}, {}, {},
      ]);
      refractionRows.push([
        { text: "", style: "tableHeader" },
        { text: "", style: "tableHeader" },
        { text: "", style: "tableHeader" },
        { text: "", style: "tableHeader" },
        { text: "", style: "tableHeader" },
        { text: String(r.add), alignment: "center" },
      ]);
    }
  }

  return {
    content: [
      { text: "Resumen de Consulta", style: "header" },
      { text: "\n" },
      {
        table: {
          widths: ["auto", "*"],
          body: [
            [
              { text: "Paciente", style: "cellLabel" },
              data.patientName,
            ],
            ...(data.patientDocId
              ? [[{ text: "CI", style: "cellLabel" }, data.patientDocId]]
              : []),
            ...(data.patientAge
              ? [[{ text: "Edad", style: "cellLabel" }, `${data.patientAge} años`]]
              : []),
            [
              { text: "Fecha", style: "cellLabel" },
              formatDate(data.consultationDate),
            ],
            [
              { text: "Médico", style: "cellLabel" },
              data.doctorName,
            ],
          ],
        },
        layout: "noBorders",
      },
      { text: "\n" },
      { text: "Diagnóstico", style: "sectionHeader" },
      { text: data.diagnostico || "Sin diagnóstico registrado", margin: [0, 4, 0, 8] },
      { text: "Motivo de Consulta", style: "sectionHeader" },
      { text: data.motivo, margin: [0, 4, 0, 8] },
      ...(data.observaciones
        ? [
            { text: "Observaciones", style: "sectionHeader" },
            { text: data.observaciones, margin: [0, 4, 0, 8] },
          ]
        : []),
      ...(data.refraction
        ? [
            { text: "Refracción", style: "sectionHeader" },
            { text: "\n" },
            {
              table: {
                widths: ["auto", "auto", "auto", "auto", "auto", "auto"],
                body: refractionRows,
              },
            },
          ]
        : []),
      ...(data.nextControlAt
        ? [
            { text: "\n" },
            { text: `Próximo control: ${formatDate(data.nextControlAt)}`, style: "bold" },
          ]
        : []),
    ],
    styles: {
      header: { fontSize: 16, bold: true, margin: [0, 0, 0, 8] },
      sectionHeader: { fontSize: 11, bold: true, margin: [0, 8, 0, 2] },
      cellLabel: { bold: true, fontSize: 9 },
      tableHeader: { bold: true, fontSize: 8, fillColor: "#e2e8f0" },
      bold: { bold: true, fontSize: 10 },
    },
    defaultStyle: { fontSize: 9 },
    pageSize: "LETTER",
    pageMargins: [40, 40, 40, 40],
  };
}
