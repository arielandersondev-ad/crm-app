'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceFormData, ServiceSchema } from "../schemas/service.schema";
import { Service } from "../types/service";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Modal } from "@/shared/components/modal";
import { ServiceForm } from "./service-form";

interface ServiceModalProps {
  open: boolean;
  mode: "create" | "edit";
  service?: Service;
  loading?: boolean;

  onClose: () => void;
  onSubmit: ( values: ServiceFormData ) => Promise<void> | void;
}

export function ServiceModal({ open, mode, service, loading, onClose, onSubmit }: ServiceModalProps) {
  const resolver = zodResolver(ServiceSchema);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormData>( { resolver } );

  useEffect(() => {
    if (mode === "edit" && service) {
      reset({
        name: service.name,
        basePrice: service.basePrice ?? 0,
        description: service.description ?? "",
      });
      return;
    }

    reset({
      name: "",
      basePrice: 0,
      description: "",
    });
  }, [mode, service, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Crear servicio" : "Editar servicio"}
      description={mode === "create" ? "Ingrese los detalles del servicio" : "Actualice los detalles del servicio"}
    >
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <ServiceForm
          register={register}
          errors={errors}
        />
        <div className="flex justify-end gap-2">
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
            className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            {loading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
          </button>

        </div>
      </form>
    </Modal>
  );
}
