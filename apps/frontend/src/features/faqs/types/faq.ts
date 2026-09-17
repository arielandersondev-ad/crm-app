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
  snapshotAt?: string;
  offset?: number;
  retry?: boolean;
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

export type FaqExclusionReason =
  | "GREETING"
  | "NOISE"
  | "OUT_OF_SCOPE"
  | "CLINICAL"
  | "SENSITIVE"
  | "APPOINTMENT_TRANSACTION"
  | "PROMPT_INJECTION"
  | "RESOLVED_HIGH_CONFIDENCE"
  | "EMPTY_OR_INVALID";

export interface FaqExcludedGroup {
  reason: FaqExclusionReason;
  representativeQuestion: string;
  count: number;
}

export interface FaqConsolidatedQuestion {
  question: string;
  occurrences: number;
}

export interface FaqSuggestionsResponse {
  periodHours: number;
  totalLogs?: number;
  questionsFound: number;
  questionsAnalyzed: number;
  truncated: boolean;
  groupsDetected: number;
  excludedSummary?: FaqSuggestionExcludedSummary;
  excludedGroups: FaqExcludedGroup[];
  consolidatedQuestions: FaqConsolidatedQuestion[];
  eligibleQuestions: number;
  consolidatedDuplicates: number;
  pendingQuestions: number;
  snapshotAt: string;
  offset: number;
  nextOffset: number | null;
  hasMore: boolean;
  suggestions: FaqSuggestion[];
  message?: string;
}

export interface FaqSuggestionsErrorData {
  statusCode: number;
  code?: string;
  message?: string | string[];
  retryable?: boolean;
  retryAfterSeconds?: number;
  validationError?: string;
  providerResponse?: string;
  providerResponseTruncated?: boolean;
  analysis?: Omit<FaqSuggestionsResponse, "groupsDetected" | "suggestions">;
}
