import { Injectable } from "@nestjs/common";
import { PagoRepository } from "../../domain/repositories/pago.repository";

@Injectable()
export class FindByVisitIdUseCase{
  constructor(
    private readonly pagoRepo: PagoRepository
  ){}
  execute(visitId: string){
    if (!visitId) throw "visitId Requerido"
    return this.pagoRepo.findByVisitId(visitId)
  }
}