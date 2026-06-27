import { z } from "zod";

const toNumber = (v: unknown) => {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return isNaN(n) ? undefined : n;
};

const refractionNumber = z.preprocess(toNumber, z.number().optional());
const refractionEje = z.preprocess(toNumber, z.number().int().min(0).max(180).optional());
const refractionAv = z.string().optional();

export const ConsultationSchema = z.object({
  clientId: z.string().min(1, "El paciente es obligatorio"),
  motivo: z.string().min(3, "El motivo debe tener al menos 3 caracteres"),
  diagnostico: z.string().optional(),
  observaciones: z.string().optional(),
  nextControlAt: z.string().optional(),
  consultationDate: z.string().optional(),

  odLejosEsf: refractionNumber,
  odLejosCil: refractionNumber,
  odLejosEje: refractionEje,
  odLejosAv: refractionAv,
  oiLejosEsf: refractionNumber,
  oiLejosCil: refractionNumber,
  oiLejosEje: refractionEje,
  oiLejosAv: refractionAv,
  lejosDip: refractionNumber,
  odCercaEsf: refractionNumber,
  odCercaCil: refractionNumber,
  odCercaEje: refractionEje,
  odCercaAv: refractionAv,
  oiCercaEsf: refractionNumber,
  oiCercaCil: refractionNumber,
  oiCercaEje: refractionEje,
  oiCercaAv: refractionAv,
  cercaDip: refractionNumber,
  add: refractionNumber,
});

export type ConsultationFormData = z.infer<typeof ConsultationSchema>;
