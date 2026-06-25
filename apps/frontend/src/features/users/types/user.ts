export interface TenantUser {
  id: string;
  role: string;
  userId: string;
  user: UserType
  isActive: boolean;
}
interface UserType{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
};

export interface CreateTenantUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UpdateUserRoleSucursalDto {
  id: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  sucursalId?: string
}
export interface Sucursal{
  id:       string 
  tenantId: string 
  name:      string
  latitude:  number
  longitude: number
  direccion: string
  telefono:  string
  correo:    string
  timezone:  string
  isDefault: boolean
  isActive:  boolean
  createdAt: Date
  updatedAt: Date
}
