import { Injectable } from "@nestjs/common";
import { BranchScheduleRepository, UpsertScheduleItem } from "../../domain/repositories/branch-schedule.repository";

@Injectable()
export class UpsertSchedulesUseCase {
  constructor(
    private readonly scheduleRepository: BranchScheduleRepository,
  ) {}

  async execute(sucursalId: string, schedules: UpsertScheduleItem[]) {
    return this.scheduleRepository.upsertMany(sucursalId, schedules);
  }
}
