import { Injectable } from "@nestjs/common";
import { CreateMembershipDto } from "../../presentation/dto/create-memebership.dto";
import { MembershipRepository } from "../../domain/repositories/membership.repository";
import { UserRole } from "@prisma/client";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";

@Injectable()
export class CreateMembershipUseCase {
  constructor(
    private readonly membershipRepo: MembershipRepository,
    private readonly prisma: PrismaService,
   ) {}
  async execute(dto: CreateMembershipDto) {
    return this.membershipRepo.create(this.prisma, dto.userId, dto.tenantId, dto.role as UserRole);
  }
}