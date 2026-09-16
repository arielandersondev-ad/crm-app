"use client";

import { useForm } from "react-hook-form";
import { useTenant, useUpdateTenant } from "../hooks/use-configuracion";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

export function ConfiguracionEmpresa() {
  const { data: tenant, isLoading } = useTenant();
  const updateMutation = useUpdateTenant();
  const { register, handleSubmit, formState: { isDirty } } = useForm({
    values: tenant ? {
      name: tenant.name,
      slug: tenant.slug ?? "",
      phone: tenant.phone ?? "",
      email: tenant.email ?? "",
      whatsapp: tenant.whatsapp ?? "",
      timezone: tenant.timezone,
    } : undefined,
  });

  if (isLoading) return <p className="text-muted-foreground">Cargando...</p>;
  if (!tenant) return <p className="text-muted-foreground">Error al cargar datos de la empresa.</p>;

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await updateMutation.mutateAsync({ id: tenant.id, data });
        toast.success("Datos de la empresa actualizados");
      })}
      className="space-y-4 max-w-xl"
    >
      <div>
        <label className="block mb-1 text-sm font-medium">Nombre de la empresa</label>
        <input {...register("name")} className="w-full border rounded-md p-2" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium" htmlFor="tenant-slug">
          Identificador público del chatbot
        </label>
        <input
          id="tenant-slug"
          {...register("slug")}
          className="w-full border rounded-md p-2"
          placeholder="mi-clinica"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Debe coincidir con NEXT_PUBLIC_TENANT_SLUG en Vercel. Usa minúsculas, números y guiones.
        </p>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Teléfono principal</label>
        <input {...register("phone")} className="w-full border rounded-md p-2" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Correo principal</label>
        <input {...register("email")} type="email" className="w-full border rounded-md p-2" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">WhatsApp principal</label>
        <input {...register("whatsapp")} className="w-full border rounded-md p-2" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Zona horaria</label>
        <select {...register("timezone")} className="w-full border rounded-md p-2">
          <option value="America/La_Paz">America/La Paz (-4)</option>
          <option value="America/Santiago">America/Santiago (-3)</option>
          <option value="America/Lima">America/Lima (-5)</option>
          <option value="America/Mexico_City">America/Mexico City (-6)</option>
          <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos Aires (-3)</option>
          <option value="America/Bogota">America/Bogota (-5)</option>
          <option value="America/Caracas">America/Caracas (-4)</option>
        </select>
      </div>

      <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
        {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
