import { ConflictException, Inject, Injectable, Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UserRole } from "@prisma/client";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";
import { TenantRepository } from "../../../tenant/domain/repositories/tenant.repository";
import { UserRepository } from "../../../user/domain/repositories/user.repositoriy";
import { MembershipRepository } from "../../../membership/domain/repositories/membership.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { TOKEN_SERVICE, TokenService } from "../ports/token.service";
import { JwtPayload } from "../../infrastructure/service/jwt-payload.interface";
@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly membershipRepo: MembershipRepository,
    private readonly tenantRepo: TenantRepository,
    private readonly sucursalRepo: SucursalRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,

    private readonly prisma: PrismaService,
  ) {}
  async execute(email: string, password: string, nombres: string, apellidos: string, rol?: string) {
    
    Logger.log('1 validando Email');
    const existUser = await this.userRepo.findByEmail(email);
    if (existUser) {
      throw new ConflictException('Email ya esta en uso');
    }

    Logger.log('2 Hasheando Password');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let tenant: any, sucursal: any, user: any, membership: any;

    await this.prisma.$transaction(async (tx) => {
      Logger.log('3 creando tenant');
      tenant = await this.tenantRepo.create(tx, 'Mi empresa');

      Logger.log('4 Crear sucursal por defecto');
      sucursal = await this.sucursalRepo.create(tx, 'Sucursal-Principal', '-', 0, 0, '', email, 'America/La_Paz', tenant.id);
      
      Logger.log('5 Creando user');
      user = await this.userRepo.create(tx, email, hashedPassword, nombres, apellidos);

      Logger.log('6 creando membership');
      membership = await this.membershipRepo.create(tx, user.id, tenant.id, rol as UserRole ?? UserRole.ADMIN);
    });

    Logger.log('7 generando tokens');
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: tenant.id,
      sucursalId: sucursal.id,
      role: membership.role,
    };
    const tokens = await this.tokenService.generateTokenPair(payload);

    Logger.log('8 respondiendo');
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      expiresInRefresh: tokens.expiresInRefresh,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: membership.role,
      },
      tenant: { id: tenant.id, name: tenant.name, plan: tenant.plan },
      sucursal: sucursal ? { id: sucursal.id, name: sucursal.name } : null,
    };
  }
}