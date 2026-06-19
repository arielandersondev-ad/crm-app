import { Injectable } from "@nestjs/common";
import { PagoRepository } from "../../domain/repositories/pago.repository";
import { VisitDetailRepository } from "../../../visit-detail/domain/repositories/visit-detail.repository";

@Injectable()
export class SumaryPagoUseCase{
  constructor(
    private readonly pagoRepo: PagoRepository,
    private readonly visitDetailRepo: VisitDetailRepository
  ){}
  async execute(visitId: string){
    const visitDetails = await this.visitDetailRepo.findByVisitId(visitId)
    const totalMount = visitDetails.reduce((mount, detail) => mount + detail.totalPrice, 0 )

    const allAmount = await this.pagoRepo.findByVisitId(visitId)
    const paidAmount = allAmount.reduce((total, payment)=>{
      if (payment.status === 'ACTIVE'){
        return total + payment.amount
      }
      return total
    },0)
    const paymentCount = allAmount.filter(
      payment => payment.status === 'ACTIVE'
    ).length
    const detailCount = allAmount.length

    const pendingAmount = totalMount - paidAmount
/*     
    const paiAmount = 
    const pending =  */
    return {
      visitId,
      paidAmount,
      totalMount,
      pendingAmount,
      paymentCount,
      detailCount,
    }
  }
}