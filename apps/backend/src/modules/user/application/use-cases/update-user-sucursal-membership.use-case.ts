import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { UserRepository } from "../../domain/repositories/user.repositoriy";
import { MembershipRepository } from "../../../membership/domain/repositories/membership.repository";
import { UserSucursalRepository } from "../../domain/repositories/user-sucursal.repository";
import { UpdateUserSucursalMembershipDto } from "../../presentation/dto/update-user.dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class UpdateUserSucursalMembershipUseCase{
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepo: UserRepository,
    private readonly memberRepo: MembershipRepository,
    private readonly userSucursalRepo: UserSucursalRepository,
  ){}
  async execute (dto: UpdateUserSucursalMembershipDto, tenantId:string){
    const {id,email,firstName,lastName,role,sucursalId} = dto
    let user: any;let membership: any; let sucursal:any
    await this.prisma.$transaction(async (tx) => {
      user = await this.userRepo.update(tx, id, email, firstName, lastName);
      membership = await this.memberRepo.updateRolByUser(tx, user.id, tenantId, role as UserRole);
      sucursal = await this.userSucursalRepo.updateSucursalUser(tx, user.id, sucursalId);
    });
    return {
      user,
      membership,
      sucursal
    }
  }
}