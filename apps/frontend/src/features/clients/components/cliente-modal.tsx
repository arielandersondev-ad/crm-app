import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ClientForm } from "./cliente-form";
import type { Client } from "../types/client";
import type { PatientProfile } from "../types/patient-profile";
import { Modal } from "@/shared/components/modal";
import  { zodResolver } from "@hookform/resolvers/zod";
import { ClientSchema, ClientFormData } from "../schemas/client.schema";
import { formatBirthDateForInput } from "../utils/client-form";

interface ClientModalProps {
  open: boolean;
  mode: "create" | "edit";
  client?: Client;
  patientProfile?: PatientProfile | null;
  loading?: boolean;
  disabled?: boolean;
  notice?: string;

  onClose: () => void;
  onSubmit: ( values: ClientFormData ) => Promise<void> | void;
}

export function ClientModal({ open, mode, client, patientProfile, loading, disabled, notice, onClose, onSubmit }: ClientModalProps) {
  const resolver = zodResolver(ClientSchema);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientFormData>( { resolver } );


  useEffect(() => {
    if (mode === "edit" && client) {
      reset({
        fullName: client.fullName,
        email: client.email,
        phone: client.phone ?? "",
        documentNumber: client.documentNumber ?? "",
        birthDate: formatBirthDateForInput(client.birthDate),
        address: client.address ?? "",
        notes: client.notes ?? "",
        antecedentes: patientProfile?.antecedentes ?? "",
        alergias: patientProfile?.alergias ?? "",
        contactoEmergencia: patientProfile?.contactoEmergencia ?? "",
        observaciones: patientProfile?.observaciones ?? "",
      });
      return;
    }

    reset({
      fullName: "",
      email: "",
      phone: "",
      documentNumber: "",
      birthDate: "",
      address: "",
      notes: "",
      antecedentes: "",
      alergias: "",
      contactoEmergencia: "",
      observaciones: "",
    });
  }, [open, mode, client, patientProfile, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={ mode === "create" ? "Nuevo Paciente" : "Editar Paciente" }
      description={ mode === "create" ? "Registrar nuevo paciente" : "Editar datos del paciente"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
        <fieldset disabled={disabled || loading}>
          <ClientForm register={register} errors={errors} />
        </fieldset>

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
            disabled={loading || disabled}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
          >
            {loading  ? "Guardando..."  : mode === "create" ? "Crear" : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
