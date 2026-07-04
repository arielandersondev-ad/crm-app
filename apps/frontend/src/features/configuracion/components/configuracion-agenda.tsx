"use client";

import { useState } from "react";
import { useSucursales } from "../hooks/use-configuracion";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { api } from "@/infrastructure/api/axios";

export function ConfiguracionAgenda() {
  const { data: sucursales, isLoading } = useSucursales();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  if (isLoading) return <p className="text-muted-foreground">Cargando...</p>;

  const selected = sucursales?.find((s) => s.id === selectedId) ?? sucursales?.[0];

  if (!selected) return <p className="text-muted-foreground">No hay sucursales configuradas.</p>;

  const currentValues = values[selected.id] !== undefined ? values : {};

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex gap-2">
        {sucursales?.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSelectedId(s.id); setValues({}); }}
            className={`px-3 py-1 rounded text-sm border ${selected.id === s.id ? "bg-primary text-primary-foreground" : ""}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Duración promedio de consulta (minutos)</label>
          <input
            type="number"
            defaultValue={selected.avgConsultationMinutes}
            onChange={(e) => setValues((prev) => ({ ...prev, avgConsultationMinutes: parseInt(e.target.value) }))}
            className="w-full border rounded-md p-2"
            min={5}
            max={120}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Intervalo entre citas (minutos)</label>
          <input
            type="number"
            defaultValue={selected.intervalBetweenAppointments}
            onChange={(e) => setValues((prev) => ({ ...prev, intervalBetweenAppointments: parseInt(e.target.value) }))}
            className="w-full border rounded-md p-2"
            min={0}
            max={60}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Minutos para marcar NO_SHOW automáticamente</label>
          <input
            type="number"
            defaultValue={selected.autoNoShowMinutes}
            onChange={(e) => setValues((prev) => ({ ...prev, autoNoShowMinutes: parseInt(e.target.value) }))}
            className="w-full border rounded-md p-2"
            min={0}
            max={180}
          />
        </div>

        <Button
          onClick={async () => {
            setSaving(true);
            try {
              await api.patch(`/sucursal/${selected.id}`, {
                name: selected.name,
                direccion: selected.direccion,
                latitude: selected.latitude,
                longitude: selected.longitude,
                telefono: selected.telefono,
                correo: selected.correo,
                ...values,
              });
              toast.success("Configuración de agenda actualizada");
              setValues({});
            } catch {
              toast.error("Error al guardar");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving || Object.keys(values).length === 0}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
