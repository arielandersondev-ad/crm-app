import { api } from "@/infrastructure/api/axios";

export interface DashboardStats {
  totalClients: number;
  todayAppointments: number;
  pendingAppointments: number;
  todayConsultations: number;
  totalConsultations: number;
  upcomingControls: number;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>("/dashboard/stats");
    return response.data;
  }
}

export const dashboardService = new DashboardService();
