import { Modal } from "@/shared/components/modal";
import { Details } from "../types/interfaces";
import { StatusBadge } from "@/shared/components/status-badge";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "COMPLETED", label: "Atendida" },
  { value: "CANCELLED", label: "Cancelada" },
  { value: "NO_SHOW", label: "No asistió" },
] as const;

interface AgendaDetailModalProps {
  open: boolean;
  mode: "create" | "edit";
  loading?: boolean;
  details?: Details
  onStartConsultation: () => void
  onClose: () => void;
  onSubmit: ( values: any ) => Promise<void> | void;
  onUpdateStatus?: (id: string, status: string) => Promise<void>;
}
export function AppointmentDetailModal({open, mode, loading, details, onStartConsultation, onClose, onSubmit, onUpdateStatus}: AgendaDetailModalProps){
  const [isEditing, setIsEditing] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(details?.status ?? "PENDING")
  const hasConsultation = !!details?.consultation

  return(
    <Modal
      open={open}
      onClose={onClose}
      title="Cita / Control"
      description={details?.scheduledAt}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (isEditing && details && onUpdateStatus && selectedStatus !== details.status) {
            await onUpdateStatus(details.id, selectedStatus);
          }
          onSubmit({ status: selectedStatus });
        }}
      >
        {details?.appointmentCode && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 text-center">
            <label className="block text-xs text-muted-foreground mb-1">Código de cita</label>
            <span className="text-lg font-bold tracking-wider text-primary">
              {details.appointmentCode}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Comparta este código al paciente para que consulte el estado de su cita
            </p>
          </div>
        )}
        <div className="space-y-4 grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1 text-muted-foreground">Paciente</label>
            <input 
              disabled 
              readOnly 
              className="w-full border rounded-md p-2"
              value={details?.clientFullName} 
            />
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">Responsable</label>
            <input 
              disabled 
              className="w-full border rounded-md p-2"
              value={details?.userName} 
            />
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">Fecha</label>
            <input 
              disabled 
              className="w-full border rounded-md p-2"
              value={details?.scheduledAt} 
            />
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">Hora</label>
            <input 
              disabled 
              className="w-full border rounded-md p-2"
              value={details?.hora} 
            />
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">Estado</label>
            <div className="mt-1">
              {isEditing ? (
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <StatusBadge status={details?.status ?? ""} />
              )}
            </div>
          </div>
            <div>
              <label className="block mb-1 text-muted-foreground">Consulta asociada</label>
              {!hasConsultation ? (
                <Button
                  type="button"
                  onClick={() => {
                    console.log('[AppointmentDetailModal] "Iniciar Consulta" clic. details:', { id: details?.id, cliente: details?.clientFullName, hora: details?.hora, status: details?.status });
                    onStartConsultation();
                  }}
                >
                  Iniciar Consulta
                </Button>
              ) : (
                <input
                  disabled
                  className="w-full border rounded-md p-2"
                  value={details.consultation.status}
                />
              )}
            </div>
        </div>

        <div className="flex justify-end gap-2">
          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setSelectedStatus(details?.status ?? "PENDING");
                setIsEditing(true);
              }}
              className="px-4 py-2 border rounded-md"
            >
              Editar
            </button>
          )}
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setSelectedStatus(details?.status ?? "PENDING");
              }}
              className="px-4 py-2 border rounded-md"
            >
              Cancelar
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cerrar
          </button>
          {isEditing && (
            <button 
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer"
            >
              {loading ? "Guardando..." : "Actualizar"}
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}