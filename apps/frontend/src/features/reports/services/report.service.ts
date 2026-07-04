import { api } from "@/infrastructure/api/axios";
import { REPORTS_ENDPOINTS } from "../api/endpoints";

export interface ReportFilters {
  startDate: string;
  endDate: string;
  userId?: string;
}

const PDF_TIMEOUT = 30000;

export class ReportService {
  async downloadConsultationsByPeriod(filters: ReportFilters): Promise<Blob> {
    const response = await api.post(REPORTS_ENDPOINTS.CONSULTATIONS_BY_PERIOD, filters, {
      responseType: "blob",
      timeout: PDF_TIMEOUT,
    });
    return response.data;
  }

  async downloadDoctorStatistics(filters: ReportFilters): Promise<Blob> {
    const response = await api.post(REPORTS_ENDPOINTS.DOCTOR_STATISTICS, filters, {
      responseType: "blob",
      timeout: PDF_TIMEOUT,
    });
    return response.data;
  }

  async downloadUpcomingControls(): Promise<Blob> {
    const response = await api.get(REPORTS_ENDPOINTS.UPCOMING_CONTROLS, {
      responseType: "blob",
      timeout: PDF_TIMEOUT,
    });
    return response.data;
  }

  async downloadClinicalSummary(consultationId: string): Promise<Blob> {
    const response = await api.get(REPORTS_ENDPOINTS.CLINICAL_SUMMARY(consultationId), {
      responseType: "blob",
      timeout: PDF_TIMEOUT,
    });
    return response.data;
  }
}

export const reportService = new ReportService();
