import { Injectable } from "@nestjs/common";
import { CreateMembershipDto } from "../../presentation/dto/create-memebership.dto";
import { MembershipRepository } from "../../domain/repositories/membership.repository";
import { UserRole } from "@prisma/client";

@Injectable()
export class CreateMembershipUseCase {
  constructor(private readonly membershipRepo: MembershipRepository) {}
  async execute(dto: CreateMembershipDto) {
    return this.membershipRepo.create(dto.userId, dto.tenantId, dto.role as UserRole);
  }
}