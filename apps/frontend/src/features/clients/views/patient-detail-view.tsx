"use client";

import { useParams, useRouter } from "next/navigation";
import { useClientById } from "../hooks/use-client-by-id";
import { usePatientProfile } from "../hooks/use-patient-profile";
import { usePatientAppointments } from "../hooks/use-patient-appointments";
import { usePatientConsultations, useCreateConsultation, useUpdateConsultation, useUpsertRefraction } from "@/features/consultation/hooks/use-consultation";
import { ConsultationModal } from "@/features/consultation/components/consultation-modal";
import { LoadingState } from "@/shared/components/loading-state";
import { EmptyState } from "@/shared/components/empty-state";
import { PageContainer } from "@/shared/components/page-container";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft, Calendar, ClipboardList, FileText, MapPin, Phone, Mail, Plus, Stethoscope, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("es-BO");
}

const statusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED": return "secondary";
    case "DRAFT": return "default";
    case "CANCELLED": return "destructive";
    default: return "outline";
  }
};

function ClinicalSummary({ consultations, appointments }: { consultations: any[]; appointments: any[] }) {
  const last = consultations?.[0];
  if (!last) return null;

  const formatRefraction = (r: any) => {
    if (!r?.odLejosEsf && !r?.oiLejosEsf) return null;
    return `OD ${r.odLejosEsf ?? "-"}/${r.odLejosCil ?? "-"}x${r.odLejosEje ?? "-"} · OI ${r.oiLejosEsf ?? "-"}/${r.oiLejosCil ?? "-"}x${r.oiLejosEje ?? "-"}`;
  };

  const nextAppt = useMemo(() => {
    const future = appointments?.filter((a: any) => new Date(a.scheduledAt) > new Date()).sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    return future?.[0] ?? null;
  }, [appointments]);

  return (
    <div className="border rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-xs text-muted-foreground flex items-center gap-1"><ClipboardList className="size-3" /> Último diagnóstico</p>
        <p className="font-medium text-sm mt-1">{last.diagnostico || "Sin diagnóstico"}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="size-3" /> Última refracción</p>
        <p className="font-medium text-sm mt-1">{formatRefraction(last.refraction) || "Sin refracción"}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="size-3" /> Último control</p>
        <p className="font-medium text-sm mt-1">{last.consultationDate ? formatDate(last.consultationDate) : "-"}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="size-3" /> Próxima cita</p>
        <p className="font-medium text-sm mt-1">{nextAppt ? formatDateTime(nextAppt.scheduledAt) : "Sin cita programada"}</p>
      </div>
    </div>
  );
}

