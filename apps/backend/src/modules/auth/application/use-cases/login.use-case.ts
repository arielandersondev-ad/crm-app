import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { TOKEN_SERVICE, TokenService } from "../ports/token.service";
import { JwtPayload } from "../../infrastructure/service/jwt-payload.interface";
import { UserRepository } from "../../../user/domain/repositories/user.repositoriy";
import { MembershipRepository } from "../../../membership/domain/repositories/membership.repository";
import { TenantRepository } from "../../../tenant/domain/repositories/tenant.repository";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";
import * as bcrypt from "bcrypt";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,

    private readonly userRepo: UserRepository,
    private readonly membershipRepo: MembershipRepository,
    private readonly tenantRepo: TenantRepository,
    private readonly sucursalRepo: SucursalRepository,
  ) {}
  async execute(email: string, password: string) {

    // 1. buscar user por email
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    if (!user.isActive) throw new UnauthorizedException('Usuario inactivo. Contacte con el administrador');

    // 2. Verificar password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Credenciales inválidas');

    // 3. Obtener memberships
    const memberships = await this.membershipRepo.findByUserId(user.id);
    if (!memberships?.length) throw new UnauthorizedException('Sin acceso a tenants');
    const membership = memberships[0];
    // 4. Obtener tenant
    const tenant = await this.tenantRepo.findOne(membership.tenantId);
    if (!tenant) throw new UnauthorizedException('Tenant no encontrado');

    // 5. Obtener sucursal
    const sucursales = await this.sucursalRepo.findByTenantId(membership.tenantId);
    if (!sucursales?.length) throw new UnauthorizedException('Sucursal no encontrada');
    const sucursal = sucursales[0];
    
    // 6. Generar tokens
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: tenant.id,
      sucursalId: sucursal?.id,
      role: membership.role,
    };
    const tokens = await this.tokenService.generateTokenPair(payload);

    // 7. Retornar
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
    }
  }
}
