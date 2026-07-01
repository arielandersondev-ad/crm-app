import { Injectable } from "@nestjs/common";
import { PatientProfileRepository } from "../../domain/repository/patient-profile.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { PatientProfile } from "../../domain/entities/patient-profile.entity";

@Injectable()
export class PrismaPatientProfileRepository implements PatientProfileRepository {
  constructor(private prisma: PrismaService) {}

  private toEntity(item: any): PatientProfile {
    return new PatientProfile(
      item.id,
      item.clientId,
      item.antecedentes ?? null,
      item.alergias ?? null,
      item.observaciones ?? null,
      item.contactoEmergencia ?? null,
      item.createdAt,
      item.updatedAt,
    );
  }

  async findByClientId(clientId: string): Promise<PatientProfile | null> {
    const profile = await this.prisma.patientProfile.findUnique({
      where: { clientId },
    });
    if (!profile) return null;
    return this.toEntity(profile);
  }

  async create(
    clientId: string,
    antecedentes?: string,
    alergias?: string,
    observaciones?: string,
    contactoEmergencia?: string,
  ): Promise<PatientProfile> {
    const profile = await this.prisma.patientProfile.create({
      data: {
        clientId,
        antecedentes: antecedentes || null,
        alergias: alergias || null,
        observaciones: observaciones || null,
        contactoEmergencia: contactoEmergencia || null,
      },
    });
    return this.toEntity(profile);
  }

  async update(
    clientId: string,
    antecedentes?: string,
    alergias?: string,
    observaciones?: string,
    contactoEmergencia?: string,
  ): Promise<PatientProfile> {
    const profile = await this.prisma.patientProfile.update({
      where: { clientId },
      data: {
        antecedentes: antecedentes ?? undefined,
        alergias: alergias ?? undefined,
        observaciones: observaciones ?? undefined,
        contactoEmergencia: contactoEmergencia ?? undefined,
      },
    });
    return this.toEntity(profile);
  }
}
