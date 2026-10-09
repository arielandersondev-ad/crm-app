import type { ClinicalSummaryData } from "../../../domain/interfaces/report.interface";
import {
  buildReportDocument,
  emptyCheckbox,
  REPORT_COLORS,
  reportTableLayout,
} from "./report-document";

const CRISTALES = [
  "FOTOBROWN",
  "FOTOGRAY",
  "BLANCO",
  "BIFOCAL GRAY",
  "BIFOCAL BROWN",
  "HIG-LITE ROSADO",
  "ANTIREFLEX",
];
const ORGANICOS = [
  "BLANCOS",
  "TRANSITION BROWN",
  "TRANSITION GRAY",
  "BIFOCAL",
  "PROGRESIVO",
  "ANTIREFLEX",
  "POLICARBONATO",
  "BLUE CUT",
  "BLUE RAY",
];

function materialChecklist(title: string, materials: string[]): any {
  return {
    width: "*",
    stack: [
      { text: title, style: "sectionHeader", margin: [0, 0, 0, 6] },
      {
        table: {
          widths: ["*", 15],
          body: materials.map((name) => [
            { text: name, margin: [0, 1, 0, 0] },
            emptyCheckbox(),
          ]),
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 2,
          paddingBottom: () => 2,
        },
      },
    ],
  };
}

export function buildClinicalSummaryDoc(
  data: ClinicalSummaryData,
  timezone: string,
): any {
  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-BO", {
      timeZone: timezone,
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const formatVal = (v?: number) =>
    v !== undefined && v !== null ? String(v) : "-";
  const r = data.refraction;

  const refractionHeader = (label: string) =>
    [label, "ESF", "CIL", "EJE", "AV", "DIP"].map((text) => ({
      text,
      style: "tableHeader",
    }));
  const eyeRow = (
    eye: string,
    values: (number | undefined)[],
    dip?: number,
    sharedDip = false,
  ) => [
    { text: eye, style: "cellLabel" },
    ...values.map((value) => ({ text: formatVal(value) })),
    sharedDip ? {} : { text: formatVal(dip), rowSpan: 2 },
  ];

  return buildReportDocument([
    { text: "Resumen de Consulta", style: "header" },
    {
      table: {
        widths: [66, "*"],
        body: [
          [{ text: "Paciente", style: "cellLabel" }, data.patientName],
          ...(data.patientDocId
            ? [[{ text: "CI", style: "cellLabel" }, data.patientDocId]]
            : []),
          ...(data.patientAge !== undefined && data.patientAge !== null
            ? [
                [
                  { text: "Edad", style: "cellLabel" },
                  `${data.patientAge} años`,
                ],
              ]
            : []),
          [
            { text: "Fecha", style: "cellLabel" },
            formatDate(data.consultationDate),
          ],
          [{ text: "Médico", style: "cellLabel" }, data.doctorName],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 4],
    },
    { text: "Diagnóstico", style: "sectionHeader" },
    { text: data.diagnostico || "Sin diagnóstico registrado" },
    { text: "Motivo de Consulta", style: "sectionHeader" },
    { text: data.motivo },
    ...(data.observaciones
      ? [
          { text: "Observaciones", style: "sectionHeader" },
          { text: data.observaciones },
        ]
      : []),
    ...(r
      ? [
          {
            unbreakable: true,
            stack: [
              {
                text: "REFRACCIÓN",
                style: "sectionHeader",
                alignment: "center",
              },
              {
                table: {
                  widths: [56, "*", "*", "*", "*", "*"],
                  body: [
                    refractionHeader("LEJOS"),
                    eyeRow(
                      "OD",
                      [r.odLejosEsf, r.odLejosCil, r.odLejosEje, r.odLejosAv],
                      r.lejosDip,
                    ),
                    eyeRow(
                      "OI",
                      [r.oiLejosEsf, r.oiLejosCil, r.oiLejosEje, r.oiLejosAv],
                      undefined,
                      true,
                    ),
                    refractionHeader("CERCA"),
                    eyeRow(
                      "OD",
                      [r.odCercaEsf, r.odCercaCil, r.odCercaEje, r.odCercaAv],
                      r.cercaDip,
                    ),
                    eyeRow(
                      "OI",
                      [r.oiCercaEsf, r.oiCercaCil, r.oiCercaEje, r.oiCercaAv],
                      undefined,
                      true,
                    ),
                    [
                      { text: "ADD", style: "cellLabel" },
                      { text: formatVal(r.add), colSpan: 5 },
                      {},
                      {},
                      {},
                      {},
                    ],
                  ],
                },
                alignment: "center",
                layout: {
                  ...reportTableLayout(),
                  fillColor: (rowIndex: number) =>
                    rowIndex === 0 || rowIndex === 3
                      ? REPORT_COLORS.header
                      : rowIndex === 2 || rowIndex === 5
                        ? REPORT_COLORS.alternate
                        : "#ffffff",
                },
              },
            ],
          },
        ]
      : []),
    ...(data.nextControlAt
      ? [
          {
            text: `Próximo control: ${formatDate(data.nextControlAt)}`,
            style: "bold",
            margin: [0, 8, 0, 0],
          },
        ]
      : []),
    {
      unbreakable: true,
      margin: [0, 14, 0, 0],
      stack: [
        {
          columns: [
            { text: "NUEVO CONTROL", style: "cellLabel", width: "*" },
            { text: "6 MESES", width: 60 },
            emptyCheckbox(),
            { text: "1 AÑO", width: 50, margin: [14, 0, 0, 0] },
            emptyCheckbox(),
          ],
          columnGap: 8,
          margin: [0, 0, 0, 14],
        },
        {
          columns: [
            materialChecklist("CRISTALES", CRISTALES),
            materialChecklist("ORGÁNICOS", ORGANICOS),
          ],
          columnGap: 36,
        },
      ],
    },
  ]);
}
