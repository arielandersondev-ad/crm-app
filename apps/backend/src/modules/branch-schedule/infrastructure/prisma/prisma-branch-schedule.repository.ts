import { Injectable } from "@nestjs/common";
import { BranchScheduleRepository, UpsertScheduleItem } from "../../domain/repositories/branch-schedule.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { BranchSchedule } from "../../domain/entities/branch-schedule.entity";

@Injectable()
export class PrismaBranchScheduleRepository implements BranchScheduleRepository {
  constructor(private prisma: PrismaService) {}

  async findBySucursalId(sucursalId: string): Promise<BranchSchedule[]> {
    const schedules = await this.prisma.branchSchedule.findMany({
      where: { sucursalId },
      orderBy: { dayOfWeek: "asc" },
    });
    return schedules.map((s) => this.toEntity(s));
  }

  async upsertMany(sucursalId: string, items: UpsertScheduleItem[]): Promise<BranchSchedule[]> {
    const results: BranchSchedule[] = [];
    for (const item of items) {
      const schedule = await this.prisma.branchSchedule.upsert({
        where: {
          sucursalId_dayOfWeek: { sucursalId, dayOfWeek: item.dayOfWeek as any },
        },
        update: {
          openTime: item.openTime,
          closeTime: item.closeTime,
          isOpen: item.isOpen ?? true,
        },
        create: {
          sucursalId,
          dayOfWeek: item.dayOfWeek as any,
          openTime: item.openTime,
          closeTime: item.closeTime,
          isOpen: item.isOpen ?? true,
        },
      });
      results.push(this.toEntity(schedule));
    }
    return results;
  }

  private toEntity(s: any): BranchSchedule {
    return new BranchSchedule(
      s.id,
      s.sucursalId,
      s.dayOfWeek,
      s.openTime,
      s.closeTime,
      s.isOpen,
    );
  }
}
