import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { CreatePagoDto } from "../dto/create-pago.dto";
import { CreatePagoUseCase } from "../../application/use-cases/create-pago.use-case";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { UpdatePagoUseCase } from "../../application/use-cases/update-pago.use-case";
import { UpdatePagoDto } from "../dto/update-pago.dto";
import { FindByVisitIdUseCase } from "../../application/use-cases/find-by-visit-id.use-case";
import { ChangePagoUseCase } from "../../application/use-cases/change-pago.use-case";
import { SumaryPagoUseCase } from "../../application/use-cases/sumary-pago.use-case";

@Controller('pago')
@UseGuards(JwtAuthGuard)
export class PagoController{
  constructor(
    private readonly createPagoUseCase: CreatePagoUseCase,
    private readonly updatePagoUseCase: UpdatePagoUseCase,
    private readonly findByVisitIdUseCase: FindByVisitIdUseCase,
    private readonly changePagoUseCase: ChangePagoUseCase,
    private readonly sumaryPagoUseCase: SumaryPagoUseCase,
  ){}

  @Post('create')
  async create (
    @CurrentUser('sucursalId') sucursalId: string, 
    @Body() pago: CreatePagoDto
  ){
    pago.sucursalId = sucursalId
    return this.createPagoUseCase.execute(pago)
  }

  @Patch('update/:id')
  async update (
    @Param('id') id: string,
    @CurrentUser('sucursalId') sucursalId: string,
    @Body() pago:UpdatePagoDto 
  ) {
    pago.id = id
    pago.sucursalId = sucursalId
    return this.updatePagoUseCase.execute(pago)
  }

  @Get('allByVisitId/:visitId')
  async findByVisitId (
    @Param("visitId") visitId: string
  ){
    return this.findByVisitIdUseCase.execute(visitId)
  }

  @Patch("void/:id")
  async void(
    @Param("id") id: string,
  ){
    return this.changePagoUseCase.execute('desactivar',id)
  }
  @Patch("activate/:id")
  async activate(
    @Param("id") id: string,
  ){
    return this.changePagoUseCase.execute('activar',id)
  }
  @Get("sumary/:visitId")
  async sumary(
    @Param('visitId') visitId: string
  ){
    return this.sumaryPagoUseCase.execute(visitId)
  }
}