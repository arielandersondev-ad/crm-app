"use client";

import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { EmptyState } from "@/shared/components/empty-state";

import { useClients, useCreateClient, useUpdateClient } from "../hooks/use-clients";
import { ClientsTable } from "../components/clients-table";
import { LoadingState } from "@/shared/components/loading-state";
import { Button } from "@/shared/components/ui/button";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import { ClientModal } from "../components/cliente-modal";
import { Client } from "../types/client";

export function ClientsPage() {
  const { data: clients, isLoading, isError } = useClients();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  if (isLoading) {
    return <LoadingState />;
  }

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
        title="Clientes"
        description="Gestión de clientes"
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
              Nuevo cliente
            </Button>
          </div>
        }
      />

      {!clients?.length ? (
        <EmptyState
          title="No hay clientes registrados"
          description="Crea tu primer cliente."
        />
      ) : (
        <ClientsTable 
          clients={clients}
          onEdit={(client) => {
            setEditingClient(client);
          }}
        />
      )}
      <ClientModal
        open={isCreateOpen}
        mode="create"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (data) => {
          await createClientMutation.mutateAsync(data);
          setIsCreateOpen(false);
        }}
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
          setEditingClient(null);
        }}
      />
    </PageContainer>
  );
}