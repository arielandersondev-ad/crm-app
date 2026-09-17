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

export const FAQ_EXCLUSION_REASONS = [
  'GREETING',
  'NOISE',
  'OUT_OF_SCOPE',
  'CLINICAL',
  'SENSITIVE',
  'APPOINTMENT_TRANSACTION',
  'PROMPT_INJECTION',
  'RESOLVED_HIGH_CONFIDENCE',
  'EMPTY_OR_INVALID',
] as const;

export type FaqExclusionReason = (typeof FAQ_EXCLUSION_REASONS)[number];

export interface FaqExcludedGroup {
  reason: FaqExclusionReason;
  representativeQuestion: string;
  count: number;
}

export interface FaqConsolidatedQuestion {
  question: string;
  occurrences: number;
}

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
