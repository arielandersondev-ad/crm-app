import { zodResolver } from "@hookform/resolvers/zod";
import { VISIT_SCHEMA, VisitFormData } from "../schemas/visit.schema";
import { Visit } from "../types/visit";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Modal } from "@/shared/components/modal";
import { VisitForm } from "./visit-form";
import { Client } from "@/features/clients/types/client";
import { toDateTimeLocal } from "@/constants/format";

interface VisitModalProps {
  client?: Client;
  open: boolean;
  mode: "create" | "edit";
  visit?: Visit;
  loading?: boolean;

  onClose: () => void;
  onSubmit: ( values: VisitFormData ) => Promise<void> | void;
}
export function VisitModal({ client, open, mode, visit, loading, onClose, onSubmit }: VisitModalProps) {
  const resolver = zodResolver(VISIT_SCHEMA);
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<VisitFormData>( { resolver } );

  useEffect(() => {
    if (mode === "edit" && visit) {
      reset({
        clientId: visit.clientId,
        userId: visit.userId,
        startedAt: visit.startedAt
          ? toDateTimeLocal(visit.startedAt)
          : "",
        completedAt: visit.completedAt
          ? toDateTimeLocal(visit.completedAt)
          : "",
        status: visit.status,
        notes: visit.notes,
      });
      return;
    }

    reset({
      clientId: client?.id || ''
    });
  }, [mode, visit, client, reset]);
  
  return(
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Crear visita" : "Editar visita"}
      description={mode === "create" ? "Ingrese los detalles de la visita" : "Actualice los detalles de la visita"}
    >
      <form
        onSubmit={handleSubmit(
          (data) => onSubmit(data),
          (errors) => console.error('Errores de formulario:', errors)
        )}
        className="space-y-6"
      >
        {/* Mensaje de error general */}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
            <p className="text-sm text-destructive font-medium">Por favor corrige los errores:</p>
            <ul className="text-xs text-destructive mt-1 ml-4 list-disc">
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>{String(value?.message || `Error en ${key}`)}</li>
              ))}
            </ul>
          </div>
        )}
        <VisitForm
          mode={mode}
          register={register}
          errors={errors}
          client={client}
          setValue={setValue}
          watch={watch}
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
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer"
          >
            {loading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
          </button>
        </div>
      </form>
    </Modal>
  )
}