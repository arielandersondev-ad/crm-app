import { Injectable } from "@nestjs/common";
import { PagoRepository } from "../../domain/repositories/pago.repository";
import { SumaryPagoUseCase } from "./sumary-pago.use-case";

@Injectable()
export class ChangePagoUseCase{
  constructor(
    private readonly pagoRepo: PagoRepository,
    private readonly sumaryUseCase: SumaryPagoUseCase
  ){}
  async execute(option: string, id: string){
    const payment = await this.pagoRepo.findById(id)
    const sumary = await this.sumaryUseCase.execute(payment.visitId)
    if(!option) throw 'es necesarion seleccionar una opcion'
    if(option === "desactivar"){
      this.pagoRepo.desactivar(id)
    }
    if(option === "activar") {
      if(payment.amount > sumary.pendingAmount)throw 'el calculo determino que no se puede revertir'
      this.pagoRepo.activar(id)
    }
  }
}