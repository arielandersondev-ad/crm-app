import { Injectable, NotFoundException } from "@nestjs/common";
import { PatientProfileRepository } from "../../domain/repository/patient-profile.repository";
import { PatientProfile } from "../../domain/entities/patient-profile.entity";
import { UpdatePatientProfileDto } from "../../presentation/dto/update-patient-profile.dto";

@Injectable()
export class UpdatePatientProfileUseCase {
  constructor(private readonly repo: PatientProfileRepository) {}

  async execute(clientId: string, dto: UpdatePatientProfileDto): Promise<PatientProfile> {
    const existing = await this.repo.findByClientId(clientId);
    if (!existing) {
      throw new NotFoundException("Perfil clínico no encontrado para este paciente");
    }

    return this.repo.update(
      clientId,
      dto.antecedentes,
      dto.alergias,
      dto.observaciones,
      dto.contactoEmergencia,
    );
  }
}
