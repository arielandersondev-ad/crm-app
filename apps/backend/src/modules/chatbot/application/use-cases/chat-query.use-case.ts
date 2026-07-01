import { Injectable, Inject } from "@nestjs/common";
import { FaqRepository } from "../../domain/repositories/faq.repository";
import { BotConfigRepository } from "../../domain/repositories/bot-config.repository";
import { ChatLogRepository } from "../../domain/repositories/chat-log.repository";
import { AIProvider } from "../../domain/interfaces/ai-provider.interface";
import { EmbeddingService } from "../../infrastructure/nlp/embedding.service";
import type { ChatResponse } from "../../domain/interfaces/chatbot.interface";

@Injectable()
export class ChatQueryUseCase {
  constructor(
    private readonly faqRepo: FaqRepository,
    private readonly botConfigRepo: BotConfigRepository,
    private readonly chatLogRepo: ChatLogRepository,
    private readonly embeddingService: EmbeddingService,
    @Inject("AI_PROVIDER") private readonly aiProvider: AIProvider,
  ) {}

  async execute(question: string, tenantId: string, userId?: string): Promise<ChatResponse> {
    const start = Date.now();
    const config = await this.botConfigRepo.findByTenant(tenantId);

    const queryEmbedding = await this.embeddingService.generate(question);
    const topFAQs = await this.faqRepo.findTopSimilar(tenantId, queryEmbedding, 5);

    let answer: string;
    let source: "FAQ" | "AI" | "Fallback";
    let modelName: string | undefined;

    if (topFAQs.length > 0 && topFAQs[0].score >= (config?.similarityThreshold ?? 0.55)) {
      answer = `${config?.disclaimer ?? ""}\n\n${topFAQs[0].faq.answer}`;
      source = "FAQ";
    } else if (config?.mode === "FAQ_PLUS_AI") {
      try {
        const context = topFAQs.map((f) => `Q: ${f.faq.question}\nA: ${f.faq.answer}`).join("\n\n");
        const aiAnswer = await this.aiProvider.generate(question, context || "No hay información disponible.");
        answer = `${config.disclaimer}\n\n${aiAnswer}`;
        source = "AI";
        modelName = config.modelProvider;
      } catch {
        answer = config?.fallbackMessage ?? "No encontré una respuesta exacta. Comuníquese con recepción.";
        source = "Fallback";
      }
    } else {
      answer = config?.fallbackMessage ?? "No encontré una respuesta exacta. Comuníquese con recepción.";
      source = "Fallback";
    }

    await this.chatLogRepo.create({
      tenantId,
      userId,
      question,
      answer,
      source,
      intent: source.toLowerCase(),
      confidence: topFAQs[0]?.score ?? 0,
      responseTime: Date.now() - start,
      modelName,
      usedAI: source === "AI",
    });

    return { answer, source, confidence: topFAQs[0]?.score ?? 0 };
  }
}
