"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaqFormData, FaqSchema } from "../schemas/faq.schema";
import { Faq } from "../types/faq";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Modal } from "@/shared/components/modal";
import { FaqForm } from "./faq-form";

interface FaqModalProps {
  open: boolean;
  mode: "create" | "edit";
  faq?: Faq;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: FaqFormData) => Promise<void> | void;
}

export function FaqModal({ open, mode, faq, loading, onClose, onSubmit }: FaqModalProps) {
  const resolver = zodResolver(FaqSchema);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FaqFormData>({ resolver });

  useEffect(() => {
    if (mode === "edit" && faq) {
      reset({
        question: faq.question,
        answer: faq.answer,
        category: faq.category ?? "",
      });
      return;
    }
    reset({ question: "", answer: "", category: "" });
  }, [mode, faq, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Crear FAQ" : "Editar FAQ"}
      description={mode === "create" ? "Ingrese la pregunta y respuesta frecuente" : "Actualice la pregunta o respuesta"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FaqForm register={register} errors={errors} />
        <div className="flex justify-end gap-2">
          <button type="button" disabled={loading} onClick={onClose} className="px-4 py-2 border rounded-md">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer">
            {loading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
