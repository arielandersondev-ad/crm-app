export const REPORT_COLORS = {
  accent: "#873847",
  header: "#ead6dc",
  alternate: "#f7edf0",
  border: "#626267",
  text: "#303036",
};

/** Shared print layout. The issue date always uses Bolivia's local date. */
export function buildReportDocument(content: any[]): any {
  const issueDate = new Date().toLocaleDateString("es-BO", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return {
    pageSize: "LETTER",
    pageOrientation: "portrait",
    pageMargins: [40, 96, 40, 48],
    header: {
      margin: [40, 28, 40, 0],
      stack: [
        {
          text: "Oftalmologica K & Y",
          fontSize: 19,
          bold: true,
          color: REPORT_COLORS.accent,
        },
        {
          columns: [
            { text: "La Paz - El Alto" },
            { text: `Fecha de emisión: ${issueDate}`, alignment: "right" },
          ],
          fontSize: 9,
          margin: [0, 5, 0, 10],
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 532,
              y2: 0,
              lineWidth: 2,
              lineColor: REPORT_COLORS.accent,
            },
          ],
        },
      ],
    },
    footer: (currentPage: number, pageCount: number) => ({
      margin: [40, 12, 40, 0],
      stack: [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 532,
              y2: 0,
              lineWidth: 1,
              lineColor: REPORT_COLORS.accent,
            },
          ],
        },
        {
          text: `Página ${currentPage} de ${pageCount}`,
          alignment: "right",
          fontSize: 8,
          margin: [0, 5, 0, 0],
        },
      ],
    }),
    content,
    styles: {
      header: {
        fontSize: 15,
        bold: true,
        color: REPORT_COLORS.accent,
        margin: [0, 0, 0, 10],
      },
      subheader: { fontSize: 10, margin: [0, 0, 0, 4] },
      sectionHeader: {
        fontSize: 10,
        bold: true,
        color: REPORT_COLORS.accent,
        margin: [0, 8, 0, 4],
      },
      cellLabel: { bold: true, fontSize: 9 },
      tableHeader: { bold: true, fontSize: 9, fillColor: REPORT_COLORS.header },
      bold: { bold: true, fontSize: 10 },
    },
    defaultStyle: { font: "Roboto", fontSize: 9, color: REPORT_COLORS.text },
  };
}

export function reportTableLayout(totalRow?: number): any {
  return {
    hLineWidth: () => 0.5,
    vLineWidth: () => 0.5,
    hLineColor: () => REPORT_COLORS.border,
    vLineColor: () => REPORT_COLORS.border,
    paddingLeft: () => 6,
    paddingRight: () => 6,
    paddingTop: () => 5,
    paddingBottom: () => 5,
    fillColor: (rowIndex: number) =>
      rowIndex === 0 || rowIndex === totalRow
        ? REPORT_COLORS.header
        : rowIndex % 2 === 0
          ? REPORT_COLORS.alternate
          : "#ffffff",
  };
}

/** A drawn square stays empty and is large enough to mark with a pen. */
export function emptyCheckbox(): any {
  return {
    canvas: [
      {
        type: "rect",
        x: 0,
        y: 0,
        w: 11,
        h: 11,
        lineWidth: 0.7,
        lineColor: REPORT_COLORS.border,
      },
    ],
    width: 11,
  };
}
