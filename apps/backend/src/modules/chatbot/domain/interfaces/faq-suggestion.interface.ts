export const FAQ_SUGGESTION_CATEGORIES = [
  'GENERAL',
  'HORARIOS',
  'SERVICIOS',
  'PRECIOS',
  'CONTACTO',
  'EMERGENCIAS',
  'CITAS',
] as const;

export type FaqSuggestionCategory = (typeof FAQ_SUGGESTION_CATEGORIES)[number];

export interface FaqSuggestion {
  group: number;
  sourceQuestionIndexes: number[];
  question: string;
  category: FaqSuggestionCategory;
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

export interface GenerateFaqSuggestionsResponse {
  periodHours: 48;
  totalLogs: number;
  questionsFound: number;
  questionsAnalyzed: number;
  truncated: boolean;
  groupsDetected: number;
  excludedSummary: FaqSuggestionExcludedSummary;
  suggestions: FaqSuggestion[];
  message?: string;
}
