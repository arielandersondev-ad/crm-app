import { z } from "zod";

export const registerSchema = z
  .object({
    nombres: z.string().min(2, "El nombre es obligatorio"),
    apellidos: z.string().min(2, "El apellido es obligatorio"),
    email: z.email("El correo electrónico es inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "La contraseña de confirmación debe tener al menos 6 caracteres"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }
  );

export type RegisterFormData = z.infer<
  typeof registerSchema
>;