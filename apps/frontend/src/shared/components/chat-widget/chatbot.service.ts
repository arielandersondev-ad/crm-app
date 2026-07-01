import { api } from "@/infrastructure/api/axios";

export interface ChatbotQueryResponse {
  answer: string;
  source: "FAQ" | "AI" | "Fallback";
  confidence: number;
}

class ChatbotService {
  async query(question: string): Promise<ChatbotQueryResponse> {
    const res = await api.post<ChatbotQueryResponse>("/chatbot/query", { question });
    return res.data;
  }

  async publicQuery(question: string, tenantSlug: string): Promise<ChatbotQueryResponse> {
    const res = await api.post<ChatbotQueryResponse>("/chatbot/public/query", {
      question,
      tenantSlug,
    });
    return res.data;
  }
}

export const chatbotService = new ChatbotService();
