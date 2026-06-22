// apps/frontend/src/features/visits/views/visit-page.tsx
'use client';
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useUpdateVisit, useVisits } from "../hooks/use-visits";
import { EmptyState } from "@/shared/components/empty-state";
import { VisitTables } from "../components/visit-table";
import { Visit } from "../types/visit";
import { VisitModal } from "../components/visit-modal";
import { VisitDetailModal } from "../components/visit-detail-modal";
import { toast } from "sonner";

// Datos de ejemplo para probar
const MOCK_VISITS: Visit[] = [
  {
    id: 'vst-92841',
    tenantId: 'tnt-1',
    sucursalId: 'suc-1',
    clientId: 'cli-1',
    userId: 'usr-1',
    appointmentId: null,
    status: 'IN_PROGRESS',
    notes: 'Paciente viene por control de rutina',
    startedAt: new Date().toISOString(),
    completedAt: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    client: {
      id: 'cli-1',
      fullName: 'Mario Castañeda',
      email: 'mario@mail.com',
      phone: '12345678'
    },
    user: {
      id: 'usr-1',
      firstName: 'Juan',
      lastName: 'Pérez'
    },
    details: [
      {
        id: 'det-1',
        visitId: 'vst-92841',
        serviceId: 'svc-1',
        quantity: 1,
        serviceName: 'Consulta General',
        unitPrice: 150,
        totalPrice: 150,
        notes: '',
        createdAt: new Date()
      },
      {
        id: 'det-2',
        visitId: 'vst-92841',
        serviceId: 'svc-2',
        quantity: 1,
        serviceName: 'Limpieza Dental',
        unitPrice: 300,
        totalPrice: 300,
        notes: 'Con fluoruro',
        createdAt: new Date()
      }
    ]
  }
];

export function VisitPage() {
  const { data: visits, isLoading, error } = useVisits();
  const updateVisitMutation = useUpdateVisit();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingOpen, setEditingOpen] = useState<Visit | null>(null);
  const [deleteVisit, setDeleteVisit] = useState<string | null>(null);

  // Usamos datos de ejemplo mientras la API está lista
  const displayVisits = visits?.length ? visits : MOCK_VISITS;

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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando visitas...</p>
        </div>
      ) : !displayVisits?.length ? (
        <EmptyState 
          title="No hay visitas" 
          description="Cree una nueva visita para comenzar" 
        />
      ) : (
        <VisitTables 
          visits={displayVisits}
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