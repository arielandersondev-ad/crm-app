'use client'
import { EmptyState } from "@/shared/components/empty-state";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useCreateService, useDeleteService, useServices, useUpdateService } from "../hooks/use-services";
import { LoadingState } from "@/shared/components/loading-state";
import { ServiceModal } from "../components/service-modal";
import { useState } from "react";
import { toast } from "sonner";
import { ServiceTable } from "../components/service-table";
import { Service } from "../types/service";
import { DeleteServiceDialog } from "../components/delete-service.dialog";

export function ServicePage() {
  const { data: services, isLoading, error } = useServices();

  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();
  
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteService, setDeleteService] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  if (isLoading) return <LoadingState />
  if (error) {
    return (
      <EmptyState
        title="Error al cargar Servicios"
      />
    );
  }
  return (
    <PageContainer>
      <PageHeader
        title="Servicios title"
        description="Gestión de servicios"
        actions={
          <div className="flex gap-2 items-center justify-center align-center">
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4" />
              Nuevo servicio
            </Button>
          </div>
        }
      />
      {!services?.length ? (
        <EmptyState
          title="No hay servicios registrados"
          description="Crea tu primer servicio."
        />
      ):(
        <ServiceTable 
          services={services}
          onEdit={(service) => setEditingService(service)}
          onDelete={(service) => setDeleteService(service.id)}
        />
      )}
      <ServiceModal 
        open={isCreateOpen}
        mode='create'
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (data) => {
          await createServiceMutation.mutateAsync(data);
          toast.success('Servicio creado correctamente');
          setIsCreateOpen(false);
        }}
        loading={createServiceMutation.isPending}
      />
      <ServiceModal 
        open={!!editingService}
        mode='edit'
        service={editingService ?? undefined}
        onClose={() => setEditingService(null)}
        onSubmit={async (data) => {
          if (!editingService) return
          await updateServiceMutation.mutateAsync({
            id: editingService.id,
            ...data,
          });
          toast.success('Servicio actualizado correctamente');
          setEditingService(null);
        }}
        loading={updateServiceMutation.isPending}
      />
      <DeleteServiceDialog
        open={!!deleteService}
        onClose={() => setDeleteService('')}
        onConfirm={async () => {
          console.log('Confirm delete: ', deleteService);
          if (!deleteService) return;
          await deleteServiceMutation.mutateAsync(
            deleteService
          );
          toast.success('Servicio eliminado correctamente');
          setDeleteService('');
        }}
      />
    </PageContainer>
  );
}