import { api } from "@/infrastructure/api/axios";
import { ENDPOINTS } from "../api/endpoints";
import { CitaType, CreateCitaDto, UpdateCitaDto } from "../types/cita.dto";
import { AgendaResponse } from "../types/interfaces";

export class AgendaService {
  async createAgenda(data: CreateCitaDto): Promise<CitaType>{
    const response = await api.post<CitaType>(ENDPOINTS.CREATE,data)
    return response.data
  }
  async getAgenda():Promise<AgendaResponse>{
    const response = await api.get(ENDPOINTS.GET.GET_AGENDA)
    return response.data
  }
  async updateCita(id: string, dto: UpdateCitaDto): Promise<CitaType>{
    const response = await api.patch<CitaType>(ENDPOINTS.UPDATE.replace(':id', id), dto)
    return response.data
  }
}


export const agendaService = new AgendaService();