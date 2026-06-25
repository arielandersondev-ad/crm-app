// apps/frontend/src/features/visits/views/visit-page.tsx
'use client';
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useUpdateVisit, useVisits } from "../hooks/use-visits";
import { EmptyState } from "@/shared/components/empty-state";
import { LoadingState } from "@/shared/components/loading-state";
import { VisitTables } from "../components/visit-table";
import { Visit } from "../types/visit";
import { VisitModal } from "../components/visit-modal";
import { VisitDetailModal } from "../components/visit-detail-modal";
import { toast } from "sonner";

export function VisitPage() {
  const { data: visits, isLoading, error } = useVisits();
  const updateVisitMutation = useUpdateVisit();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingOpen, setEditingOpen] = useState<Visit | null>(null);
  const [deleteVisit, setDeleteVisit] = useState<string | null>(null);

  if (isLoading) return <LoadingState />
  if (error) return <EmptyState title="Error al cargar visitas" description="Intente nuevamente más tarde." />

  return (
    <PageContainer>
      <PageHeader
        title="Visitas"
        description="Administre las visitas de sus clientes"
        actions={
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setCreateOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4"/>
              Nueva visita
            </Button>
          </div>
        }
      />

      {!visits?.length ? (
        <EmptyState 
          title="No hay visitas" 
          description="Cree una nueva visita para comenzar" 
        />
      ) : (
        <VisitTables 
          visits={visits}
          onEdit={(visit) => setEditingOpen(visit)}
          onDelete={(visit) => setDeleteVisit(visit.id)}
        />
      )}

      {/* Modal para crear visitas */}
      <VisitModal 
        open={createOpen}
        mode='create'
        visit={undefined}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (data) => console.log('submit de VisitModal en Visit Page', data)} 
      />

      {/* Modal de detalle para editar */}
      {editingOpen && (
        <VisitDetailModal 
          open={!!editingOpen}
          visit={editingOpen}
          onClose={() => setEditingOpen(null)}
          onSubmit={async (data) => {
            await updateVisitMutation.mutateAsync({
              ...data,
              id: editingOpen.id,
            });
            toast.success('Visita actualizada correctamente');
            setEditingOpen(null);
          }}
          loading={updateVisitMutation.isPending}
        />
      )}
    </PageContainer>
  )
}