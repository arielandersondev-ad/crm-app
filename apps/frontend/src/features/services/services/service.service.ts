import { api } from "@/infrastructure/api/axios";
import { ENDPOINTS } from "../api/endpoints";
import { CreateServiceDto, Service, UpdateServiceDto } from "../types/service";

class ServiceService {
  async getServices(): Promise<Service[]> {
    const response = await api.get<Service[]>(ENDPOINTS.GET.FIND_ALL_ACTIVE);
    return response.data;
  }
  async createService(data: CreateServiceDto): Promise<Service> {
    console.log('request create service: ',data);
    const response = await api.post<Service>(ENDPOINTS.CREATE, data);
    console.log('response create service: ',response.data);
    return response.data;
  }
  async updateService(data: UpdateServiceDto): Promise<Service> {
    const response = await api.patch<Service>(ENDPOINTS.UPDATE, data);
    return response.data;
  }
  async softDeleteService(id: string): Promise<void> {
    await api.patch(ENDPOINTS.REMOVE.replace(":id", id));
  }
}

export const serviceService = new ServiceService();