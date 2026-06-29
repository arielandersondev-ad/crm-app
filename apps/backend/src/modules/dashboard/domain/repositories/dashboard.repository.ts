export interface DashboardStats {
  totalClients: number;
  todayAppointments: number;
  pendingAppointments: number;
  todayConsultations: number;
  totalConsultations: number;
  upcomingControls: number;
}

export abstract class DashboardRepository {
  abstract getStats(tenantId: string, sucursalId: string): Promise<DashboardStats>;
}
