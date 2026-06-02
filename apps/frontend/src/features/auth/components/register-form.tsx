"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/register.schema";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useRegister } from "../api/use-register";

export function RegisterForm() {
  const registerMutation = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...rest } = data;
    registerMutation.mutate(rest);
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
          htmlFor="nombres"
          className="text-sm font-medium"
        >
          First Name
        </label>

        <Input
          id="nombres"
          type="text"
          placeholder="Nombre"
          {...register("nombres")}
        />

        {errors.nombres && (
          <p className="text-sm text-red-500">
            {errors.nombres.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="apellidos"
          className="text-sm font-medium"
        >
          Last Name
        </label>

        <Input
          id="apellidos"
          type="text"
          placeholder="Apellido(s)"
          {...register("apellidos")}
        />

        {errors.apellidos && (
          <p className="text-sm text-red-500">
            {errors.apellidos.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          Email
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
          Password
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
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium"
        >
          Password
        </label>

        <Input
          id="confirmPassword"
          type="password"
          placeholder="********"
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {registerMutation.isError && (
        <p className="text-sm text-red-500">
          Invalid registration credentials
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending
          ? "Registering..."
          : "Register"}
      </Button>
    </form>
  );
}