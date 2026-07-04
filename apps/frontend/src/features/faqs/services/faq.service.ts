import { api } from "@/infrastructure/api/axios";
import { ENDPOINTS } from "../api/endpoints";
import { BotConfig, CreateFaqDto, Faq, UpdateBotConfigDto, UpdateFaqDto } from "../types/faq";

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
}

export const faqService = new FaqService();
