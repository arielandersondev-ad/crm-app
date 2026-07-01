export interface Faq {
  id: string;
  tenantId: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqDto {
  question: string;
  answer: string;
  category?: string;
}

export interface UpdateFaqDto {
  question?: string;
  answer?: string;
  category?: string;
  isActive?: boolean;
}

export interface BotConfig {
  id: string;
  tenantId: string;
  botName: string;
  welcomeMessage: string;
  disclaimer: string;
  fallbackMessage: string;
  similarityThreshold: number;
  mode: string;
  modelProvider: string;
  maxTokens: number;
  temperature: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBotConfigDto {
  botName?: string;
  welcomeMessage?: string;
  disclaimer?: string;
  fallbackMessage?: string;
  similarityThreshold?: number;
  mode?: string;
  modelProvider?: string;
  maxTokens?: number;
  temperature?: number;
  isActive?: boolean;
}
