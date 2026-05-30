import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "./jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "../../application/ports/token.service";

// firmar con JWT_SECRET + JWT_EXPIRES_IN
// firmar con JWT_REFRESH_SECRET + JWT_REFRESH_EXPIRES_IN
// llamar a ambos
// verificar con JWT_SECRET
// verificar con JWT_REFRESH_SECRET
// sin validar firma (debug/logs)
// extrae Bearer xxx → xxx

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET')!,
      expiresIn: this.configService.get('JWT_EXPIRES_IN')!,
    });
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET')!,
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN')!,
    });
  }

  async generateTokenPair(payload: JwtPayload): Promise<{ accessToken: string; refreshToken: string; expiresIn: string; expiresInRefresh: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('JWT_EXPIRES_IN')!,
      expiresInRefresh: this.configService.get('JWT_REFRESH_EXPIRES_IN')!,
    };
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET')!,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET')!,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    const decode = this.jwtService.decode(token);
    if (!decode || typeof decode === 'string')return null
    return decode as JwtPayload;
  }

  extractTokenFromHeader(authorization?: string): string | null {
    if (!authorization)return null
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) return null;
    return token;
  }
}