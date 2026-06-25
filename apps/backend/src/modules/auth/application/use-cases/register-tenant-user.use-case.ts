import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UserRole } from "@prisma/client";
import { UserRepository } from "../../../user/domain/repositories/user.repositoriy";
import { TenantRepository } from "../../../tenant/domain/repositories/tenant.repository";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";
import { MembershipRepository } from "../../../membership/domain/repositories/membership.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";

@Injectable()
export class RegisterTenantUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly membershipRepo: MembershipRepository,
    private readonly tenantRepo: TenantRepository,
    private readonly sucursalRepo: SucursalRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole,
    tenantId: string,
    sucursalId: string,
  ) {
    Logger.log('1 validando Email');
    const existUser = await this.userRepo.findByEmail(email);
    if (existUser) {
      throw new ConflictException('Email ya esta en uso');
    }

    Logger.log('2 validando Tenant');
    const tenant = await this.tenantRepo.findOne(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant no encontrado');
    }

    Logger.log('3 validando Sucursal');
    const sucursal = await this.sucursalRepo.findById(sucursalId);
    if (!sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    Logger.log('4 Hasheando Password');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let user: any, membership: any;

    await this.prisma.$transaction(async (tx) => {
      Logger.log('5 Creando user');
      user = await this.userRepo.create(tx, email, hashedPassword, firstName, lastName);

      Logger.log('6 creando membership');
      membership = await this.membershipRepo.create(tx, user.id, tenantId, role);
    });

    Logger.log('7 respondiendo');
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      membership: {
        id: membership.id,
        role: membership.role,
        tenantId,
      },
    };
  }
}
