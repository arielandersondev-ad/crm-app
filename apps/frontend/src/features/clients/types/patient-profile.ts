export interface PatientProfile {
  id: string;
  clientId: string;
  antecedentes: string | null;
  alergias: string | null;
  observaciones: string | null;
  contactoEmergencia: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientProfileDto {
  clientId: string;
  antecedentes?: string;
  alergias?: string;
  observaciones?: string;
  contactoEmergencia?: string;
}

export interface UpdatePatientProfileDto {
  antecedentes?: string;
  alergias?: string;
  observaciones?: string;
  contactoEmergencia?: string;
}
