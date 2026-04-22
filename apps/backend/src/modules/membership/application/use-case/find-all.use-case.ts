import { Injectable } from "@nestjs/common";
import { MembershipRepository } from "../../domain/repositories/membership.repository";

@Injectable()
export class FindAllUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}
  async execute() {
    return this.membershipRepository.findAll();
  }
}