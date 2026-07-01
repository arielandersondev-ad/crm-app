export enum ConsultationStatus {
  DRAFT = "DRAFT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export class ConsultationEntity {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly clientId: string,
    public readonly userId: string,
    public readonly visitId: string | null,
    public readonly appointmentId: string | null,
    public readonly consultationDate: Date,
    public readonly status: ConsultationStatus,
    public readonly motivo: string,
    public readonly diagnostico: string | null,
    public readonly observaciones: string | null,
    public readonly nextControlAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly refraction: Record<string, any> | null = null,
  ) {}
}
