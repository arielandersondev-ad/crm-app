"use client";

import { useState, useEffect } from "react";
import { useSucursales, useSchedules, useUpdateSchedules } from "../hooks/use-configuracion";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { api } from "@/infrastructure/api/axios";

const DAYS = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

function ScheduleEditor({ sucursalId }: { sucursalId: string }) {
  const { data: schedules, isLoading } = useSchedules(sucursalId);
  const updateMutation = useUpdateSchedules();
  const [edited, setEdited] = useState<Record<string, { openTime: string; closeTime: string; isOpen: boolean }>>({});

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando horarios...</p>;

  const current = DAYS.map((day) => {
    const existing = schedules?.find((s) => s.dayOfWeek === day.value);
    const edit = edited[day.value];
    return {
      ...day,
      openTime: edit?.openTime ?? existing?.openTime ?? "08:00",
      closeTime: edit?.closeTime ?? existing?.closeTime ?? "18:00",
      isOpen: edit?.isOpen ?? existing?.isOpen ?? true,
    };
  });

  const handleSave = async () => {
    const schedulesData = current.map((d) => ({
      dayOfWeek: d.value,
      openTime: d.openTime || null,
      closeTime: d.closeTime || null,
      isOpen: d.isOpen,
    }));
    await updateMutation.mutateAsync({ sucursalId, schedules: schedulesData });
    setEdited({});
    toast.success("Horarios actualizados");
  };

  return (
    <div className="space-y-2 mt-4">
      <h4 className="font-medium text-sm">Horarios de atención</h4>
      {current.map((day) => (
        <div key={day.value} className="flex items-center gap-3">
          <label className="w-28 text-sm">{day.label}</label>
          <input
            type="checkbox"
            checked={day.isOpen}
            onChange={(e) => setEdited((prev) => ({ ...prev, [day.value]: { ...prev[day.value], isOpen: e.target.checked } }))}
            className="size-4"
          />
          {day.isOpen ? (
            <>
              <input
                type="time"
                value={day.openTime}
                onChange={(e) => setEdited((prev) => ({ ...prev, [day.value]: { ...prev[day.value], openTime: e.target.value } }))}
                className="border rounded px-2 py-1 text-sm w-28"
              />
              <span className="text-sm">a</span>
              <input
                type="time"
                value={day.closeTime}
                onChange={(e) => setEdited((prev) => ({ ...prev, [day.value]: { ...prev[day.value], closeTime: e.target.value } }))}
                className="border rounded px-2 py-1 text-sm w-28"
              />
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Cerrado</span>
          )}
        </div>
      ))}
      <Button
        size="sm"
        onClick={handleSave}
        disabled={updateMutation.isPending || Object.keys(edited).length === 0}
      >
        {updateMutation.isPending ? "Guardando..." : "Guardar horarios"}
      </Button>
    </div>
  );
}

export function ConfiguracionSucursales() {
  const { data: sucursales, isLoading } = useSucursales();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [branchForm, setBranchForm] = useState({
    name: "",
    telefono: "",
    direccion: "",
    correo: "",
    latitude: 0,
    longitude: 0,
  });
  const [savingBranch, setSavingBranch] = useState(false);
  const [dirty, setDirty] = useState(false);

  const selected = sucursales?.find((s) => s.id === selectedId) ?? sucursales?.[0];

  useEffect(() => {
    if (selected) {
      setBranchForm({
        name: selected.name,
        telefono: selected.telefono ?? "",
        direccion: selected.direccion ?? "",
        correo: selected.correo ?? "",
        latitude: selected.latitude,
        longitude: selected.longitude,
      });
      setDirty(false);
    }
  }, [selected]);

  if (isLoading) return <p className="text-muted-foreground">Cargando sucursales...</p>;

  const handleFieldChange = (field: string, value: any) => {
    setBranchForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleSaveBranch = async () => {
    if (!selected) return;
    setSavingBranch(true);
    try {
      await api.patch(`/sucursal/${selected.id}`, branchForm);
      toast.success("Sucursal actualizada correctamente");
      setDirty(false);
    } catch {
      toast.error("Error al guardar la sucursal");
    } finally {
      setSavingBranch(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex gap-2">
        {sucursales?.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className={`px-3 py-1 rounded text-sm border ${selected?.id === s.id ? "bg-primary text-primary-foreground" : ""}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Nombre</label>
              <input
                value={branchForm.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Teléfono</label>
              <input
                value={branchForm.telefono}
                onChange={(e) => handleFieldChange("telefono", e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Dirección</label>
              <input
                value={branchForm.direccion}
                onChange={(e) => handleFieldChange("direccion", e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Correo</label>
              <input
                value={branchForm.correo}
                onChange={(e) => handleFieldChange("correo", e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Latitud</label>
              <input
                type="number"
                step="any"
                value={branchForm.latitude}
                onChange={(e) => handleFieldChange("latitude", parseFloat(e.target.value))}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Longitud</label>
              <input
                type="number"
                step="any"
                value={branchForm.longitude}
                onChange={(e) => handleFieldChange("longitude", parseFloat(e.target.value))}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          <Button onClick={handleSaveBranch} disabled={!dirty || savingBranch}>
            {savingBranch ? "Guardando..." : "Guardar cambios de sucursal"}
          </Button>

          <ScheduleEditor sucursalId={selected.id} />
        </>
      )}
    </div>
  );
}
