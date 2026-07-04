import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { CreatePatientProfileUseCase } from "../../application/use-cases/create-patient-profile.use-case";
import { UpdatePatientProfileUseCase } from "../../application/use-cases/update-patient-profile.use-case";
import { FindByClientIdUseCase } from "../../application/use-cases/find-by-client-id.use-case";
import { CreatePatientProfileDto } from "../dto/create-patient-profile.dto";
import { UpdatePatientProfileDto } from "../dto/update-patient-profile.dto";

@Controller("patient-profile")
@UseGuards(JwtAuthGuard)
export class PatientProfileController {
  constructor(
    private readonly createUseCase: CreatePatientProfileUseCase,
    private readonly updateUseCase: UpdatePatientProfileUseCase,
    private readonly findByClientIdUseCase: FindByClientIdUseCase,
  ) {}

  @Get(":clientId")
  async findByClientId(
    @Param("clientId", ParseUUIDPipe) clientId: string,
  ) {
    return this.findByClientIdUseCase.execute(clientId);
  }

  @Post()
  async create(
    @Body() dto: CreatePatientProfileDto,
  ) {
    return this.createUseCase.execute(dto);
  }

  @Patch(":clientId")
  async update(
    @Param("clientId", ParseUUIDPipe) clientId: string,
    @Body() dto: UpdatePatientProfileDto,
  ) {
    return this.updateUseCase.execute(clientId, dto);
  }
}
