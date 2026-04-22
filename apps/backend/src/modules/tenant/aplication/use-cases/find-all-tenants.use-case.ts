import { Injectable } from "@nestjs/common";
import { TenantRepository } from "../../domain/repositories/tenant.repository";

@Injectable()
export class FindAllTenantsUseCase {
  constructor(private readonly tenantRepo: TenantRepository) {}
  async execute() {
    return this.tenantRepo.findAll();
  }
}