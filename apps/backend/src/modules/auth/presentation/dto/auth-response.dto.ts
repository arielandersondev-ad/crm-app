export class UserDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export class TenantDto {
  id: string;
  name: string;
  plan: string;
}

export class SucursalDto {
  id: string;
  name: string;
}

export class AuthResponseDto {
  user: UserDto;
  tenant: TenantDto;
  sucursal: SucursalDto | null;
}
