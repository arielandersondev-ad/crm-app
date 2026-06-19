import { api } from "@/infrastructure/api/axios";
import { CreateVisitDetailDto, UpdateVisitDetailDto, Visit } from "../types/visit";
import { ENDPOINTS } from "../api/endpoints";

class VisitService {
  async getVisits(): Promise<Visit[]> {
    const response = await api.get<Visit[]>(ENDPOINTS.GET.FIND_ALL);
    return response.data;
  }
  async getVisitForm(): Promise<any[]> {
    const response = await api.get<any[]>(ENDPOINTS.GET.FIND_ALL_FOR_FORM);
    return response.data;
  }
  async createVisit(data: CreateVisitDetailDto): Promise<Visit> {
    const response = await api.post<Visit>(ENDPOINTS.CREATE, data);
    return response.data;
  }
  async updateVisit( data: UpdateVisitDetailDto): Promise<Visit> {
    const {id, ...rest }= data;
    const response = await api.patch<Visit>(ENDPOINTS.UPDATE.replace(":id", id), rest);
    return response.data;
  }
}
export const visitService = new VisitService();