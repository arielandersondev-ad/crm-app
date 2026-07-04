import { api } from "@/infrastructure/api/axios";
import { ENDPOINTS } from "@/infrastructure/api/endpoints";

import type { AuthResponse } from "../types/auth-response";
import type { LoginFormData } from "../schemas/login.schema";
import { RegisterRequest } from "../types/register-request";

export const authService = {
  async login( data: LoginFormData ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      data,
    );

    return response.data;
  },

  async register( data: RegisterRequest ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      ENDPOINTS.AUTH.REGISTER,
      data,
    );

    return response.data;
  },

  async logout(): Promise<void> {
    await api.post(ENDPOINTS.AUTH.LOGOUT);
  },

  async me(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>(ENDPOINTS.AUTH.ME);
    return response.data;
  },
};