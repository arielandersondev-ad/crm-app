import { Injectable, Logger } from "@nestjs/common";
import { MembershipRepository } from "../../domain/repositories/membership.repository";
import { UpdateMembershipDto } from "../../presentation/dto/update-membership.dto";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
@Injectable()
export class UpdateMembershipUseCase {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly prisma: PrismaService
  ) {}

  async execute(dto: UpdateMembershipDto) {
    Logger.log(JSON.stringify(dto));
    if (!dto.id) {throw new Error('Id is required')}

    if (dto.userId) {Logger.log('Editando... User')}
    if (dto.tenantId) {Logger.log('Editando... Tenant')}
    if (dto.role) {Logger.log('Editando... Role')}

    return this.membershipRepository.update(this.prisma,dto.id, dto.userId, dto.tenantId, dto.role);
  }
}