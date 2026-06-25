import { api } from "@/infrastructure/api/axios";

export interface DashboardStats {
  totalClients: number;
  todayAppointments: number;
  todayVisits: number;
  todayRevenue: number;
  pendingAppointments: number;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>("/dashboard/stats");
    return response.data;
  }
}

export const dashboardService = new DashboardService();
