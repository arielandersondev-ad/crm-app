import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { RolesGuard } from "../../../../common/guards/roles.guard";
import { Roles } from "../../../../common/decorators/roles.decorator";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { CreateConsultationUseCase } from "../../application/use-cases/create-consultation.use-case";
import { StartConsultationUseCase } from "../../application/use-cases/start-consultation.use-case";
import { UpdateConsultationUseCase } from "../../application/use-cases/update-consultation.use-case";
import { DeleteConsultationUseCase } from "../../application/use-cases/delete-consultation.use-case";
import { GetConsultationDetailUseCase } from "../../application/use-cases/get-consultation-detail.use-case";
import { GetPatientHistoryUseCase } from "../../application/use-cases/get-patient-history.use-case";
import { FindAllConsultationsUseCase } from "../../application/use-cases/find-all-consultations.use-case";
import { CreateConsultationDto } from "../dto/create-consultation.dto";
import { UpdateConsultationDto } from "../dto/update-consultation.dto";

@Controller("consultation")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsultationController {
  constructor(
    private readonly createUseCase: CreateConsultationUseCase,
    private readonly startFromAppointmentUseCase: StartConsultationUseCase,
    private readonly updateUseCase: UpdateConsultationUseCase,
    private readonly deleteUseCase: DeleteConsultationUseCase,
    private readonly getDetailUseCase: GetConsultationDetailUseCase,
    private readonly getHistoryUseCase: GetPatientHistoryUseCase,
    private readonly findAllUseCase: FindAllConsultationsUseCase,
  ) {}

  @Post()
  @Roles("ADMIN", "OWNER", "EMPLOYEE")
  async create(
    @Body() dto: CreateConsultationDto,
    @CurrentUser("tenantId") tenantId: string,
    @CurrentUser("sub") userId: string,
    @CurrentUser("sucursalId") sucursalId: string,
  ) {
    return this.createUseCase.execute(dto, tenantId, userId, sucursalId);
  }

  @Post("start-from-appointment/:appointmentId")
  @Roles("ADMIN", "OWNER", "EMPLOYEE")
  async startFromAppointment(
    @Param("appointmentId") appointmentId: string,
    @CurrentUser("tenantId") tenantId: string,
    @CurrentUser("sub") userId: string,
    @CurrentUser("sucursalId") sucursalId: string,
  ) {
    return this.startFromAppointmentUseCase.execute(appointmentId, tenantId, userId, sucursalId);
  }

  @Patch(":id")
  @Roles("ADMIN", "OWNER", "EMPLOYEE")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateConsultationDto,
    @CurrentUser("tenantId") tenantId: string,
    @CurrentUser("sub") userId: string,
    @CurrentUser("sucursalId") sucursalId: string,
  ) {
    return this.updateUseCase.execute(id, dto, tenantId, userId, sucursalId);
  }

  @Delete(":id")
  @Roles("ADMIN", "OWNER", "EMPLOYEE")
  async delete(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("tenantId") tenantId: string,
  ) {
    return this.deleteUseCase.execute(id, tenantId);
  }

  @Get("list")
  @Roles("ADMIN", "OWNER", "EMPLOYEE", "MANAGER")
  async findAll(
    @CurrentUser("tenantId") tenantId: string,
  ) {
    return this.findAllUseCase.execute(tenantId);
  }

  @Get(":id")
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("tenantId") tenantId: string,
  ) {
    return this.getDetailUseCase.execute(id, tenantId);
  }

  @Get("client/:clientId")
  async findByClientId(
    @Param("clientId", ParseUUIDPipe) clientId: string,
    @CurrentUser("tenantId") tenantId: string,
  ) {
    const result = await this.getHistoryUseCase.execute(clientId, tenantId);
    //console.log("[GET /consultation/client/:clientId] sample:", JSON.stringify(result?.slice(0, 2)?.map((c: any) => ({ id: c.id, refraction: c.refraction })), null, 2));
    return result;
  }
}
