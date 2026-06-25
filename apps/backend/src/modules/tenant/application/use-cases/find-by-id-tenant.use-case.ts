import { Injectable } from "@nestjs/common";
import { TenantRepository } from "../../domain/repositories/tenant.repository";

@Injectable()
export class FindByIdTenantUseCase {
  constructor(
    private readonly tenantRepo: TenantRepository
  ) {}
  async execute(id: string) {
    return this.tenantRepo.findOne(id);
  }
}
