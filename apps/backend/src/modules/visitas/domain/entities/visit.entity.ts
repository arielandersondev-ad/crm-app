export class VisitEntity {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly sucursalId: string,
    public readonly clientId: string,
    public readonly userId: string,
    public readonly appointmentId: string,
    public readonly status: string,
    public readonly notes: string,
    public readonly startedAt: string,
    public readonly completedAt: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}