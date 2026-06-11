import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { CreatePagoDto } from "../dto/create-pago.dto";
import { CreatePagoUseCase } from "../../application/use-cases/create-pago.use-case";

@Controller('pago')
@UseGuards(JwtAuthGuard)
export class PagoController{
  constructor(
    private readonly createPagoUseCase: CreatePagoUseCase
  ){}

  @Post('create')
  async create (
    @Body() pago: CreatePagoDto
  ){
    return this.createPagoUseCase.execute(pago)
  }
}