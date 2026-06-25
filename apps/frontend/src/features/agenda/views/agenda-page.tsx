'use client'
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { AgendaModal } from "../components/agenda-modal";
import { useState } from "react";
import { useCreateAgenda, useGetAgenda } from "../hooks/use-agenda";
import { toast } from "sonner";
import { AgendaBoard } from "../components/agenda-board";
import { AppointmentDetailModal } from "../components/agenda-detalles-modal";
import { Details } from "../types/interfaces";
import { ClientContext, VisitModal } from "@/features/visits/components/visit-modal";
import { useCreateVisit } from "@/features/visits/hooks/use-visits";
import { useAuthStore } from "@/stores/auth.store";
import { EmptyState } from "@/shared/components/empty-state";
import { LoadingState } from "@/shared/components/loading-state";

export function AgendaPage() {
  // Estados de control
  const [createOpen, setCreateOpen] = useState(false)
  const [detailAgendaOpen, setDetailAgendaOpen] = useState(false)
  const [visitModalOpen, setVisitModalOpen] = useState(false)

  const [citaSelected, setCitaSelected] = useState<Details>()
  const [clienteSelect, setClienteSelect ]= useState<ClientContext>()

  //hooks
  const createAgendaMutation = useCreateAgenda()
  const branch = useAuthStore((state) => state.branch)
  const {data: agenda, isLoading, isError} = useGetAgenda(branch?.id ?? '')
  const createVisitMutation= useCreateVisit()
console.log('agenda de useGetAgenda: ',agenda)
  if (isLoading) return <LoadingState />
  if (isError) return <EmptyState title="Error al cargar la agenda" />

  return(
    <PageContainer>
      <PageHeader
        title="Agenda"
        description="Visualice y Administre su Agenda de citas"
        actions={
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setCreateOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4"/>
              Agendar
            </Button>
          </div>
        }
      />
      {/* Renderizado de la agenda */}
      {!agenda?.appointments?.length ? (
        <EmptyState
          title="No hay citas"
          description="No se encontraron citas para esta sucursal."
        />
      ) : (
      <AgendaBoard
        data={agenda}
        onSelected={(cita)=>{
          console.log('[AgendaPage] onSelected recibió:', { id: cita.id, cliente: cita.clientFullName, hora: cita.hora, status: cita.status });
          setCitaSelected(cita)
          setDetailAgendaOpen(true)
          setClienteSelect({
            id: cita.id,
            fullName: cita.clientFullName
          })
          console.log('[AgendaPage] seteados: citaSelected, clienteSelect, detailAgendaOpen=true');
        }}
      />
      )}
      {/* Modal para crear visitas */}
      <AgendaModal 
        open={createOpen}
        mode='create'
        onClose={() => setCreateOpen(false)}
        onSubmit={async (data) => {
          await createAgendaMutation.mutateAsync(data)
          toast.success('Cita Agendada Exitosamente')
        }}
        loading={createAgendaMutation.isPending}
      />
      <AppointmentDetailModal
        open={detailAgendaOpen}
        mode="create"
        details={citaSelected}
        onVisit={()=>{
          console.log('[AgendaPage] onVisit: clienteSelect actual:', clienteSelect);
          console.log('[AgendaPage] Cerrando detail → abriendo visit modal');
          setDetailAgendaOpen(false)
          setVisitModalOpen(true)
        }}
        onClose={() => setDetailAgendaOpen(false)}
        onSubmit={()=>console.log('datos seleccionados: ',clienteSelect)}
      />
      <VisitModal
        client={clienteSelect}
        open={visitModalOpen}
        mode="create"
        loading={createAgendaMutation.isPending}
        onClose={()=>setVisitModalOpen(false)}
        onSubmit={async (data) => {
          console.log('[AgendaPage] onSubmit recibió:', data);
          if (!citaSelected) {
            console.warn('[AgendaPage] citaSelected es undefined, abortando');
            return;
          }
          try {
            const result = await createVisitMutation.mutateAsync({
              appointmentId: citaSelected.id,
            });
            console.log('[AgendaPage] mutateAsync exitoso:', result);
            toast.success('Visita creada correctamente');
            setVisitModalOpen(false);
          } catch (error) {
            console.error('[AgendaPage] mutateAsync falló:', error);
          }
        }}
      />
    </PageContainer>
  )
}