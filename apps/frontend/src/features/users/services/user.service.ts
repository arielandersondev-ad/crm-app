import { api } from "@/infrastructure/api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { TenantUser, CreateTenantUserDto, Sucursal, UpdateUserRoleSucursalDto, ChangePasswordDto } from "../types/user";
import { User } from "@/shared/types/user";

class UserService {
  async getUsers(): Promise<TenantUser[]> {
    const response = await api.get<TenantUser[]>(ENDPOINTS.GET_TENANT_USERS);
    return response.data;
  }
  async getSucursales(): Promise<Sucursal[]> {
    const response = await api.get<Sucursal[]>(ENDPOINTS.GET_SUCURSAL);
    return response.data;
  }

  async createUser(dto: CreateTenantUserDto): Promise<any> {
    const response = await api.post(ENDPOINTS.CREATE, dto);
    return response.data;
  }

  async updateRoleSucursal(dto: UpdateUserRoleSucursalDto): Promise<any> {
    const response = await api.patch(ENDPOINTS.UPDATE_ROLE_SUCURSAL, dto);
    return response.data;
  }
  async activate(id: string): Promise<User> {
    console.log('peticions: ',ENDPOINTS.ACTIVATE.replace(':id',id))
    const response = await api.patch(ENDPOINTS.ACTIVATE.replace(':id',id));
    return response.data;
  }
  async deactivate(id: string): Promise<User> {
    console.log('peticions: ',ENDPOINTS.DEACTIVATE.replace(':id',id))
    const response = await api.patch(ENDPOINTS.DEACTIVATE.replace(':id',id));
    return response.data;
  }

  async removeUser(id: string): Promise<any> {
    const response = await api.delete(ENDPOINTS.REMOVE.replace(':id', id));
    return response.data;
  }

  async changePassword(dto: ChangePasswordDto): Promise<any> {
    const response = await api.patch(ENDPOINTS.CHANGE_PASSWORD, dto);
    return response.data;
  }
}

export const userService = new UserService();
