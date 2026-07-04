import { zodResolver } from "@hookform/resolvers/zod";
import { VISIT_SCHEMA, VisitFormData } from "../schemas/visit.schema";
import { Visit } from "../types/visit";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Modal } from "@/shared/components/modal";
import { VisitForm } from "./visit-form";
import { Client } from "@/features/clients/types/client";
import { toDateTimeLocal } from "@/constants/format";
export interface ClientContext{
  id: string
  fullName: string
}
interface VisitModalProps {
  client?: ClientContext;
  open: boolean;
  mode: "create" | "edit";
  visit?: Visit;
  loading?: boolean;

  onClose: () => void;
  onSubmit: ( values: Omit<VisitFormData,'startedAt'|'completedAt'> ) => Promise<void> | void;
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
    //console.log('[VisitModal] reset form en create mode con client:', { id: client?.id, nombre: client?.fullName });
  }, [mode, visit, client, reset]);
  
  return(
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Nueva consulta" : "Editar consulta"}
      description={mode === "create" ? "Ingrese los detalles de la consulta" : "Actualice los detalles de la consulta"}
    >
      <form
        onSubmit={handleSubmit(
          (data) => {
            console.log('[VisitModal] Form válido, datos a enviar:', data);
            console.log('[VisitModal] userId:', data.userId, data.userId === undefined ? '(undefined! → schema validation fail)' : '(ok)');
            onSubmit(data);
          },
          (errors) => console.error('[VisitModal] Errores de formulario:', errors)
        )}
        className="space-y-6"
      >
        {/* Mensaje de error general */}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
            <p className="text-sm text-destructive font-medium">Por favor corrige los errores en visit modal:</p>
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