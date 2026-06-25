import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email("Email inválido").min(1, "Email es obligatorio"),
  password: z.string().min(8,'La contraseña debe tener al menos 8 caracteres').or(z.literal('')),
  firstName: z.string().min(1, "Nombre es obligatorio"),
  lastName: z.string().min(1, "Apellido es obligatorio"),
  role: z.string().min(1, "Rol es obligatorio"),
  sucursalId: z.string().min(1, "sucursal es requerido"),
});
export const EditUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().min(1),
  sucursalId: z.string().min(1),
});
export type UserFormData = z.infer<typeof UserSchema>;
