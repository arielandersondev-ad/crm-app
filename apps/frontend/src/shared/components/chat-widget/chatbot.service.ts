import { api } from "@/infrastructure/api/axios";

export interface ChatbotQueryResponse {
  answer: string;
  source: "FAQ" | "AI" | "Fallback";
  confidence: number;
}

export interface ContactInfo {
  question: string;
  answer: string;
}

export interface PublicConfig {
  botName: string;
  welcomeMessage: string;
  disclaimer: string;
  contact: {
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
  } | null;
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

  async getContact(tenantSlug: string): Promise<{ contact: ContactInfo | null }> {
    const res = await api.get<{ contact: ContactInfo | null }>(
      `/chatbot/public/contact/${tenantSlug}`,
    );
    return res.data;
  }

  async getPublicConfig(tenantSlug: string): Promise<PublicConfig> {
    const res = await api.get<PublicConfig>(`/chatbot/public/config/${tenantSlug}`);
    return res.data;
  }
}

export const chatbotService = new ChatbotService();
