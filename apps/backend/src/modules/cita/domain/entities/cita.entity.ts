import { AppointmentStatus } from "@prisma/client";

export class CitaEntity {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly sucursalId: string,
    public readonly clientId: string,
    public readonly userId: string | null,
    public readonly scheduledAt: Date,
    public readonly status: AppointmentStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ){}
}