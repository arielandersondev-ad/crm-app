import { Injectable } from "@nestjs/common";
import { PatientProfileRepository } from "../../domain/repository/patient-profile.repository";
import { PatientProfile } from "../../domain/entities/patient-profile.entity";

@Injectable()
export class FindByClientIdUseCase {
  constructor(private readonly repo: PatientProfileRepository) {}

  async execute(clientId: string): Promise<PatientProfile | null> {
    return this.repo.findByClientId(clientId);
  }
}
