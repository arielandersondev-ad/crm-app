import { Injectable } from "@nestjs/common";
import { PagoRepository } from "../../domain/repositories/pago.repository";
import { UpdatePagoDto } from "../../presentation/dto/update-pago.dto";
import { VisitDetailRepository } from "../../../visit-detail/domain/repositories/visit-detail.repository";

@Injectable()
export class UpdatePagoUseCase{
  constructor(
    private readonly pagoRepo: PagoRepository,
    private readonly visitDetailRepo: VisitDetailRepository,
  ){}
  async execute(dto: UpdatePagoDto) {
    if (!dto.id) throw "id requerido"
    if (!dto.visitId) throw "visitId requerido"
    if (!dto.sucursalId) throw "sucursalId requerido"

    const visitDetails = await this.visitDetailRepo.findByVisitId(dto.visitId)
    const totalMount = visitDetails.reduce((mount, detail) => mount + detail.totalPrice, 0 )

    if(dto.amount > totalMount) throw 'el valor pagado no puede ser mayor al valor total del servicio'
    return this.pagoRepo.update(dto)
  }
}