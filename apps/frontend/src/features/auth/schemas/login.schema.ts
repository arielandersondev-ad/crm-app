import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email('correo inválido'),
  password: z.string().min(6, 'password mínimo 6 caracteres'),
 // remember: z.boolean().optional(), 
});

export type LoginFormData = z.infer<typeof loginSchema>;