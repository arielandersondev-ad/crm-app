export class PatientProfile {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly antecedentes: string | null,
    public readonly alergias: string | null,
    public readonly observaciones: string | null,
    public readonly contactoEmergencia: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
