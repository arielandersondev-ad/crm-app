import { Injectable } from "@nestjs/common";
import { MembershipRepository } from "../../domain/repositories/membership.repository";

@Injectable()
export class FindByUserIdUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}
  async execute(userId: string) {
    return this.membershipRepository.findByUserId(userId);
  }
}