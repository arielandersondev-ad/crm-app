'use client';
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useVisits } from "../hooks/use-visits";
import { EmptyState } from "@/shared/components/empty-state";
import { VisitTables } from "../components/visit-table";
import { Visit } from "../types/visit";
import { VisitModal } from "../components/visit-modal";

export function VisitPage() {
  const { data: visit, isLoading, error } = useVisits();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingOpen, setEditingOpen] = useState<Visit | null>(null);
  const [deleteVisit, setDeleteVisit] = useState<string | null>(null);

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

      {!visit?.length ? (
        <EmptyState 
          title="No hay visitas" 
          description="Cree una nueva visita para comenzar" 
        />
      ) : (
        <VisitTables 
          visits={visit}
          onEdit={(visit) => setEditingOpen(visit)}
          onDelete={(visit) => setDeleteVisit(visit.id)}
        />
      )}

      <VisitModal 
        open={createOpen}
        mode='create'
        visit={editingOpen ?? undefined}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (data) => console.log('submit', data)} 
      />
      <VisitModal 
        open={!!editingOpen}
        mode='edit'
        visit={editingOpen ?? undefined}
        onClose={() => setEditingOpen(null)}
        onSubmit={async (data) => console.log('submit', data)} 
      />
    </PageContainer>
  )
}