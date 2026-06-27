import { Injectable, NotFoundException } from "@nestjs/common";
import { RefractionRepository } from "../../domain/repository/refraction.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { RefractionEntity } from "../../domain/entities/refraction.entity";
import { UpsertRefractionDto } from "../../presentation/dto/upsert-refraction.dto";

@Injectable()
export class UpsertRefractionUseCase {
  constructor(
    private readonly repo: RefractionRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(consultationId: string, tenantId: string, dto: UpsertRefractionDto): Promise<RefractionEntity> {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId, tenantId },
    });
    if (!consultation) {
      throw new NotFoundException("Consulta no encontrada");
    }

    const data: Record<string, any> = {};
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        data[key] = value;
      }
    }

    return this.repo.upsert(consultationId, data);
  }
}
