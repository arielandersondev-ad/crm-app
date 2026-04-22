import { Injectable } from "@nestjs/common";
import { MembershipRepository } from "../../domain/repositories/membership.repository";

@Injectable()
export class DeleteMembershipUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}
  async execute(id: string) {
    return this.membershipRepository.delete(id);
  }
}