import { z } from "zod";

const toNumber = (v: unknown) => {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return isNaN(n) ? undefined : n;
};

const decimalField = z.preprocess(toNumber, z.number().optional());
const ejeField = z.preprocess(toNumber, z.number().int().min(0).max(180).optional());
const avField = z.string().optional();

export const RefractionSchema = z.object({
  odLejosEsf: decimalField,
  odLejosCil: decimalField,
  odLejosEje: ejeField,
  odLejosAv: avField,
  oiLejosEsf: decimalField,
  oiLejosCil: decimalField,
  oiLejosEje: ejeField,
  oiLejosAv: avField,
  lejosDip: decimalField,
  odCercaEsf: decimalField,
  odCercaCil: decimalField,
  odCercaEje: ejeField,
  odCercaAv: avField,
  oiCercaEsf: decimalField,
  oiCercaCil: decimalField,
  oiCercaEje: ejeField,
  oiCercaAv: avField,
  cercaDip: decimalField,
  add: decimalField,
});

export type RefractionFormData = z.infer<typeof RefractionSchema>;
