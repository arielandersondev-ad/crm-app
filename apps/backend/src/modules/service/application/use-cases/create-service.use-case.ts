import { Injectable } from "@nestjs/common";
import { ServiceRepository } from "../../domain/repository/service.repository";
import { CreateServiceDto } from "../../presentation/dto/create.service.dto";
import { ServiceEntity } from "../../domain/entities/service.entity";

@Injectable()
export class CreateServiceUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
  ) {}
  async execute(tenantId: string, service: CreateServiceDto): Promise<ServiceEntity> {
    return this.serviceRepository.create(tenantId, service);
  }
}