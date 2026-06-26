import { Modal } from "@/shared/components/modal";
import { Details } from "../types/interfaces";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
interface AgendaDetailModalProps {
  open: boolean;
  mode: "create" | "edit";
  loading?: boolean;
  details?: Details

  onVisit: () => void
  onClose: () => void;
  onSubmit: ( values: any ) => Promise<void> | void;
}
export function AppointmentDetailModal({open, mode, loading, details, onVisit, onClose, onSubmit}: AgendaDetailModalProps){
  const [isEditing, setIsEditing] = useState(false)
  const hasVisit = !!details?.visit
  return(
    <Modal
      open={open}
      onClose={onClose}
      title="AGENDA"
      description={details?.status}
    >
      <form>
        <div className="space-y-4 grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1 text-muted-foreground">Paciente</label>
            <input 
              disabled={!isEditing} 
              readOnly 
              className="w-full border rounded-md p-2"
              value={details?.clientFullName} 
            />
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">Responsable</label>
            <input 
              disabled={!isEditing} 
              className="w-full border rounded-md p-2"
              value={details?.userName} 
            />
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">Fecha</label>
            <input 
              disabled={!isEditing} 
              className="w-full border rounded-md p-2"
              value={details?.scheduledAt} 
            />
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">Hora</label>
            <input 
              disabled={!isEditing} 
              className="w-full border rounded-md p-2"
              value={details?.hora} 
            />
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">Estado</label>
            <input 
              disabled={!isEditing} 
              className="w-full border rounded-md p-2"
              value={details?.status} 
            />
          </div>
            <div>
              <label className="block mb-1 text-muted-foreground">Consulta asociada</label>
              {!hasVisit ? (
                <Button
                  type="button"
                  onClick={() => {
                    console.log('[AppointmentDetailModal] "Crear Consulta" clic. details:', { id: details?.id, cliente: details?.clientFullName, hora: details?.hora, status: details?.status });
                    onVisit();
                  }}
                >
                  Crear Consulta
                </Button>
              ):( 
                <input 
                  disabled={!isEditing} 
                  className="w-full border rounded-md p-2"
                  //value={JSON.stringify(details.visit.status,null,2)} 
                  value={details.visit.status} 
                />
              )}
            </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={()=>setIsEditing(true)}
            className="px-4 py-2 border rounded-md"
          >
            Editar
          </button>
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