import { Injectable } from "@nestjs/common";
import { BranchScheduleRepository } from "../../domain/repositories/branch-schedule.repository";

@Injectable()
export class GetSchedulesUseCase {
  constructor(
    private readonly scheduleRepository: BranchScheduleRepository,
  ) {}

  async execute(sucursalId: string) {
    return this.scheduleRepository.findBySucursalId(sucursalId);
  }
}
