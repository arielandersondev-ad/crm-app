"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Modal } from "@/shared/components/modal";
import { ChangePasswordSchema, ChangePasswordFormData } from "../schemas/user.schema";
import { useChangePassword } from "../hooks/use-users";
import { toast } from "sonner";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast.success("Contraseña cambiada correctamente");
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al cambiar la contraseña");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cambiar Contraseña"
      description="Ingrese su contraseña actual y la nueva contraseña"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Contraseña Actual</label>
            <input
              {...register("currentPassword")}
              type="password"
              className="w-full border rounded-md p-2"
              placeholder="Ingrese su contraseña actual"
            />
            {errors?.currentPassword && (
              <p className="text-destructive text-sm">{errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Nueva Contraseña</label>
            <input
              {...register("newPassword")}
              type="password"
              className="w-full border rounded-md p-2"
              placeholder="Mínimo 8 caracteres"
            />
            {errors?.newPassword && (
              <p className="text-destructive text-sm">{errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Confirmar Nueva Contraseña</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full border rounded-md p-2"
              placeholder="Repita la nueva contraseña"
            />
            {errors?.confirmPassword && (
              <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={changePasswordMutation.isPending}
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer"
          >
            {changePasswordMutation.isPending ? "Cambiando..." : "Cambiar Contraseña"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
