import z from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email es obligatorio"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  firstName: z.string().min(1, "Nombre es obligatorio"),
  lastName: z.string().min(1, "Apellido es obligatorio"),
  role: z.string().min(1, "Rol es obligatorio"),
  sucursalId: z.string().min(1, "Sucursal es requerida"),
});
export const EditUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().min(1),
  sucursalId: z.string().min(1),
});
export type CreateUserFormData = z.infer<typeof CreateUserSchema>;
export type EditUserFormData = z.infer<typeof EditUserSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Contraseña actual es requerida"),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirmar contraseña es requerido"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
