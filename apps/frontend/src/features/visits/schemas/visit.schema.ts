import z from "zod";


export const CREATE_VISIT_SCHEMA = z.object({
  clientId: z.string(),
});

// Schema para el formulario de la visita principal
export const VisitMainFormSchema = z.object({
  clientId: z.string(),
  status: z.string().optional(),
  notes: z.string().optional(),
  userId: z.string().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
});
export type VisitMainFormValues = z.infer<typeof VisitMainFormSchema>;
// Schema para editar detalle
export const EditDetailSchema = z.object({
  quantity: z.number().min(1),
  notes: z.string().optional(),
});
export type EditDetailValues = z.infer<typeof EditDetailSchema>;

export const EDIT_VISIT_SCHEMA = z.object({
  clientId: z.string(),
  userId: z.string(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  status: z.string(),
  notes: z.string().optional(),
});
export const VISIT_SCHEMA = z.object({
  clientId: z.string().optional(),
  userId: z.string().optional(),
  appointmentId: z.string().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
})
export type VisitFormData = z.infer<typeof VISIT_SCHEMA>;
