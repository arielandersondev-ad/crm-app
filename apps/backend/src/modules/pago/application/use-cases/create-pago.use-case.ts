import { Injectable } from "@nestjs/common";
import { PagoRepository } from "../../domain/repositories/pago.repository";
import { CreatePagoDto } from "../../presentation/dto/create-pago.dto";
import { SumaryPagoUseCase } from "./sumary-pago.use-case";

@Injectable()
export class CreatePagoUseCase{
  constructor(
    private readonly pagoRepo: PagoRepository,
    private readonly sumary: SumaryPagoUseCase
  ){}
  async execute(dto: CreatePagoDto) {
    if (!dto.visitId) throw ('visitId requerido') 
    if (!dto.sucursalId) throw ('sucursalId requerido')
    const details = await this.sumary.execute(dto.visitId)
    if(dto.amount > details.pendingAmount) throw 'el valor pagado no puede ser mayor al valor total del servicio'
    return this.pagoRepo.create(dto)
  }
}