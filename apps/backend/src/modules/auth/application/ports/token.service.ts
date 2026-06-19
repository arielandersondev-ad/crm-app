import { JwtPayload } from "../../infrastructure/service/jwt-payload.interface";

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
export interface TokenService {
  generateAccessToken(payload: JwtPayload): Promise<string>;
  generateRefreshToken(payload: JwtPayload): Promise<string>;
  verifyRefreshToken(token: string): Promise<JwtPayload>; 
  generateTokenPair(payload: JwtPayload): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
    expiresInRefresh: string;
  }>;
}
