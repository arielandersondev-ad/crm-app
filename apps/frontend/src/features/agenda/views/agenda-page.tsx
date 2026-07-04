'use client'
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { AgendaModal } from "../components/agenda-modal";
import { useState } from "react";
import { useCreateAgenda, useGetAgenda } from "../hooks/use-agenda";
import { useUpdateCita } from "../hooks/use-update-cita";
import { toast } from "sonner";
import { AgendaBoard } from "../components/agenda-board";
import { AppointmentDetailModal } from "../components/agenda-detalles-modal";
import { Details } from "../types/interfaces";
import { useAuthStore } from "@/stores/auth.store";
import { useStartConsultation } from "@/features/consultation/hooks/use-consultation";
import { EmptyState } from "@/shared/components/empty-state";
import { LoadingState } from "@/shared/components/loading-state";

export function AgendaPage() {
  // Estados de control
  const [createOpen, setCreateOpen] = useState(false)
  const [detailAgendaOpen, setDetailAgendaOpen] = useState(false)

  const [citaSelected, setCitaSelected] = useState<Details>()

  //hooks
  const createAgendaMutation = useCreateAgenda()
  const branch = useAuthStore((state) => state.branch)
  const {data: agenda, isLoading, isError} = useGetAgenda(branch?.id ?? '')
  const startConsultationMutation = useStartConsultation()
  const updateCitaMutation = useUpdateCita()
  //console.log('agenda de useGetAgenda: ',agenda)
  if (isLoading) return <LoadingState />
  if (isError) return <EmptyState title="Error al cargar la agenda" />

  return(
    <PageContainer>
      <PageHeader
        title="Agenda / Controles"
        description="Visualice y administre las citas y controles"
        actions={
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setCreateOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4"/>
              Nueva cita
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
          //console.log('[AgendaPage] onSelected recibió:', { id: cita.id, cliente: cita.clientFullName, hora: cita.hora, status: cita.status });
          setCitaSelected(cita)
          setDetailAgendaOpen(true)
          //console.log('[AgendaPage] seteados: citaSelected, clienteSelect, detailAgendaOpen=true');
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
        onStartConsultation={async () => {
          if (!citaSelected) return;
          try {
            const consultation = await startConsultationMutation.mutateAsync(citaSelected.id);
            toast.success("Consulta iniciada correctamente");
            setDetailAgendaOpen(false);
          } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error al iniciar la consulta");
          }
        }}
        onUpdateStatus={async (id: string, status: string) => {
          if (!citaSelected) return;
          await updateCitaMutation.mutateAsync({
            id,
            dto: {
              clientId: citaSelected.clientId,
              scheduledAt: citaSelected.scheduledAt,
              status: status as any,
            },
          });
        }}
        onClose={() => setDetailAgendaOpen(false)}
        onSubmit={() => {}}
      />
    </PageContainer>
  )
}