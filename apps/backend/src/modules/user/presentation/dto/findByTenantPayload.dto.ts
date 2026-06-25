export interface TenantUserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;

  memberships: {
    role: string;
  }[];

  sucursales: {
    id: string;
    userId: string;
    sucursalId: string;

    sucursal: {
      name: string;
    };
  }[];
}