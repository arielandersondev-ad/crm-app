export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  sucursalId: string;
  role: string;
}