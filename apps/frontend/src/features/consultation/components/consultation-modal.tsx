import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/components/modal";
import { ConsultationForm } from "./consultation-form";
import { ConsultationSchema, ConsultationFormData } from "../schemas/consultation.schema";
import type { Consultation } from "../types/consultation";

interface ConsultationModalProps {
  open: boolean;
  mode: "create" | "edit" | "view";
  consultation?: Consultation | null;
  clientId?: string;
  clientName?: string;
  loading?: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onFinalize?: () => void;
  onPrintSummary?: () => void;
  onSubmit: (values: ConsultationFormData) => Promise<void> | void;
  canEdit?: boolean;
}

export function ConsultationModal({
  open,
  mode,
  consultation,
  clientId,
  clientName,
  loading,
  onClose,
  onEdit = () => {},
  onFinalize,
  onPrintSummary,
  onSubmit,
  canEdit = true,
}: ConsultationModalProps) {
  const resolver = zodResolver(ConsultationSchema);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ConsultationFormData>({ resolver });
  const readOnly = mode === "view";

  useEffect(() => {
    //console.log("[Modal useEffect] mode:", mode, "consultation?.id:", consultation?.id, "refraction:", consultation?.refraction);
    if ((mode === "edit" || mode === "view") && consultation) {
      reset({
        clientId: consultation.clientId,
        motivo: consultation.motivo,
        diagnostico: consultation.diagnostico ?? "",
        observaciones: consultation.observaciones ?? "",
        nextControlAt: consultation.nextControlAt
          ? new Date(consultation.nextControlAt).toISOString().slice(0, 16)
          : "",
        consultationDate: consultation.consultationDate
          ? new Date(consultation.consultationDate).toISOString().slice(0, 16)
          : "",
        ...consultation.refraction,
      });
      return;
    }

    reset({
      clientId: clientId ?? "",
      motivo: "",
      diagnostico: "",
      observaciones: "",
      nextControlAt: "",
      consultationDate: "",
    });
  }, [mode, consultation, clientId, reset]);

  const titles = {
    create: "Nueva consulta",
    edit: "Editar consulta",
    view: "Detalle de consulta",
  };

  const descriptions = {
    create: "Registrar una nueva atención",
    edit: "Actualizar los datos de la consulta",
    view: "Contenido completo de la consulta",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titles[mode]}
      description={descriptions[mode]}
    >
      <form
        onSubmit={handleSubmit((data) => {
          if (mode === "view") return;
          onSubmit(data);
        })}
        className="space-y-6"
      >
        <input type="hidden" {...register("clientId")} />
        <ConsultationForm register={register} errors={errors} readOnly={readOnly} clientName={clientName} />

        {mode !== "view" && (
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
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
            >
              {loading ? "Guardando..." : mode === "create" ? "Crear consulta" : "Guardar cambios"}
            </button>
          </div>
        )}

        {mode === "view" && (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cerrar
            </button>
            {consultation?.status === "COMPLETED" && (
              <button
                type="button"
                onClick={onPrintSummary}
                className="px-4 py-2 rounded-md bg-blue-600 text-white"
              >
                Imprimir Resumen
              </button>
            )}
            {canEdit && consultation?.status === "DRAFT" && (
              <button
                type="button"
                onClick={onFinalize}
                className="px-4 py-2 rounded-md bg-green-600 text-white"
              >
                Finalizar consulta
              </button>
            )}
            {canEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
              >
                Editar
              </button>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
}
