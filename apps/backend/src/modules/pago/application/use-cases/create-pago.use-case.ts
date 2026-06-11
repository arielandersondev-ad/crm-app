import { Injectable } from "@nestjs/common";
import { PagoRepository } from "../../domain/repositories/pago.repository";
import { CreatePagoDto } from "../../presentation/dto/create-pago.dto";

@Injectable()
export class CreatePagoUseCase{
  constructor(
    private readonly pagoRepo: PagoRepository
  ){}
  execute(dto: CreatePagoDto) {
    if (dto.visitId) throw ('visitId requerido') 
    if (dto.sucursalId) throw ('sucursalId requerido') 
    return this.pagoRepo.create(dto)
  }
}