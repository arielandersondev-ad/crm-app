import { Injectable } from "@nestjs/common";
import { ServiceRepository } from "../../domain/repository/service.repository";
import { UpdateServiceDto } from "../../presentation/dto/update.service.dto";
import { ServiceEntity } from "../../domain/entities/service.entity";

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
  ) {}
  async execute(tenantId: string, service: UpdateServiceDto): Promise<ServiceEntity> {
    return this.serviceRepository.update(tenantId, service);
  }
}
