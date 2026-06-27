import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PatientProfileRepository } from "../../domain/repository/patient-profile.repository";
import { PatientProfile } from "../../domain/entities/patient-profile.entity";
import { CreatePatientProfileDto } from "../../presentation/dto/create-patient-profile.dto";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";

@Injectable()
export class CreatePatientProfileUseCase {
  constructor(
    private readonly repo: PatientProfileRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: CreatePatientProfileDto): Promise<PatientProfile> {
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
    });
    if (!client) {
      throw new NotFoundException("Cliente no encontrado");
    }

    const existing = await this.repo.findByClientId(dto.clientId);
    if (existing) {
      throw new ConflictException("El paciente ya tiene un perfil clínico");
    }

    return this.repo.create(
      dto.clientId,
      dto.antecedentes,
      dto.alergias,
      dto.observaciones,
      dto.contactoEmergencia,
    );
  }
}
