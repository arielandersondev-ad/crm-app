import { Injectable } from "@nestjs/common";
import { GeneralConfigurationRepository } from "../../domain/repositories/general-configuration.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { GeneralConfiguration } from "../../domain/entities/general-configuration.entity";

@Injectable()
export class PrismaGeneralConfigurationRepository implements GeneralConfigurationRepository {
  constructor(private prisma: PrismaService) {}

  async findByTenantId(tenantId: string): Promise<GeneralConfiguration | null> {
    const config = await this.prisma.generalConfiguration.findUnique({
      where: { tenantId },
    });
    if (!config) return null;
    return this.toEntity(config);
  }

  async upsert(tenantId: string, data: Partial<GeneralConfiguration>): Promise<GeneralConfiguration> {
    const config = await this.prisma.generalConfiguration.upsert({
      where: { tenantId },
      update: {
        botName: data.botName,
        welcomeMessage: data.welcomeMessage,
        fallbackMessage: data.fallbackMessage,
        disclaimer: data.disclaimer,
      },
      create: {
        tenantId,
        botName: data.botName ?? "Asistente Virtual",
        welcomeMessage: data.welcomeMessage ?? "¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte?",
        fallbackMessage: data.fallbackMessage ?? "No encontré una respuesta exacta. Por favor, contáctanos al teléfono o correo de la clínica.",
        disclaimer: data.disclaimer ?? "⚠️ Este asistente no realiza diagnósticos médicos ni reemplaza la consulta con un profesional de la salud.",
      },
    });
    return this.toEntity(config);
  }

  private toEntity(config: any): GeneralConfiguration {
    return new GeneralConfiguration(
      config.id,
      config.tenantId,
      config.botName,
      config.welcomeMessage,
      config.fallbackMessage,
      config.disclaimer,
    );
  }
}
