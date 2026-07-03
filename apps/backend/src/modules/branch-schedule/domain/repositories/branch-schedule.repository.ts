import { BranchSchedule } from "../entities/branch-schedule.entity";

export interface UpsertScheduleItem {
  dayOfWeek: string;
  openTime?: string | null;
  closeTime?: string | null;
  isOpen?: boolean;
}

export abstract class BranchScheduleRepository {
  abstract findBySucursalId(sucursalId: string): Promise<BranchSchedule[]>;
  abstract upsertMany(sucursalId: string, schedules: UpsertScheduleItem[]): Promise<BranchSchedule[]>;
}
