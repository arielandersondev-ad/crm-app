import { zodResolver } from "@hookform/resolvers/zod";
import { VISIT_SCHEMA, VisitFormData } from "../schemas/visit.schema";
import { Visit } from "../types/visit";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Modal } from "@/shared/components/modal";
import { VisitForm } from "./visit-form";

interface VisitModalProps {
  open: boolean;
  mode: "create" | "edit";
  visit?: Visit;
  loading?: boolean;

  onClose: () => void;
  onSubmit: ( values: VisitFormData ) => Promise<void> | void;
}
export function VisitModal({ open, mode, visit, loading, onClose, onSubmit }: VisitModalProps) {
  const resolver = zodResolver(VISIT_SCHEMA);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VisitFormData>( { resolver } );

  useEffect(() => {
    if (mode === "edit" && visit) {
      reset({
        sucursalId: visit.sucursalId,
        clientId: visit.clientId,
        serviceId: visit.serviceId,
        userId: visit.userId,
        apointmentId: visit.apointmentId,
        status: visit.status,
      });
      return;
    }

    reset({
      sucursalId: "",
      clientId: "",
      serviceId: "",
      userId: "",
      apointmentId: "",
      status: "",
    });
  }, [mode, visit, reset]);
  
  return(
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Crear visita" : "Editar visita"}
      description={mode === "create" ? "Ingrese los detalles de la visita" : "Actualice los detalles de la visita"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        
       <VisitForm
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
  )
}