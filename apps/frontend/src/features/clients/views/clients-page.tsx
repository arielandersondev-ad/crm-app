"use client";

import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { EmptyState } from "@/shared/components/empty-state";

import { useClients, useCreateClient, useDeleteClient, useUpdateClient } from "../hooks/use-clients";
import { usePatientProfile, useCreatePatientProfile, useUpdatePatientProfile } from "../hooks/use-patient-profile";
import { ClientsTable } from "../components/clients-table";
import { LoadingState } from "@/shared/components/loading-state";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ClientModal } from "../components/cliente-modal";
import { Client } from "../types/client";
import { DeleteClientDialog } from "../components/delete-cliente-dialog";
import { toast } from "sonner";
import { useCreateConsultation, useUpsertRefraction } from "@/features/consultation/hooks/use-consultation";
import { ConsultationModal } from "@/features/consultation/components/consultation-modal";
import { splitClientFormData } from "../utils/client-form";

export function ClientsPage() {
  const { data: clients, isLoading, isError } = useClients();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();
  const createPatientProfileMutation = useCreatePatientProfile();
  const updatePatientProfileMutation = useUpdatePatientProfile();
  const createConsultationMutation = useCreateConsultation();
  const upsertRefractionMutation = useUpsertRefraction();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteClient, setDeleteClient] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [consultClientId, setConsultClientId] = useState("");
  const [consultClientName, setConsultClientName] = useState("");
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  const { data: editingPatientProfile, isLoading: profileLoading, isError: profileError } = usePatientProfile(editingClient?.id);

  if (isLoading) return <LoadingState />

  if (isError) {
    return (
      <EmptyState
        title="Error al cargar pacientes"
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
          onVisit={(client) => {
            setConsultClientId(client.id);
            setConsultClientName(client.fullName);
            setConsultModalOpen(true);
          }}
        />
      )}
      <ClientModal
        open={isCreateOpen}
        mode="create"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (data) => {
          const { clientData, clinicalData, hasClinicalData } = splitClientFormData(data);
          const client = await createClientMutation.mutateAsync(clientData);
          if (hasClinicalData) {
            await createPatientProfileMutation.mutateAsync({
              clientId: client.id,
              ...clinicalData,
            });
          }
          toast.success('Paciente registrado correctamente');
          setIsCreateOpen(false);
        }}
        loading={createClientMutation.isPending || createPatientProfileMutation.isPending}
      />
     <ClientModal
        open={!!editingClient}
        mode="edit"
        client={editingClient || undefined}
        patientProfile={editingPatientProfile}
        onClose={() => setEditingClient(null)}
        onSubmit={async (data) => {
          if (!editingClient) return;
          const { clientData, clinicalData, hasClinicalData } = splitClientFormData(data);
          await updateClientMutation.mutateAsync({
            id: editingClient.id,
            ...clientData,
          });
          if (editingPatientProfile) {
            await updatePatientProfileMutation.mutateAsync({
              clientId: editingClient.id,
              ...clinicalData,
            });
          } else if (hasClinicalData && !editingPatientProfile) {
            await createPatientProfileMutation.mutateAsync({
              clientId: editingClient.id,
              ...clinicalData,
            });
          }
          toast.success('Paciente actualizado correctamente');
          setEditingClient(null);
        }}
        loading={updateClientMutation.isPending || updatePatientProfileMutation.isPending || createPatientProfileMutation.isPending}
        disabled={profileLoading || profileError}
        notice={profileLoading ? "Cargando antecedentes clínicos..." : profileError ? "No se pudieron cargar los antecedentes. Cierre y vuelva a abrir la edición para reintentar." : undefined}
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
      <ConsultationModal
        open={consultModalOpen}
        mode="create"
        clientId={consultClientId}
        clientName={consultClientName}
        loading={createConsultationMutation.isPending}
        onClose={() => {
          setConsultModalOpen(false);
          setConsultClientId("");
          setConsultClientName("");
        }}
        onSubmit={async (data: any) => {
          const consultation = await createConsultationMutation.mutateAsync({
            clientId: data.clientId,
            motivo: data.motivo,
            diagnostico: data.diagnostico,
            observaciones: data.observaciones,
            nextControlAt: data.nextControlAt || undefined,
            consultationDate: data.consultationDate || undefined,
          });
          const refractionFields = [
            "odLejosEsf","odLejosCil","odLejosEje","odLejosAv",
            "oiLejosEsf","oiLejosCil","oiLejosEje","oiLejosAv",
            "lejosDip","odCercaEsf","odCercaCil","odCercaEje","odCercaAv",
            "oiCercaEsf","oiCercaCil","oiCercaEje","oiCercaAv",
            "cercaDip","add",
          ];
          const refraction: any = {};
          let hasValues = false;
          for (const field of refractionFields) {
            if (data[field] !== undefined && data[field] !== "") {
              refraction[field] = data[field];
              hasValues = true;
            }
          }
          if (hasValues) {
            await upsertRefractionMutation.mutateAsync({ consultationId: consultation.id, dto: refraction });
          }
          toast.success("Consulta registrada correctamente");
          setConsultModalOpen(false);
          setConsultClientId("");
          setConsultClientName("");
        }}
      />
    </PageContainer>
  );
}
