import { Injectable } from "@nestjs/common";
import { MembershipRepository } from "../../domain/repositories/membership.repository";

@Injectable()
export class FindByTenantUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}
  async execute(tenantId: string) {
    return this.membershipRepository.findByTenantId(tenantId);
  }
}
