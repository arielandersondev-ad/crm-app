import z from "zod";

export const ServiceSchema = z.object({
  name: z.string().min(1, "Nombre es obligatorio"),
  description: z.string().optional(),
  basePrice: z.number().min(0, "Precio es obligatorio"),
  isActive: z.boolean().optional(),
});

export type ServiceFormData = z.infer<typeof ServiceSchema>;