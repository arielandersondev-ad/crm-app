import z from "zod";

export const VISIT_SCHEMA = z.object({
  sucursalId: z.string().optional(),
  clientId: z.string().optional(),
  serviceId: z.string().optional(),
  userId: z.string().optional(),
  apointmentId: z.string().optional(),
  status: z.string().optional(),
})

export type VisitFormData = z.infer<typeof VISIT_SCHEMA>;
