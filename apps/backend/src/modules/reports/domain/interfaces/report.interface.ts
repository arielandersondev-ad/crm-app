export interface ConsultationReport {
  id: string;
  clientId: string;
  clientFullName: string;
  clientDocId?: string;
  doctorId: string;
  doctorName: string;
  consultationDate: Date;
  status: string;
  motivo: string;
  diagnostico?: string;
  nextControlAt?: Date;
}

export interface DoctorStatistic {
  doctorId: string;
  doctorName: string;
  totalConsultations: number;
  uniquePatients: number;
  completedConsultations: number;
  cancelledConsultations: number;
  upcomingControls: number;
}

export interface UpcomingControl {
  clientId: string;
  clientFullName: string;
  clientPhone?: string;
  doctorName: string;
  nextControlAt: Date;
  lastConsultationDate: Date;
  motivo: string;
}

export interface ClinicalSummaryData {
  patientName: string;
  patientDocId?: string;
  patientAge?: number;
  consultationDate: Date;
  doctorName: string;
  motivo: string;
  diagnostico?: string;
  observaciones?: string;
  nextControlAt?: Date;
  refraction?: {
    odLejosEsf?: number;
    odLejosCil?: number;
    odLejosEje?: number;
    odLejosAv?: number;
    oiLejosEsf?: number;
    oiLejosCil?: number;
    oiLejosEje?: number;
    oiLejosAv?: number;
    lejosDip?: number;
    odCercaEsf?: number;
    odCercaCil?: number;
    odCercaEje?: number;
    odCercaAv?: number;
    oiCercaEsf?: number;
    oiCercaCil?: number;
    oiCercaEje?: number;
    oiCercaAv?: number;
    cercaDip?: number;
    add?: number;
  };
}
