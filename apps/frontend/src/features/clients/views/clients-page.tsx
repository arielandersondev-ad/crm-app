"use client";

import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { EmptyState } from "@/shared/components/empty-state";

import { useClients, useCreateClient, useDeleteClient, useUpdateClient } from "../hooks/use-clients";
import { ClientsTable } from "../components/clients-table";
import { LoadingState } from "@/shared/components/loading-state";
import { Button } from "@/shared/components/ui/button";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import { ClientModal } from "../components/cliente-modal";
import { Client } from "../types/client";
import { DeleteClientDialog } from "../components/delete-cliente-dialog";
import { toast } from "sonner";
import { VisitModal } from "@/features/visits/components/visit-modal";
import { useCreateVisit, useVisits } from "@/features/visits/hooks/use-visits";
import { VisitFormData } from "@/features/visits/schemas/visit.schema";

export function ClientsPage() {
  const { data: clients, isLoading, isError } = useClients();
  const { data: visits, isLoading: visitsLoading, isError: visitsIsError } = useVisits();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();
  const createVisitMutation = useCreateVisit();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  if (isLoading) return <LoadingState />

  if (isError) {
    return (
      <EmptyState
        title="Error al cargar clientes"
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Pacientes"
        description="Gestión de pacientes"
        actions={
          <div className="flex gap-2 items-center justify-center align-center">

            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
              Exportar
            </Button>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4" />
              Nuevo paciente
            </Button>
          </div>
        }
      />

      {!clients?.length ? (
        <EmptyState
          title="No hay pacientes registrados"
          description="Registra tu primer paciente."
        />
      ) : (
        <ClientsTable 
          clients={clients}
          onEdit={(client) => setEditingClient(client)}
          onDelete={(client) => setDeleteClient(client.id)}
          onVisit={(client) => setIsVisitOpen({id:client.id,fullName:client.fullName})}
        />
      )}
      <ClientModal
        open={isCreateOpen}
        mode="create"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (data) => {
          await createClientMutation.mutateAsync(data);
          toast.success('Paciente registrado correctamente');
          setIsCreateOpen(false);
        }}
        loading={createClientMutation.isPending}
      />
     <ClientModal
        open={!!editingClient}
        mode="edit"
        client={editingClient || undefined}
        onClose={() => setEditingClient(null)}
        onSubmit={async (data) => {
          if (!editingClient) return;
          await updateClientMutation.mutateAsync({
            id: editingClient.id,
            ...data,
          });
          toast.success('Paciente actualizado correctamente');
          setEditingClient(null);
        }}
        loading={updateClientMutation.isPending}
      />
      <DeleteClientDialog
        open={!!deleteClient}
        onClose={() => setDeleteClient('')}
        onConfirm={async () => {
          if (!deleteClient) return;
            await deleteClientMutation.mutateAsync( deleteClient );
            toast.success('Paciente eliminado correctamente');
            setDeleteClient('');
        }}
        loading={deleteClientMutation.isPending}
      />
      <VisitModal
        open={!!isVisitOpen}
        mode= 'create'
        client={isVisitOpen || undefined}
        onClose={() => setIsVisitOpen(null)}
        onSubmit={async (data) => {
          if (!isVisitOpen) return;
          await createVisitMutation.mutateAsync({
            clientId: data.clientId,
            userId: data.userId,
            appointmentId: data.appointmentId,
            status: data.status,
            notes: data.notes
          });
          toast.success('Consulta creada correctamente');
          setIsVisitOpen(null);
        }}
      />
    </PageContainer>
  );
}