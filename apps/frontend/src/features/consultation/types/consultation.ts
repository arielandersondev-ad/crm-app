export type ConsultationStatus = "DRAFT" | "COMPLETED" | "CANCELLED";

export interface RefractionData {
  odLejosEsf: number | null;
  odLejosCil: number | null;
  odLejosEje: number | null;
  odLejosAv: string | null;
  oiLejosEsf: number | null;
  oiLejosCil: number | null;
  oiLejosEje: number | null;
  oiLejosAv: string | null;
  lejosDip: number | null;
  odCercaEsf: number | null;
  odCercaCil: number | null;
  odCercaEje: number | null;
  odCercaAv: string | null;
  oiCercaEsf: number | null;
  oiCercaCil: number | null;
  oiCercaEje: number | null;
  oiCercaAv: string | null;
  cercaDip: number | null;
  add: number | null;
}

export interface Consultation {
  id: string;
  tenantId: string;
  clientId: string;
  userId: string;
  visitId: string | null;
  appointmentId: string | null;
  consultationDate: string;
  status: ConsultationStatus;
  motivo: string;
  diagnostico: string | null;
  observaciones: string | null;
  nextControlAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; firstName: string; lastName: string };
  refraction?: RefractionData | null;
}

export interface CreateConsultationDto {
  clientId: string;
  visitId?: string;
  appointmentId?: string;
  consultationDate?: string;
  motivo: string;
  diagnostico?: string;
  observaciones?: string;
  nextControlAt?: string;
}

export interface UpdateConsultationDto {
  motivo?: string;
  diagnostico?: string;
  observaciones?: string;
  nextControlAt?: string;
  consultationDate?: string;
  status?: ConsultationStatus;
}

export interface UpsertRefractionDto {
  consultationId: string;
  odLejosEsf?: number | null;
  odLejosCil?: number | null;
  odLejosEje?: number | null;
  odLejosAv?: string | null;
  oiLejosEsf?: number | null;
  oiLejosCil?: number | null;
  oiLejosEje?: number | null;
  oiLejosAv?: string | null;
  lejosDip?: number | null;
  odCercaEsf?: number | null;
  odCercaCil?: number | null;
  odCercaEje?: number | null;
  odCercaAv?: string | null;
  oiCercaEsf?: number | null;
  oiCercaCil?: number | null;
  oiCercaEje?: number | null;
  oiCercaAv?: string | null;
  cercaDip?: number | null;
  add?: number | null;
}
