import { Injectable } from "@nestjs/common";
import { ServiceRepository } from "../../domain/repository/service.repository";

@Injectable()
export class FindAllUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
  ) {}
  async execute(tenantId: string) {
    if (!tenantId) throw new Error('Tenant ID is required')
    return this.serviceRepository.findAllActive(tenantId);
  }
}