import z from "zod";

export const AGENDA_SCHEMA= z.object({
  clientId: z.string(),
  userId: z.string().optional(),
  scheduledAt: z.string(),
  status: z.string().optional(),
})

export type AgendaFormData = z.infer<typeof AGENDA_SCHEMA>