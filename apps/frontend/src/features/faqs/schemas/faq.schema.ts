import z from "zod";

export const FaqSchema = z.object({
  question: z.string().min(1, "La pregunta es obligatoria"),
  answer: z.string().min(1,("La respuesta es obligatoria")),
  category: z.string().optional(),
});

export type FaqFormData = z.infer<typeof FaqSchema>;
