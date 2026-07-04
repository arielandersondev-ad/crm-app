import { Body, Controller, Get, Param, ParseUUIDPipe, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { GetSchedulesUseCase } from "../../application/use-cases/get-schedules.use-case";
import { UpsertSchedulesUseCase } from "../../application/use-cases/upsert-schedules.use-case";
import { UpsertSchedulesDto } from "../dto/upsert-schedule.dto";

@Controller("sucursal/:sucursalId/schedules")
@UseGuards(JwtAuthGuard)
export class BranchScheduleController {
  constructor(
    private readonly getSchedulesUseCase: GetSchedulesUseCase,
    private readonly upsertSchedulesUseCase: UpsertSchedulesUseCase,
  ) {}

  @Get()
  async findAll(@Param("sucursalId", ParseUUIDPipe) sucursalId: string) {
    return this.getSchedulesUseCase.execute(sucursalId);
  }

  @Put()
  async upsert(
    @Param("sucursalId", ParseUUIDPipe) sucursalId: string,
    @Body() dto: UpsertSchedulesDto,
  ) {
    return this.upsertSchedulesUseCase.execute(sucursalId, dto.schedules);
  }
}
