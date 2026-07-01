"use client";

import { useState } from "react";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { FileText, Download } from "lucide-react";
import {
  useDownloadConsultationsReport,
  useDownloadDoctorStatistics,
  useDownloadUpcomingControls,
} from "../hooks/use-reports";
import { useAuthStore } from "@/stores/auth.store";

type ReportType = "consultations" | "doctor-stats" | "upcoming-controls";

const reportLabels: Record<ReportType, string> = {
  consultations: "Consultas por Período",
  "doctor-stats": "Estadísticas por Médico",
  "upcoming-controls": "Controles Programados",
};

export function ReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState<ReportType>("consultations");

  const branch = useAuthStore((s) => s.branch);

  const consultationsReport = useDownloadConsultationsReport();
  const doctorStatsReport = useDownloadDoctorStatistics();
  const upcomingControlsReport = useDownloadUpcomingControls();

  const isPending =
    consultationsReport.isPending ||
    doctorStatsReport.isPending ||
    upcomingControlsReport.isPending;

  const handleExport = async () => {
    const filters = { startDate, endDate };

    switch (reportType) {
      case "consultations":
        await consultationsReport.mutateAsync(filters);
        break;
      case "doctor-stats":
        await doctorStatsReport.mutateAsync(filters);
        break;
      case "upcoming-controls":
        await upcomingControlsReport.mutateAsync();
        break;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Reportes"
        description="Genere reportes clínicos en PDF"
      />

      <Card className="max-w-2xl p-6 space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Tipo de reporte</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="w-full border rounded-md p-2"
          >
            {Object.entries(reportLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {reportType !== "upcoming-controls" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Fecha inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Fecha fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="size-4" />
          {branch && <span>Sucursal: {branch.name}</span>}
        </div>

        <Button
          onClick={handleExport}
          disabled={isPending || (reportType !== "upcoming-controls" && (!startDate || !endDate))}
          className="gap-2"
        >
          <Download className="size-4" />
          {isPending ? "Generando..." : "Exportar PDF"}
        </Button>
      </Card>
    </PageContainer>
  );
}
