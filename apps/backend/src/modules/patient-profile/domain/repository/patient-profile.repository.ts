import { PatientProfile } from "../entities/patient-profile.entity";

export abstract class PatientProfileRepository {
  abstract findByClientId(clientId: string): Promise<PatientProfile | null>;
  abstract create(
    clientId: string,
    antecedentes?: string,
    alergias?: string,
    observaciones?: string,
    contactoEmergencia?: string,
  ): Promise<PatientProfile>;
  abstract update(
    clientId: string,
    antecedentes?: string,
    alergias?: string,
    observaciones?: string,
    contactoEmergencia?: string,
  ): Promise<PatientProfile>;
}
