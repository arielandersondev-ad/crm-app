import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { DashboardRepository, DashboardStats } from "../../domain/repositories/dashboard.repository";

@Injectable()
export class PrismaDashboardRepository extends DashboardRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async getStats(tenantId: string, sucursalId: string): Promise<DashboardStats> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [totalClients, todayAppointments, todayVisits, todayRevenue, pendingAppointments] =
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

        this.prisma.visit.count({
          where: {
            sucursalId,
            startedAt: { gte: todayStart, lte: todayEnd },
          },
        }),

        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            sucursalId,
            paidAt: { gte: todayStart, lte: todayEnd },
            status: "ACTIVE",
          },
        }),

        this.prisma.appointment.count({
          where: {
            sucursalId,
            status: "PENDING",
          },
        }),
      ]);

    return {
      totalClients,
      todayAppointments,
      todayVisits,
      todayRevenue: Number(todayRevenue._sum.amount ?? 0),
      pendingAppointments,
    };
  }
}
