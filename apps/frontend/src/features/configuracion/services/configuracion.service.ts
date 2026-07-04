import { api } from "@/infrastructure/api/axios";
import { ENDPOINTS } from "../api/endpoints";

export interface TenantCompany {
  id: string;
  name: string;
  slug: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  timezone: string;
}

export interface GeneralConfig {
  id: string;
  tenantId: string;
  botName: string;
  welcomeMessage: string;
  fallbackMessage: string;
  disclaimer: string;
}

export interface SucursalBranch {
  id: string;
  tenantId: string;
  name: string;
  direccion: string | null;
  latitude: number;
  longitude: number;
  telefono: string | null;
  correo: string | null;
  isDefault: boolean;
  timezone: string;
  avgConsultationMinutes: number;
  intervalBetweenAppointments: number;
  autoNoShowMinutes: number;
}

export interface BranchSchedule {
  id: string;
  sucursalId: string;
  dayOfWeek: string;
  openTime: string | null;
  closeTime: string | null;
  isOpen: boolean;
}

export const configuracionService = {
  async getTenant(): Promise<TenantCompany> {
    const res = await api.get(ENDPOINTS.GET_TENANT);
    return res.data;
  },

  async updateTenant(id: string, data: Partial<TenantCompany>): Promise<TenantCompany> {
    const res = await api.patch(ENDPOINTS.UPDATE_TENANT, { id, ...data });
    return res.data;
  },

  async getConfiguration(): Promise<GeneralConfig | null> {
    const res = await api.get(ENDPOINTS.GET_CONFIGURATION);
    return res.data;
  },

  async updateConfiguration(data: Partial<GeneralConfig>): Promise<GeneralConfig> {
    const res = await api.put(ENDPOINTS.UPDATE_CONFIGURATION, data);
    return res.data;
  },

  async getSucursales(): Promise<SucursalBranch[]> {
    const res = await api.get(ENDPOINTS.GET_SUCURSALES);
    return res.data;
  },

  async getSchedules(sucursalId: string): Promise<BranchSchedule[]> {
    const res = await api.get(ENDPOINTS.GET_SCHEDULES(sucursalId));
    return res.data;
  },

  async updateSchedules(sucursalId: string, schedules: { dayOfWeek: string; openTime?: string | null; closeTime?: string | null; isOpen?: boolean }[]): Promise<BranchSchedule[]> {
    const res = await api.put(ENDPOINTS.UPDATE_SCHEDULES(sucursalId), { schedules });
    return res.data;
  },
};
