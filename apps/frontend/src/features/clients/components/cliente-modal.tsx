import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ClientForm } from "./cliente-form";
import type { Client, CreateClientDto } from "../types/client";
import { Modal } from "@/shared/components/modal";
import  { zodResolver } from "@hookform/resolvers/zod";
import { ClientSchema, ClientFormData } from "../schemas/client.schema";

// Función para formatear fecha ISO a YYYY-MM-DD
const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface ClientModalProps {
  open: boolean;
  mode: "create" | "edit";
  client?: Client;
  loading?: boolean;

  onClose: () => void;
  onSubmit: ( values: ClientFormData ) => Promise<void> | void;
}

export function ClientModal({ open, mode, client, loading, onClose, onSubmit }: ClientModalProps) {
  const resolver = zodResolver(ClientSchema);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientFormData>( { resolver } );


  useEffect(() => {
    if (mode === "edit" && client) {
      reset({
        fullName: client.fullName,
        email: client.email,
        phone: client.phone ?? "",
        documentNumber: client.documentNumber ?? "",
        birthDate: formatDateForInput(client.birthDate),
        address: client.address ?? "",
        notes: client.notes ?? "",
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
    });
  }, [mode, client, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={ mode === "create" ? "Nuevo Cliente" : "Editar Cliente" }
      description={ mode === "create" ? "Crea un nuevo cliente" : "Edita los detalles del cliente"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <ClientForm
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
            className="px-4 py-2 rounded-md bg-primary text-white"
          >
            {loading  ? "Guardando..."  : mode === "create" ? "Crear" : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}