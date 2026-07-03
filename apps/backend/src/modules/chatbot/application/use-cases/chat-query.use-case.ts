import { Injectable, Inject } from "@nestjs/common";
import { FaqRepository } from "../../domain/repositories/faq.repository";
import { BotConfigRepository } from "../../domain/repositories/bot-config.repository";
import { ChatLogRepository } from "../../domain/repositories/chat-log.repository";
import { AIProvider } from "../../domain/interfaces/ai-provider.interface";
import { EmbeddingService } from "../../infrastructure/nlp/embedding.service";
import { AppointmentStatusHandler } from "../handlers/appointment-status.handler";
import { ScheduleHandler } from "../handlers/schedule.handler";
import { GeneralConfigurationRepository } from "../../../general-configuration/domain/repositories/general-configuration.repository";
import { TenantRepository } from "../../../tenant/domain/repositories/tenant.repository";
import type { ChatResponse } from "../../domain/interfaces/chatbot.interface";

@Injectable()
export class ChatQueryUseCase {
  constructor(
    private readonly faqRepo: FaqRepository,
    private readonly botConfigRepo: BotConfigRepository,
    private readonly chatLogRepo: ChatLogRepository,
    private readonly embeddingService: EmbeddingService,
    private readonly appointmentStatusHandler: AppointmentStatusHandler,
    private readonly scheduleHandler: ScheduleHandler,
    private readonly generalConfigRepo: GeneralConfigurationRepository,
    private readonly tenantRepo: TenantRepository,
    @Inject("AI_PROVIDER") private readonly aiProvider: AIProvider,
  ) {}

  async execute(question: string, tenantId: string, userId?: string): Promise<ChatResponse> {
    const start = Date.now();

    // 1. Handler de estado de cita (código APT + CI)
    const appointmentResult = await this.appointmentStatusHandler.tryHandle(question, tenantId);
    if (appointmentResult) {
      await this.chatLogRepo.create({
        tenantId, userId, question,
        answer: appointmentResult.answer,
        source: appointmentResult.source,
        intent: "appointment-status",
        confidence: appointmentResult.confidence,
        responseTime: Date.now() - start,
        usedAI: false,
      });
      return appointmentResult;
    }

    // 2. Handler de horarios
    const scheduleResult = await this.scheduleHandler.tryHandle(question, tenantId);
    if (scheduleResult) {
      await this.chatLogRepo.create({
        tenantId, userId, question,
        answer: scheduleResult.answer,
        source: scheduleResult.source,
        intent: "schedule",
        confidence: scheduleResult.confidence,
        responseTime: Date.now() - start,
        usedAI: false,
      });
      return scheduleResult;
    }

    // 3. Cargar configuraciones
    const [config, generalConfig, tenant] = await Promise.all([
      this.botConfigRepo.findByTenant(tenantId),
      this.generalConfigRepo.findByTenantId(tenantId),
      this.tenantRepo.findOne(tenantId),
    ]);

    const disclaimer = generalConfig?.disclaimer ?? config?.disclaimer ?? "";
    const fallbackMessage = generalConfig?.fallbackMessage ?? config?.fallbackMessage ?? "No encontré una respuesta exacta. Comuníquese con recepción.";

    // 4. Flujo FAQ/AI
    const queryEmbedding = await this.embeddingService.generate(question);
    const topFAQs = await this.faqRepo.findTopSimilar(tenantId, queryEmbedding, 5);

    let answer: string;
    let source: "FAQ" | "AI" | "Fallback";
    let modelName: string | undefined;

    if (topFAQs.length > 0 && topFAQs[0].score >= (config?.similarityThreshold ?? 0.55)) {
      answer = `${disclaimer}\n\n${topFAQs[0].faq.answer}`;
      source = "FAQ";
    } else if (config?.mode === "FAQ_PLUS_AI") {
      try {
        const context = topFAQs.map((f) => `Q: ${f.faq.question}\nA: ${f.faq.answer}`).join("\n\n");
        const aiAnswer = await this.aiProvider.generate(question, context || "No hay información disponible.");
        answer = `${disclaimer}\n\n${aiAnswer}`;
        source = "AI";
        modelName = config.modelProvider;
      } catch {
        answer = this.buildFallbackWithContact(fallbackMessage, tenant);
        source = "Fallback";
      }
    } else {
      answer = this.buildFallbackWithContact(fallbackMessage, tenant);
      source = "Fallback";
    }

    await this.chatLogRepo.create({
      tenantId, userId, question, answer, source,
      intent: source.toLowerCase(),
      confidence: topFAQs[0]?.score ?? 0,
      responseTime: Date.now() - start,
      modelName,
      usedAI: source === "AI",
    });

    return { answer, source, confidence: topFAQs[0]?.score ?? 0 };
  }

  private buildFallbackWithContact(fallback: string, tenant: any): string {
    const contactParts: string[] = [];
    if (tenant?.phone) contactParts.push(`📞 ${tenant.phone}`);
    if (tenant?.whatsapp) contactParts.push(`💬 ${tenant.whatsapp}`);
    if (tenant?.email) contactParts.push(`✉️ ${tenant.email}`);
    if (contactParts.length > 0) {
      return `${fallback}\n\nPuede contactarnos a través de:\n${contactParts.join("\n")}`;
    }
    return fallback;
  }
}
