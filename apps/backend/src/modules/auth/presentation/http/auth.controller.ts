import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { RegisterTenantUserUseCase } from "../../application/use-cases/register-tenant-user.use-case";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { GetMeUseCase } from "../../application/use-cases/get-me.use-case";
import { LoginRequestDto } from "../dto/login.dto";
import { RegisterRequestDto } from "../dto/register.dto";
import { RegisterTenantUserDto } from "../dto/register-tenant-user.dto";
import { JwtAuthGuard } from "../../infrastructure/security/jwt-auth.guard";
import { JwtPayload } from "../../infrastructure/service/jwt-payload.interface";
import { Response } from "express";
import { RefreshTokenUseCase } from "../../application/use-cases/refresh-token.use-case";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase, 
    private readonly registerTenantUserUseCase: RegisterTenantUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly refreshUseCase: RefreshTokenUseCase,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = dto;
    const result = await this.loginUseCase.execute(email, password);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return {
      user: result.user,
      tenant: result.tenant,
      sucursal: result.sucursal,
    };
  }

  @Post('register')
  async register(
    @Body() dto: RegisterRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password, nombres, apellidos } = dto;
    const result = await this.registerUseCase.execute(email, password, nombres, apellidos);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return {
      user: result.user,
      tenant: result.tenant,
      sucursal: result.sucursal,
    };
  }

  @Post('tenant-user')
  @UseGuards(JwtAuthGuard)
  async registerTenantUser(
    @Body() dto: RegisterTenantUserDto,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sucursalId') sucursalId: string,
  ) {
    return this.registerTenantUserUseCase.execute(
      dto.email,
      dto.password,
      dto.firstName,
      dto.lastName,
      dto.role,
      tenantId,
      sucursalId,
    );
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { success: true };
  }

  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('Refresh token no encontrado');
    const result = await this.refreshUseCase.execute(refreshToken);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    const payload: JwtPayload = req.user;
    return this.getMeUseCase.execute(payload.sub);
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };
    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}