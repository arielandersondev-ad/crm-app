import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { UserRepository } from "../../domain/repositories/user.repositoriy";
import { UserSucursalRepository } from "../../domain/repositories/user-sucursal.repository";
import * as bcrypt from 'bcrypt';
import { UserRole } from "@prisma/client";
import { MembershipRepository } from "../../../membership/domain/repositories/membership.repository";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";

@Injectable()
export class CreateUserSucursalUseCase{
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepo: UserRepository,
    private readonly membershipRepo: MembershipRepository,
    private readonly userSucursalRepo: UserSucursalRepository,
    private readonly sucursalRepo: SucursalRepository,
  ){}

  async execute( email: string, password: string, firstName: string, lastName: string, role: UserRole, tenantId: string, sucursalId: string, )  {
    let user: any;let sucursal: any;let membership: any
    const saltRounds = 10;
    
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser)throw new Error('El email ya está registrado')
      
    const sucursalExist = await this.sucursalRepo.findById(sucursalId);
    if (!sucursalExist) throw new Error('Sucursal no encontrada')
    if (sucursalExist.tenantId !== tenantId) throw new Error('La sucursal no pertenece al tenant')
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    await this.prisma.$transaction(async (tx) => {
      user = await this.userRepo.create(tx, email, hashedPassword, firstName, lastName);
      membership = await this.membershipRepo.create(tx, user.id, tenantId, role);
      sucursal = await this.userSucursalRepo.assignSucursal(tx, user.id, sucursalId);
    });
    return {
      user,
      membership,
      sucursal
    };
  }
}