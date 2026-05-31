import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { TOKEN_SERVICE, TokenService } from "../ports/token.service";
import { UserRepository } from "../../../user/domain/repositories/user.repositoriy";
import { MembershipRepository } from "../../../membership/domain/repositories/membership.repository";
import { TenantRepository } from "../../../tenant/domain/repositories/tenant.repository";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";
import { JwtPayload } from "../../infrastructure/service/jwt-payload.interface";

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepository,
    private readonly membershipRepo: MembershipRepository,
    private readonly tenantRepo: TenantRepository,
    private readonly sucursalRepo: SucursalRepository,

  ) {}

  async execute(refreshTokenParam: string) {
    // 1. Verificar refresh token
    const payload = await this.tokenService.verifyRefreshToken(refreshTokenParam);
    
    // 2. Verificar que el usuario aún existe y está activo
    const user = await this.userRepo.findById(payload.sub);
    if (!user || !user.isActive) throw new UnauthorizedException('Usuario no encontrado o inactivo.');
    
    // 3. Generar nuevo token pair
    const newPayload: JwtPayload = { ...payload };
    const { accessToken, refreshToken, expiresIn, expiresInRefresh } = await this.tokenService.generateTokenPair(newPayload);
    
    // 4. Retornar mismo shape que login/register
    return { accessToken, refreshToken, expiresIn, expiresInRefresh };
  }

}
