import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "../../../user/domain/repositories/user.repositoriy";
import { MembershipRepository } from "../../../membership/domain/repositories/membership.repository";
import { TenantRepository } from "../../../tenant/domain/repositories/tenant.repository";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";

@Injectable()
export class GetMeUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly membershipRepo: MembershipRepository,
    private readonly tenantRepo: TenantRepository,
    private readonly sucursalRepo: SucursalRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const memberships = await this.membershipRepo.findByUserId(user.id);
    if (!memberships?.length) throw new UnauthorizedException('Sin acceso a tenants');

    const membership = memberships[0];

    const tenant = await this.tenantRepo.findOne(membership.tenantId);
    if (!tenant) throw new NotFoundException('Tenant no encontrado');

    const sucursales = await this.sucursalRepo.findByTenantId(tenant.id);
    const sucursal = sucursales?.length ? sucursales[0] : null;

    return {
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
