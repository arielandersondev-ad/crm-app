import { useMutation } from "@tanstack/react-query";
import { reportService, ReportFilters } from "../services/report.service";
import { toast } from "sonner";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function useDownloadConsultationsReport() {
  return useMutation({
    mutationFn: (filters: ReportFilters) =>
      reportService.downloadConsultationsByPeriod(filters),
    onSuccess: (data) => {
      downloadBlob(data, "consultas-por-periodo.pdf");
      toast.success("Reporte descargado");
    },
    onError: () => toast.error("Error al generar el reporte"),
  });
}

export function useDownloadDoctorStatistics() {
  return useMutation({
    mutationFn: (filters: ReportFilters) =>
      reportService.downloadDoctorStatistics(filters),
    onSuccess: (data) => {
      downloadBlob(data, "estadisticas-por-medico.pdf");
      toast.success("Reporte descargado");
    },
    onError: () => toast.error("Error al generar el reporte"),
  });
}

export function useDownloadUpcomingControls() {
  return useMutation({
    mutationFn: () => reportService.downloadUpcomingControls(),
    onSuccess: (data) => {
      downloadBlob(data, "controles-programados.pdf");
      toast.success("Reporte descargado");
    },
    onError: () => toast.error("Error al generar el reporte"),
  });
}

export function useDownloadClinicalSummary() {
  return useMutation({
    mutationFn: (consultationId: string) =>
      reportService.downloadClinicalSummary(consultationId),
    onSuccess: (data) => {
      downloadBlob(data, "resumen-consulta.pdf");
      toast.success("Resumen descargado");
    },
    onError: () => toast.error("Error al generar el resumen"),
  });
}
