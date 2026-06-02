"use client";

import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { EmptyState } from "@/shared/components/empty-state";

import { useClients } from "../hooks/use-clients";
import { ClientsTable } from "../components/clients-table";
import { LoadingState } from "@/shared/components/loading-state";

export function ClientsPage() {
  const {
    data: clients,
    isLoading,
    isError,
  } = useClients();

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
      />

      {!clients?.length ? (
        <EmptyState
          title="No hay clientes registrados"
          description="Crea tu primer cliente."
        />
      ) : (
        <ClientsTable clients={clients} />
      )}
    </PageContainer>
  );
}