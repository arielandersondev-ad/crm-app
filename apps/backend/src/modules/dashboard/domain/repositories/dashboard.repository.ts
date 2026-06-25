export interface DashboardStats {
  totalClients: number;
  todayAppointments: number;
  todayVisits: number;
  todayRevenue: number;
  pendingAppointments: number;
}

export abstract class DashboardRepository {
  abstract getStats(tenantId: string, sucursalId: string): Promise<DashboardStats>;
}
