'use client'
import { useState } from "react";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { LoadingState } from "@/shared/components/loading-state";
import { EmptyState } from "@/shared/components/empty-state";
import { StatusBadge } from "@/shared/components/status-badge";
import { SearchModal } from "@/shared/components/search-modal/search-modal";
import { useAllConsultations, useCreateConsultation, useUpdateConsultation, useUpsertRefraction } from "@/features/consultation/hooks/use-consultation";
import { ConsultationModal } from "@/features/consultation/components/consultation-modal";
import { useClients } from "@/features/clients/hooks/use-clients";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { useDownloadClinicalSummary } from "@/features/reports/hooks/use-reports";

const CLINICAL_ROLES = ["ADMIN", "OWNER", "EMPLOYEE"];

export default function ConsultasPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view" | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [showPatientSearch, setShowPatientSearch] = useState(false);

  const { data: consultations, isLoading, isError } = useAllConsultations();
  const { data: clients } = useClients();
  const createMutation = useCreateConsultation();
  const updateMutation = useUpdateConsultation();
  const upsertRefractionMutation = useUpsertRefraction();
  const downloadSummaryMutation = useDownloadClinicalSummary();
  const userRole = useAuthStore((s) => s.user?.role);
  const canEdit = !!userRole && CLINICAL_ROLES.includes(userRole);

  if (isLoading) return <LoadingState />;
  if (isError) return <EmptyState title="Error al cargar consultas" description="Intente nuevamente más tarde." />;

  return (
    <PageContainer>
      <PageHeader
        title="Consultas Clínicas"
        description="Historial de consultas clínicas de pacientes"
        actions={
          <div className="flex gap-2 items-center">
            {canEdit && (
              <Button
                onClick={() => setShowPatientSearch(true)}
                className="gap-2"
              >
                <Plus className="size-4" />
                Nueva consulta
              </Button>
            )}
          </div>
        }
      />

      {!consultations?.length ? (
        <EmptyState
          title="No hay consultas clínicas registradas"
          description="Registre una nueva consulta desde la ficha del paciente o desde la agenda."
        />
      ) : (
        <div className="max-w-full overflow-x-auto rounded-lg border">
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Fecha</th>
                <th className="text-left p-3 font-medium">Paciente</th>
                <th className="text-left p-3 font-medium">Médico</th>
                <th className="text-left p-3 font-medium">Motivo</th>
                <th className="text-center p-3 font-medium">Estado</th>
                <th className="text-center p-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((c: any) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-muted/30 cursor-pointer"
                  onClick={() => {
                    setSelectedConsultation(c);
                    setModalMode("view");
                    setModalOpen(true);
                  }}
                >
                  <td className="p-3">
                    {new Date(c.consultationDate).toLocaleDateString("es-BO")}
                  </td>
                  <td className="p-3 font-medium">{c.client?.fullName ?? "—"}</td>
                  <td className="p-3 text-muted-foreground">
                    {c.user ? `${c.user.firstName} ${c.user.lastName}` : "—"}
                  </td>
                  <td className="p-3 max-w-xs truncate">{c.motivo}</td>
                  <td className="p-3 text-center">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      {canEdit && c.status === "DRAFT" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedConsultation(c);
                            setModalMode("edit");
                            setModalOpen(true);
                          }}
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SearchModal
        title="Seleccionar paciente"
        open={showPatientSearch}
        items={(clients ?? []).map((c: any) => ({
          id: c.id,
          label: c.fullName,
          description: c.documentNumber ?? "",
        }))}
        onClose={() => setShowPatientSearch(false)}
        onSelect={(item) => {
          setShowPatientSearch(false);
          setSelectedClientId(item.id);
          setSelectedClientName(item.label);
          setSelectedConsultation(null);
          setModalMode("create");
          setModalOpen(true);
        }}
      />

      {modalMode && (
        <ConsultationModal
          open={modalOpen}
          mode={modalMode === "create" ? "create" : modalMode === "edit" ? "edit" : "view"}
          consultation={selectedConsultation}
          clientId={selectedClientId || selectedConsultation?.clientId}
          clientName={selectedClientName || selectedConsultation?.client?.fullName}
          loading={createMutation.isPending || updateMutation.isPending}
          canEdit={canEdit}
          onClose={() => { setModalOpen(false); setModalMode(null); setSelectedConsultation(null); }}
          onEdit={() => setModalMode("edit")}
          onFinalize={async () => {
            if (!selectedConsultation) return;
            await updateMutation.mutateAsync({
              id: selectedConsultation.id,
              dto: { status: "COMPLETED" },
            });
            toast.success("Consulta finalizada");
            setModalOpen(false);
            setModalMode(null);
            setSelectedConsultation(null);
          }}
          onPrintSummary={async () => {
            if (!selectedConsultation) return;
            await downloadSummaryMutation.mutateAsync(selectedConsultation.id);
          }}
          onSubmit={async (data: any) => {
            if (modalMode === "create") {
              const consultation = await createMutation.mutateAsync({
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
              setModalOpen(false);
              setModalMode(null);
              setSelectedConsultation(null);
            }
            if ((modalMode === "edit" || modalMode === "view") && selectedConsultation) {
              await updateMutation.mutateAsync({
                id: selectedConsultation.id,
                dto: {
                  motivo: data.motivo,
                  diagnostico: data.diagnostico,
                  observaciones: data.observaciones,
                  nextControlAt: data.nextControlAt || undefined,
                  consultationDate: data.consultationDate || undefined,
                },
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
                await upsertRefractionMutation.mutateAsync({ consultationId: selectedConsultation.id, dto: refraction });
              }
              toast.success("Consulta actualizada correctamente");
              setModalOpen(false);
              setModalMode(null);
              setSelectedConsultation(null);
            }
          }}
        />
      )}
    </PageContainer>
  );
}
