import { z } from "zod";

export const ClientSchema = z.object({
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),

  email: z.email("Ingrese un email válido"),

  phone: z.string().min(8, "El teléfono debe tener al menos 8 caracteres"),

  documentNumber: z.string().optional(),

  birthDate: z.string().optional(),

  address: z.string().optional(),

  notes: z.string().optional(),
});

export type ClientFormData =
  z.infer<typeof ClientSchema>;