import { api } from "@/infrastructure/api/axios";
import { ENDPOINTS } from "../api/endpoints";
import {
  BotConfig,
  CreateFaqDto,
  Faq,
  FaqSuggestionsResponse,
  GenerateFaqSuggestionsDto,
  UpdateBotConfigDto,
  UpdateFaqDto,
} from "../types/faq";
import {
  FAQ_SUGGESTIONS_REQUEST_TIMEOUT_MS,
  FAQ_SUGGESTIONS_RETRY_TIMEOUT_MS,
} from "../utils/faq-suggestions";

class FaqService {
  async list(): Promise<Faq[]> {
    const res = await api.get<Faq[]>(ENDPOINTS.GET.LIST);
    return res.data;
  }

  async create(data: CreateFaqDto): Promise<Faq> {
    const res = await api.post<Faq>(ENDPOINTS.CREATE, data);
    return res.data;
  }

  async update(id: string, data: UpdateFaqDto): Promise<Faq> {
    const res = await api.patch<Faq>(ENDPOINTS.UPDATE.replace(":id", id), data);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(ENDPOINTS.DELETE.replace(":id", id));
  }

  async getConfig(): Promise<BotConfig | null> {
    const res = await api.get<BotConfig>(ENDPOINTS.GET.CONFIG);
    return res.data ?? null;
  }

  async updateConfig(data: UpdateBotConfigDto): Promise<BotConfig> {
    const res = await api.patch<BotConfig>(ENDPOINTS.UPDATE_CONFIG, data);
    return res.data;
  }

  async generateSuggestions(
    data: GenerateFaqSuggestionsDto,
  ): Promise<FaqSuggestionsResponse> {
    const res = await api.post<FaqSuggestionsResponse>(
      ENDPOINTS.GENERATE_SUGGESTIONS,
      data,
      {
        timeout: data.retry
          ? FAQ_SUGGESTIONS_RETRY_TIMEOUT_MS
          : FAQ_SUGGESTIONS_REQUEST_TIMEOUT_MS,
      },
    );
    return res.data;
  }
}

export const faqService = new FaqService();
