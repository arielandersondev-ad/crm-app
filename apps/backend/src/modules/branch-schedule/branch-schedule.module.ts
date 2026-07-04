import { Module } from "@nestjs/common";
import { BranchScheduleController } from "./presentation/http/branch-schedule.controller";
import { GetSchedulesUseCase } from "./application/use-cases/get-schedules.use-case";
import { UpsertSchedulesUseCase } from "./application/use-cases/upsert-schedules.use-case";
import { BranchScheduleRepository } from "./domain/repositories/branch-schedule.repository";
import { PrismaBranchScheduleRepository } from "./infrastructure/prisma/prisma-branch-schedule.repository";

@Module({
  controllers: [BranchScheduleController],
  providers: [
    GetSchedulesUseCase,
    UpsertSchedulesUseCase,
    {
      provide: BranchScheduleRepository,
      useClass: PrismaBranchScheduleRepository,
    },
  ],
  exports: [BranchScheduleRepository],
})
export class BranchScheduleModule {}