export function PatientDetailView() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [consultationTarget, setConsultationTarget] = useState<any>(null);
  const [consultationMode, setConsultationMode] = useState<"create" | "edit" | "view" | null>(null);

  const { data: client, isLoading: clientLoading, isError: clientError } = useClientById(clientId);
  const { data: profile, isLoading: profileLoading } = usePatientProfile(clientId);
  const { data: appointments, isLoading: appointmentsLoading } = usePatientAppointments(clientId);
  const { data: consultations, isLoading: consultationsLoading } = usePatientConsultations(clientId);
  const createConsultationMutation = useCreateConsultation();
  const updateConsultationMutation = useUpdateConsultation();
  const upsertRefractionMutation = useUpsertRefraction();

  if (clientLoading) return <LoadingState />;

  if (clientError || !client) {
    return (
      <EmptyState
        title="Paciente no encontrado"
        description="El paciente que buscas no existe o fue eliminado."
      />
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/clientes")}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{client.fullName}</h1>
            <p className="text-sm text-muted-foreground">
              {client.documentNumber && `Doc: ${client.documentNumber} · `}
              {formatDate(client.birthDate)} · {client.email}
            </p>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border rounded-lg p-4 flex items-center gap-3">
            <Phone className="size-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Teléfono</p>
              <p className="font-medium">{client.phone || "-"}</p>
            </div>
          </div>
          <div className="border rounded-lg p-4 flex items-center gap-3">
            <Mail className="size-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{client.email || "-"}</p>
            </div>
          </div>
          <div className="border rounded-lg p-4 flex items-center gap-3">
            <MapPin className="size-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Dirección</p>
              <p className="font-medium">{client.address || "-"}</p>
            </div>
          </div>
        </div>

        {/* Resumen clínico */}
        <ClinicalSummary consultations={consultations} appointments={appointments} />

        {/* Tabs */}
        <Tabs defaultValue="consultas">
          <TabsList>
            <TabsTrigger value="consultas">
              <Stethoscope className="size-4" />
              Consultas ({consultations?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="antecedentes">
              <FileText className="size-4" />
              Antecedentes
            </TabsTrigger>
            <TabsTrigger value="citas">
              <Calendar className="size-4" />
              Citas ({appointments?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Consultas (timeline) */}
          <TabsContent value="consultas" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {consultations?.length ?? 0} consulta(s) registrada(s)
              </p>
              <Button onClick={() => { setConsultationTarget(null); setConsultationMode("create"); }} className="gap-2">
                <Plus className="size-4" />
                Nueva consulta
              </Button>
            </div>

            {consultationsLoading ? (
              <LoadingState />
            ) : consultations?.length ? (
              <div className="space-y-3">
                {consultations.map((c: any) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { 
                      //console.log("[Card click] consultation:", JSON.stringify({ id: c.id, refraction: c.refraction }, null, 2)); 
                      setConsultationTarget(c); setConsultationMode("view"); }}
                    className="w-full text-left border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="size-4 text-muted-foreground" />
                        <p className="font-medium">{formatDateTime(c.consultationDate || c.createdAt)}</p>
                      </div>
                      <Badge variant={statusBadge(c.status)}>{c.status}</Badge>
                    </div>
                    <p className="text-sm font-medium">{c.motivo}</p>
                    {c.diagnostico && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{c.diagnostico}</p>
                    )}
                    {c.user && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Dr. {c.user.firstName} {c.user.lastName}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Sin consultas registradas"
                description="Este paciente no tiene consultas clínicas. Registre la primera consulta."
              />
            )}
          </TabsContent>

          {/* Tab: Antecedentes */}
          <TabsContent value="antecedentes" className="mt-4">
            <div className="border rounded-lg p-6 space-y-4">
              {profileLoading ? (
                <LoadingState />
              ) : profile ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Antecedentes médicos</label>
                    <p className="mt-1">{profile.antecedentes || "Sin antecedentes registrados"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Alergias</label>
                    <p className="mt-1">{profile.alergias || "Sin alergias registradas"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contacto de emergencia</label>
                    <p className="mt-1">{profile.contactoEmergencia || "No registrado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Observaciones</label>
                    <p className="mt-1">{profile.observaciones || "Sin observaciones"}</p>
                  </div>
                </>
              ) : (
                <EmptyState
                  title="Sin antecedentes clínicos"
                  description="Este paciente no tiene antecedentes registrados."
                />
              )}
            </div>
          </TabsContent>

          {/* Tab: Citas */}
          <TabsContent value="citas" className="mt-4">
            {appointmentsLoading ? (
              <LoadingState />
            ) : appointments?.length ? (
              <div className="space-y-3">
                {appointments.map((cita: any) => (
                  <div key={cita.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{formatDateTime(cita.scheduledAt)}</p>
                      <p className="text-sm text-muted-foreground">
                        {cita.user ? `${cita.user.firstName} ${cita.user.lastName}` : "Sin asignar"}
                      </p>
                    </div>
                    <Badge variant={cita.status === "CONFIRMED" ? "default" : cita.status === "COMPLETED" ? "secondary" : cita.status === "CANCELLED" ? "destructive" : "outline"}>
                      {cita.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Sin citas" description="Este paciente no tiene citas registradas." />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal: Consulta (create / view / edit) */}
      <ConsultationModal
        open={consultationMode !== null}
        mode={consultationMode === "create" ? "create" : consultationMode === "edit" ? "edit" : "view"}
        consultation={consultationTarget}
        clientId={clientId}
        clientName={client?.fullName}
        loading={createConsultationMutation.isPending || updateConsultationMutation.isPending}
        onClose={() => { setConsultationMode(null); setConsultationTarget(null); }}
        onEdit={() => setConsultationMode("edit")}
        onSubmit={async (data) => {
          if (consultationMode === "create") {
            const consultation = await createConsultationMutation.mutateAsync({
              clientId: data.clientId,
              motivo: data.motivo,
              diagnostico: data.diagnostico,
              observaciones: data.observaciones,
              nextControlAt: data.nextControlAt || undefined,
              consultationDate: data.consultationDate || undefined,
            });

            const refraction = {
              odLejosEsf: data.odLejosEsf,
              odLejosCil: data.odLejosCil,
              odLejosEje: data.odLejosEje,
              odLejosAv: data.odLejosAv,
              oiLejosEsf: data.oiLejosEsf,
              oiLejosCil: data.oiLejosCil,
              oiLejosEje: data.oiLejosEje,
              oiLejosAv: data.oiLejosAv,
              lejosDip: data.lejosDip,
              odCercaEsf: data.odCercaEsf,
              odCercaCil: data.odCercaCil,
              odCercaEje: data.odCercaEje,
              odCercaAv: data.odCercaAv,
              oiCercaEsf: data.oiCercaEsf,
              oiCercaCil: data.oiCercaCil,
              oiCercaEje: data.oiCercaEje,
              oiCercaAv: data.oiCercaAv,
              cercaDip: data.cercaDip,
              add: data.add,
            };

            const hasValues = Object.values(refraction).some((v) => v !== undefined);
            if (hasValues) {
              await upsertRefractionMutation.mutateAsync({
                consultationId: consultation.id,
                dto: refraction,
              });
            }

            toast.success("Consulta registrada correctamente");
            setConsultationMode(null);
            setConsultationTarget(null);
          }

          if (consultationMode === "edit" && consultationTarget) {
            await updateConsultationMutation.mutateAsync({
              id: consultationTarget.id,
              dto: {
                motivo: data.motivo,
                diagnostico: data.diagnostico,
                observaciones: data.observaciones,
                nextControlAt: data.nextControlAt || undefined,
                consultationDate: data.consultationDate || undefined,
              },
            });

            const refraction = {
              odLejosEsf: data.odLejosEsf,
              odLejosCil: data.odLejosCil,
              odLejosEje: data.odLejosEje,
              odLejosAv: data.odLejosAv,
              oiLejosEsf: data.oiLejosEsf,
              oiLejosCil: data.oiLejosCil,
              oiLejosEje: data.oiLejosEje,
              oiLejosAv: data.oiLejosAv,
              lejosDip: data.lejosDip,
              odCercaEsf: data.odCercaEsf,
              odCercaCil: data.odCercaCil,
              odCercaEje: data.odCercaEje,
              odCercaAv: data.odCercaAv,
              oiCercaEsf: data.oiCercaEsf,
              oiCercaCil: data.oiCercaCil,
              oiCercaEje: data.oiCercaEje,
              oiCercaAv: data.oiCercaAv,
              cercaDip: data.cercaDip,
              add: data.add,
            };

            const hasValues = Object.values(refraction).some((v) => v !== undefined);
            if (hasValues) {
              await upsertRefractionMutation.mutateAsync({
                consultationId: consultationTarget.id,
                dto: refraction,
              });
            }

            toast.success("Consulta actualizada correctamente");
            setConsultationMode(null);
            setConsultationTarget(null);
          }
        }}
      />
    </PageContainer>
  );
}
