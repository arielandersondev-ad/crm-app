'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserFormData, CreateUserSchema, EditUserFormData, EditUserSchema } from "../schemas/user.schema";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Modal } from "@/shared/components/modal";
import { UserForm } from "./user-form";
import { useGetSucursales } from "../hooks/use-users";

interface UserModalProps {
  open: boolean;
  mode: "create" | "edit";
  user?: any
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void> | void;
  onOpenChangePassword?: () => void;
}

export function UserModal({ open, mode, user, loading, onClose, onSubmit, onOpenChangePassword }: UserModalProps) {
  const { data: sucursales, isLoading, error } = useGetSucursales();
  
  const isCreate = mode === "create";
  const resolver = zodResolver(isCreate ? CreateUserSchema : EditUserSchema);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserFormData | EditUserFormData>({ resolver });

  useEffect(() => {
    if (mode === "edit" && user) {
      const [firstName = "", lastName = ""] = user.fullName.split(" ");
      reset({
        id: user.id,
        email: user.email,
        firstName,
        lastName,
        role: user.role,
        sucursalId: "",
      } as EditUserFormData);
      return;
    }
    reset({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "",
      sucursalId: "",
    } as CreateUserFormData);
  }, [mode, user, reset]);
/* useEffect(() => {
  console.log(errors);
}, [errors]); */
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode ==='edit' ? 'Editar Usuario': "Agregar usuario"}
      description={mode ==='edit' ? 'Cambia los datos del Usuario a placer': "Ingrese los datos del nuevo usuario"}
    >
      <form
        onSubmit={handleSubmit(
    (data) => {
      console.log("FORM OK:", data);
      onSubmit(data);
    },
    (errors) => {
      console.log("FORM ERRORS:", errors);
    }
  )}
        className="space-y-6"
      >
        <UserForm 
          isEdit={mode==='edit'} 
          sucursales={sucursales ?? []} 
          register={register} 
          errors={errors} 
        />
        <div className="flex justify-end gap-2">
          {mode === "edit" && onOpenChangePassword && (
            <button
              type="button"
              onClick={onOpenChangePassword}
              className="px-4 py-2 border rounded-md text-sm"
            >
              Cambiar Contraseña
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer"
          >
            {loading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
