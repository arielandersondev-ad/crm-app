import { Injectable } from "@nestjs/common";
import { ServiceRepository } from "../../domain/repository/service.repository";

@Injectable()
export class SoftDeleteUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository
  ) {}
  execute(tenantId: string, id: string) {
    if (!tenantId) throw new Error("TenantId is required")
    if (!id) throw new Error("Id is required")
    return this.serviceRepository.softDelete(tenantId, id);
  }
}
