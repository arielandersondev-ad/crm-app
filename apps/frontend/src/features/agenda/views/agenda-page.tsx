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

export function AgendaPage() {
  // Estados
  const [createOpen, setCreateOpen] = useState(false)

  //hooks
  const createAgendaMutation = useCreateAgenda()
  const {data: agenda} = useGetAgenda('2')

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
      <AgendaBoard
        data={agenda}
      />
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
    </PageContainer>
  )
}