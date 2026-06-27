import { Injectable } from "@nestjs/common";
import { RefractionRepository } from "../../domain/repository/refraction.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { RefractionEntity } from "../../domain/entities/refraction.entity";

@Injectable()
export class PrismaRefractionRepository implements RefractionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(item: any): RefractionEntity {
    return new RefractionEntity(
      item.id,
      item.consultationId,
      item.odLejosEsf ? Number(item.odLejosEsf) : null,
      item.odLejosCil ? Number(item.odLejosCil) : null,
      item.odLejosEje ?? null,
      item.odLejosAv ?? null,
      item.oiLejosEsf ? Number(item.oiLejosEsf) : null,
      item.oiLejosCil ? Number(item.oiLejosCil) : null,
      item.oiLejosEje ?? null,
      item.oiLejosAv ?? null,
      item.lejosDip ? Number(item.lejosDip) : null,
      item.odCercaEsf ? Number(item.odCercaEsf) : null,
      item.odCercaCil ? Number(item.odCercaCil) : null,
      item.odCercaEje ?? null,
      item.odCercaAv ?? null,
      item.oiCercaEsf ? Number(item.oiCercaEsf) : null,
      item.oiCercaCil ? Number(item.oiCercaCil) : null,
      item.oiCercaEje ?? null,
      item.oiCercaAv ?? null,
      item.cercaDip ? Number(item.cercaDip) : null,
      item.add ? Number(item.add) : null,
      item.createdAt,
      item.updatedAt,
    );
  }

  async findByConsultationId(consultationId: string): Promise<RefractionEntity | null> {
    const result = await this.prisma.refraction.findUnique({
      where: { consultationId },
    });
    if (!result) return null;
    return this.toEntity(result);
  }

  async upsert(consultationId: string, data: Record<string, any>): Promise<RefractionEntity> {
    const result = await this.prisma.refraction.upsert({
      where: { consultationId },
      create: { consultationId, ...data },
      update: data,
    });
    return this.toEntity(result);
  }
}
