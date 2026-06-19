import { Injectable } from '@nestjs/common';
import { VisitDetailRepository } from '../domain/repositories/visit-detail.repository';
import { ServiceRepository } from '../../service/domain/repository/service.repository';
import { CreateManyVisitDetailDto } from '../presentation/dto/create-visit-detail.dto';



@Injectable()
export class CreateManyVisitDetailUseCase {

  constructor(
    private readonly visitDetailRepo: VisitDetailRepository,
    private readonly serviceRepo: ServiceRepository,
  ) {}

  async execute(dto: CreateManyVisitDetailDto) {

    const services = await Promise.all(
      dto.details.map(detail =>
        this.serviceRepo.findById(
          detail.serviceId
        )
      )
    );

    const serviceMap = new Map(
      services
        .filter(Boolean)
        .map(service => [
          service!.id,
          service!,
        ])
    );
    const detailsToCreate =
      dto.details.map(detail => {

        const service =
          serviceMap.get(
            detail.serviceId
          );

        if (!service) {
          throw new Error(
            `Servicio ${detail.serviceId} no encontrado`
          );
        }
        const unitPrice = Number(service.basePrice);
        return {
          visitId: dto.visitId,
          serviceId: service.id,
          quantity: detail.quantity,
          serviceName: service.name,
          unitPrice: unitPrice,
          totalPrice:
            unitPrice *
            detail.quantity,
          notes: detail.notes,
        };
      });

    return this.visitDetailRepo.createMany(detailsToCreate);
  }
}