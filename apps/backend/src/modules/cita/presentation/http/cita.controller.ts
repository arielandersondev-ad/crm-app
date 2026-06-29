import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { RolesGuard } from "../../../../common/guards/roles.guard";
import { Roles } from "../../../../common/decorators/roles.decorator";
import { CreateCitaDto } from "../dto/create-cita.dto";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { CreateCitaUseCase } from "../../application/use-cases/create-cita.use-case";
import { UpdateCitaDto } from "../dto/update-cita.dto";
import { UpdateCitaUseCase } from "../../application/use-cases/update-cita.use-case";
import { FindAllBySucursalUseCase } from "../../application/use-cases/find-all-by-sucursal.use-case";
import { FindAgendaUseCase } from "../../application/use-cases/find-agenda.use-case";
import { FindByClientIdUseCase } from "../../application/use-cases/find-by-client-id.use-case";

@Controller('cita')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CitaController{
  constructor(
    private readonly creatCitaUseCase: CreateCitaUseCase,
    private readonly updateCitaUseCase: UpdateCitaUseCase,
    private readonly findAllBySucursalUseCase: FindAllBySucursalUseCase,
    private readonly findAgendaUseCase: FindAgendaUseCase,
    private readonly findByClientIdUseCase: FindByClientIdUseCase,
  ){}

  @Post('create')
  async create(
    @Body() data: CreateCitaDto,

    @CurrentUser('sub') userId: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sucursalId') sucursalId: string,
  ){
    return this.creatCitaUseCase.execute(tenantId,sucursalId,userId,data)
  }
  
  @Patch('update/:id')
  @Roles("ADMIN", "OWNER", "EMPLOYEE", "MANAGER")
  async update(
    @Body() data: UpdateCitaDto,
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sucursalId') sucursalId: string,
  ){
    return this.updateCitaUseCase.execute(tenantId,sucursalId,id,data)
  }

  @Get('all')
  async findAllBySucursal(
    @CurrentUser('sucursalId') sucursalId: string,
    @CurrentUser('tenantId') tenantId: string,
  ){
    return this.findAllBySucursalUseCase.execute(tenantId, sucursalId)
  }
  @Get('client/:clientId')
  async findByClientId(
    @Param('clientId') clientId: string,
  ){
    return this.findByClientIdUseCase.execute(clientId)
  }

  @Get('agenda')
  async findAgenda(
    @CurrentUser('sucursalId') sucursalId: string,
    @CurrentUser('tenantId') tenantId: string,
  ){
    return this.findAgendaUseCase.execute(tenantId, sucursalId)
  }
}