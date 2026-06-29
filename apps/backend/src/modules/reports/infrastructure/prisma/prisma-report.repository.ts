import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { ReportRepository, ConsultationFilters } from "../../domain/repositories/report.repository";
import {
  ConsultationReport,
  DoctorStatistic,
  UpcomingControl,
} from "../../domain/interfaces/report.interface";

@Injectable()
export class PrismaReportRepository implements ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getConsultationsByPeriod(filters: ConsultationFilters): Promise<ConsultationReport[]> {
    const where: any = {
      tenantId: filters.tenantId,
      consultationDate: {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      },
    };

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.sucursalId) {
      where.user = {
        sucursales: { some: { sucursalId: filters.sucursalId } },
      };
    }

    console.log("[getConsultationsByPeriod] where:", JSON.stringify(where));

    let consultations = await this.prisma.consultation.findMany({
      where,
      select: {
        id: true,
        clientId: true,
        userId: true,
        consultationDate: true,
        status: true,
        motivo: true,
        diagnostico: true,
        nextControlAt: true,
        client: { select: { fullName: true, documentNumber: true } },
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { consultationDate: "desc" },
    });

    if (consultations.length === 0 && filters.sucursalId) {
      console.warn("[getConsultationsByPeriod] 0 con sucursal, reintentando sin filtro");
      const { user: _, ...whereNoSucursal } = where;
      consultations = await this.prisma.consultation.findMany({
        where: whereNoSucursal,
        select: {
          id: true,
          clientId: true,
          userId: true,
          consultationDate: true,
          status: true,
          motivo: true,
          diagnostico: true,
          nextControlAt: true,
          client: { select: { fullName: true, documentNumber: true } },
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { consultationDate: "desc" },
      });
    }

    return consultations.map((c) => ({
      id: c.id,
      clientId: c.clientId,
      clientFullName: c.client.fullName,
      clientDocId: c.client.documentNumber ?? undefined,
      doctorId: c.userId,
      doctorName: `${c.user.firstName} ${c.user.lastName}`,
      consultationDate: c.consultationDate,
      status: c.status,
      motivo: c.motivo,
      diagnostico: c.diagnostico ?? undefined,
      nextControlAt: c.nextControlAt ?? undefined,
    }));
  }

  async getDoctorStatistics(filters: ConsultationFilters): Promise<DoctorStatistic[]> {
    const where: any = {
      tenantId: filters.tenantId,
      consultationDate: {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      },
    };

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.sucursalId) {
      where.user = {
        sucursales: { some: { sucursalId: filters.sucursalId } },
      };
    }

    console.log("[getDoctorStatistics] where:", JSON.stringify(where));

    let consultations = await this.prisma.consultation.findMany({
      where,
      select: {
        userId: true,
        status: true,
        clientId: true,
        nextControlAt: true,
        user: { select: { firstName: true, lastName: true } },
      },
    });

    if (consultations.length === 0 && filters.sucursalId) {
      console.warn("[getDoctorStatistics] 0 con sucursal, reintentando sin filtro");
      const { user: _, ...whereNoSucursal } = where;
      consultations = await this.prisma.consultation.findMany({
        where: whereNoSucursal,
        select: {
          userId: true,
          status: true,
          clientId: true,
          nextControlAt: true,
          user: { select: { firstName: true, lastName: true } },
        },
      });
    }

    const statsMap = new Map<string, DoctorStatistic>();
    const patientSetMap = new Map<string, Set<string>>();

    for (const c of consultations) {
      if (!statsMap.has(c.userId)) {
        statsMap.set(c.userId, {
          doctorId: c.userId,
          doctorName: `${c.user.firstName} ${c.user.lastName}`,
          totalConsultations: 0,
          uniquePatients: 0,
          completedConsultations: 0,
          cancelledConsultations: 0,
          upcomingControls: 0,
        });
        patientSetMap.set(c.userId, new Set());
      }

      const stat = statsMap.get(c.userId)!;
      stat.totalConsultations++;
      patientSetMap.get(c.userId)!.add(c.clientId);

      if (c.status === "COMPLETED") stat.completedConsultations++;
      if (c.status === "CANCELLED") stat.cancelledConsultations++;
      if (c.nextControlAt) stat.upcomingControls++;
    }

    for (const [userId, set] of patientSetMap) {
      statsMap.get(userId)!.uniquePatients = set.size;
    }

    return Array.from(statsMap.values());
  }

  async getUpcomingControls(tenantId: string, sucursalId?: string): Promise<UpcomingControl[]> {
    const now = new Date();

    const where: any = {
      tenantId,
      nextControlAt: { gte: now },
    };

    if (sucursalId && sucursalId !== "all" && sucursalId !== "undefined") {
      where.user = {
        sucursales: { some: { sucursalId } },
      };
    }

    console.log("[getUpcomingControls] where:", JSON.stringify(where));

    let consultations = await this.prisma.consultation.findMany({
      where,
      select: {
        clientId: true,
        userId: true,
        consultationDate: true,
        nextControlAt: true,
        motivo: true,
        client: { select: { fullName: true, phone: true } },
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { nextControlAt: "asc" },
    });

    if (consultations.length === 0 && sucursalId && sucursalId !== "all") {
      console.warn("[getUpcomingControls] 0 con sucursal, reintentando sin filtro");
      const { user: _, ...whereNoSucursal } = where;
      consultations = await this.prisma.consultation.findMany({
        where: whereNoSucursal,
        select: {
          clientId: true,
          userId: true,
          consultationDate: true,
          nextControlAt: true,
          motivo: true,
          client: { select: { fullName: true, phone: true } },
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { nextControlAt: "asc" },
      });
    }

    return consultations.map((c) => ({
      clientId: c.clientId,
      clientFullName: c.client.fullName,
      clientPhone: c.client.phone ?? undefined,
      doctorName: `${c.user.firstName} ${c.user.lastName}`,
      nextControlAt: c.nextControlAt!,
      lastConsultationDate: c.consultationDate,
      motivo: c.motivo,
    }));
  }

  async getDashboardMetrics(tenantId: string, sucursalId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [todayConsultations, totalConsultations, upcomingControls] = await Promise.all([
      this.prisma.consultation.count({
        where: {
          tenantId,
          consultationDate: { gte: todayStart, lte: todayEnd },
        },
      }),
      this.prisma.consultation.count({ where: { tenantId } }),
      this.prisma.consultation.count({
        where: {
          tenantId,
          nextControlAt: { gte: new Date() },
        },
      }),
    ]);

    return { todayConsultations, totalConsultations, upcomingControls };
  }
}
