import { api } from "@/infrastructure/api/axios";
import type { Consultation, CreateConsultationDto, UpdateConsultationDto, UpsertRefractionDto } from "../types/consultation";
import { ENDPOINTS } from "../api/endpoints";

class ConsultationService {
  async create(dto: CreateConsultationDto): Promise<Consultation> {
    const response = await api.post(ENDPOINTS.CREATE, dto);
    return response.data;
  }

  async update(id: string, dto: UpdateConsultationDto): Promise<Consultation> {
    const response = await api.patch(ENDPOINTS.UPDATE.replace(":id", id), dto);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(ENDPOINTS.DELETE.replace(":id", id));
  }

  async findById(id: string): Promise<Consultation> {
    const response = await api.get(ENDPOINTS.GET_BY_ID.replace(":id", id));
    return response.data;
  }

  async findByClientId(clientId: string): Promise<Consultation[]> {
    const response = await api.get(ENDPOINTS.GET_BY_CLIENT.replace(":clientId", clientId));
    return response.data;
  }

  async upsertRefraction(consultationId: string, dto: UpsertRefractionDto): Promise<any> {
    const response = await api.patch(ENDPOINTS.UPSERT_REFRACTION.replace(":id", consultationId), dto);
    return response.data;
  }

  async startFromAppointment(appointmentId: string): Promise<Consultation> {
    const response = await api.post(ENDPOINTS.START_FROM_APPOINTMENT.replace(":appointmentId", appointmentId));
    return response.data;
  }
}

export const consultationService = new ConsultationService();
