import {
  ConsultationReport,
  DoctorStatistic,
  UpcomingControl,
} from "../interfaces/report.interface";

export interface ConsultationFilters {
  tenantId: string;
  sucursalId?: string;
  startDate: string;
  endDate: string;
  userId?: string;
}

export interface DashboardMetrics {
  todayConsultations: number;
  totalConsultations: number;
  upcomingControls: number;
}

export abstract class ReportRepository {
  abstract getConsultationsByPeriod(filters: ConsultationFilters): Promise<ConsultationReport[]>;
  abstract getDoctorStatistics(filters: ConsultationFilters): Promise<DoctorStatistic[]>;
  abstract getUpcomingControls(tenantId: string, sucursalId?: string): Promise<UpcomingControl[]>;
  abstract getDashboardMetrics(tenantId: string, sucursalId: string): Promise<DashboardMetrics>;
}
