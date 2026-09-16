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

export interface GenerateFaqSuggestionsDto {
  useQwen: boolean;
}

export interface FaqSuggestion {
  group: number;
  sourceQuestionIndexes: number[];
  question: string;
  category: string;
  suggestedAnswer: string | null;
  reason: string;
  needsHumanAnswer: boolean;
  evidenceCount: number;
}

export interface FaqSuggestionExcludedSummary {
  totalExcluded: number;
  repeatedQuestions: number;
  repeatedGroups: number;
  byReason: {
    resolvedOrHighConfidence: number;
    prohibitedOrSensitive: number;
    emptyOrInvalid: number;
    other: number;
  };
  byCategory: Record<string, number>;
}

export interface FaqSuggestionsResponse {
  periodHours: number;
  totalLogs?: number;
  questionsFound: number;
  questionsAnalyzed: number;
  truncated: boolean;
  groupsDetected: number;
  excludedSummary?: FaqSuggestionExcludedSummary;
  suggestions: FaqSuggestion[];
  message?: string;
}
