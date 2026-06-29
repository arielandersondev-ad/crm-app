import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { DashboardRepository, DashboardStats } from "../../domain/repositories/dashboard.repository";
import { ReportRepository } from "../../../reports/domain/repositories/report.repository";

@Injectable()
export class PrismaDashboardRepository extends DashboardRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportRepo: ReportRepository,
  ) {
    super();
  }

  async getStats(tenantId: string, sucursalId: string): Promise<DashboardStats> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [totalClients, todayAppointments, pendingAppointments, clinical] =
      await Promise.all([
        this.prisma.client.count({
          where: { tenantId, isActive: true },
        }),

        this.prisma.appointment.count({
          where: {
            sucursalId,
            scheduledAt: { gte: todayStart, lte: todayEnd },
            status: { in: ["PENDING", "CONFIRMED"] },
          },
        }),

        this.prisma.appointment.count({
          where: {
            sucursalId,
            status: "PENDING",
          },
        }),

        this.reportRepo.getDashboardMetrics(tenantId, sucursalId),
      ]);

    return {
      totalClients,
      todayAppointments,
      pendingAppointments,
      ...clinical,
    };
  }
}
