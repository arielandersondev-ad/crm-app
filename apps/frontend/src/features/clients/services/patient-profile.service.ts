import { api } from "@/infrastructure/api/axios";
import type { PatientProfile, CreatePatientProfileDto, UpdatePatientProfileDto } from "../types/patient-profile";

const BASE_URL = "/patient-profile";

class PatientProfileService {
  async findByClientId(clientId: string): Promise<PatientProfile | null> {
    const response = await api.get<PatientProfile>(`${BASE_URL}/${clientId}`);
    return response.data;
  }

  async create(dto: CreatePatientProfileDto): Promise<PatientProfile> {
    const response = await api.post<PatientProfile>(BASE_URL, dto);
    return response.data;
  }

  async update(clientId: string, dto: UpdatePatientProfileDto): Promise<PatientProfile> {
    const response = await api.patch<PatientProfile>(`${BASE_URL}/${clientId}`, dto);
    return response.data;
  }
}

export const patientProfileService = new PatientProfileService();
