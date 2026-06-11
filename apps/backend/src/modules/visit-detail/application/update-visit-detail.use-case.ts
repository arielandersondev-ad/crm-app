import { Injectable } from "@nestjs/common";
import { VisitDetailRepository } from "../domain/repositories/visit-detail.repository";
import { VisitDetailEntity } from "../domain/entities/visit-detail.entity";
import { UpdateVisitDetailDto } from "../presentation/dto/update-visit-detail.dto";
import { ServiceRepository } from "../../service/domain/repository/service.repository";

@Injectable()
export class UpdateVisitDetailUseCase {
  constructor(
    private readonly visitDetailRepo: VisitDetailRepository,
    private readonly serviceRepo: ServiceRepository,
  ) {}

  async execute(id: string, visitDetail: UpdateVisitDetailDto): Promise<VisitDetailEntity> {
    // Buscar el detalle existente primero
    const existingDetail = await this.visitDetailRepo.findById(id);
    if (!existingDetail) throw new Error('Visit detail not found');

    // Si se envía serviceId, buscar el servicio y actualizar los datos relacionados
    let serviceName = existingDetail.serviceName;
    let unitPrice = existingDetail.unitPrice;
    let totalPrice = existingDetail.totalPrice;

    if (visitDetail.serviceId) {
      const service = await this.serviceRepo.findById(visitDetail.serviceId);
      if (!service) throw new Error('Service no encontrado');
      serviceName = service.name;
      unitPrice = service.basePrice;
    }

    // Si se envía quantity, recalcular totalPrice
    if (visitDetail.quantity) {
      totalPrice = Number(unitPrice) * Number(visitDetail.quantity);
    }

    return this.visitDetailRepo.update({
      id,
      visitId: visitDetail.visitId || existingDetail.visitId,
      serviceId: visitDetail.serviceId || existingDetail.serviceId,
      quantity: visitDetail.quantity || existingDetail.quantity,
      serviceName,
      unitPrice,
      totalPrice,
      notes: visitDetail.notes !== undefined ? visitDetail.notes : existingDetail.notes,
    });
  }
}
