"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  type LoginFormData,
} from "../schemas/login.schema";

import { useLogin } from "../api/use-login";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function LoginForm() {
  const loginMutation = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          Correo electrónico
        </label>

        <Input
          id="email"
          type="email"
          placeholder="correo@empresa.com"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium"
        >
          Contraseña
        </label>

        <Input
          id="password"
          type="password"
          placeholder="********"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {loginMutation.isError && (
        <p className="text-sm text-red-500">
          Credenciales incorrectas
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending
          ? "Iniciando sesión..."
          : "Iniciar sesión"}
      </Button>
    </form>
  );
}