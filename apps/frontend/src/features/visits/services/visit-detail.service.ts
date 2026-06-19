import { api } from "@/infrastructure/api/axios";
import { VisitDetail, UpdateVisitDetailDto, CreateVisitDetailDto, CreateManyVisitDetailDto } from "../types/visit";
import { ENDPOINTS } from "../api/endpoints";

class VisitDetailService {
  async getDetailsVisit(visitId: string): Promise<VisitDetail[]> {
    const response = await api.get<VisitDetail[]>(ENDPOINTS.GET.FIND_ALL_DETAIL_BY_VISIT_ID.replace(":id", visitId));
    return response.data;
  }
  async updateVisitDetail(data: UpdateVisitDetailDto): Promise<VisitDetail> {
    const {id, ...rest }= data;
    const response = await api.patch<VisitDetail>(ENDPOINTS.VISIT_DETAIL.UPDATE.replace(":id", id), rest);
    return response.data;
  }
  
  async createVisitDetail(data: CreateVisitDetailDto): Promise<VisitDetail> {
    const response = await api.post<VisitDetail>(ENDPOINTS.VISIT_DETAIL.CREATE, data);
    return response.data;
  }
  
  async createManyVisitDetails(data: CreateManyVisitDetailDto): Promise<VisitDetail[]> {
    const response = await api.post<VisitDetail[]>(ENDPOINTS.VISIT_DETAIL.BULK_CREATE, data);
    return response.data;
  }
  
  async deleteVisitDetail(id: string): Promise<VisitDetail> {
    const response = await api.delete<VisitDetail>(ENDPOINTS.VISIT_DETAIL.REMOVE, { data: { id } });
    return response.data;
  }
}
export const visitDetailService = new VisitDetailService();