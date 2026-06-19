import { Injectable } from "@nestjs/common";
import { VisitDetailRepository } from "../domain/repositories/visit-detail.repository";
import { CreateVisitDetailDto } from "../presentation/dto/create-visit-detail.dto";
import { VisitDetailEntity } from "../domain/entities/visit-detail.entity";
import { ServiceRepository } from "../../service/domain/repository/service.repository";

@Injectable()
export class CreateVisitDetailUseCase {
  constructor(
    private readonly visitDetailRepo: VisitDetailRepository,
    private readonly serviceRepo: ServiceRepository,
    
  ) {}

  async execute(visitDetail: CreateVisitDetailDto): Promise<VisitDetailEntity> {
    const service = await this.serviceRepo.findById(visitDetail.serviceId);
    if (!service) throw new Error('Service no encontrado')
    
    return this.visitDetailRepo.create({
      visitId: visitDetail.visitId,
      serviceId: visitDetail.serviceId,
      quantity: visitDetail.quantity,
      serviceName: service.name,
      unitPrice: service.basePrice,
      totalPrice: service.basePrice * visitDetail.quantity,
      notes: visitDetail.notes,
    });
  }
}
