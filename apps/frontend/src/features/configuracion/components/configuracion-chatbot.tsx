"use client";

import { useForm } from "react-hook-form";
import { useGeneralConfiguration, useUpdateGeneralConfiguration } from "../hooks/use-configuracion";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

export function ConfiguracionChatbot() {
  const { data: config, isLoading } = useGeneralConfiguration();
  const updateMutation = useUpdateGeneralConfiguration();
  const { register, handleSubmit, formState: { isDirty } } = useForm({
    values: config ? {
      botName: config.botName,
      welcomeMessage: config.welcomeMessage,
      fallbackMessage: config.fallbackMessage,
      disclaimer: config.disclaimer,
    } : undefined,
  });

  if (isLoading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await updateMutation.mutateAsync(data);
        toast.success("Configuración del chatbot actualizada");
      })}
      className="space-y-4 max-w-xl"
    >
      <div>
        <label className="block mb-1 text-sm font-medium">Nombre del asistente</label>
        <input {...register("botName")} className="w-full border rounded-md p-2" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Mensaje de bienvenida</label>
        <textarea {...register("welcomeMessage")} rows={3} className="w-full border rounded-md p-2" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Mensaje de fallback (cuando no encuentra respuesta)</label>
        <textarea {...register("fallbackMessage")} rows={3} className="w-full border rounded-md p-2" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Disclaimer</label>
        <textarea {...register("disclaimer")} rows={3} className="w-full border rounded-md p-2" />
      </div>

      <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
        {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
