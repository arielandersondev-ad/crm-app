import type {
  FaqSuggestion,
  FaqSuggestionsErrorData,
} from "../types/faq";

const GENERIC_SUGGESTIONS_ERROR =
  "No fue posible generar sugerencias válidas. Intenta nuevamente más tarde.";

export const FAQ_SUGGESTIONS_REQUEST_TIMEOUT_MS = 130_000;
export const FAQ_SUGGESTIONS_RETRY_TIMEOUT_MS = 250_000;

export function canAccessFaqSuggestions(role?: string | null): boolean {
  return role === "OWNER";
}

export function buildCompleteFaqText(
  suggestion: Pick<FaqSuggestion, "question" | "suggestedAnswer">,
): string {
  const answer =
    suggestion.suggestedAnswer?.trim() || "[Pendiente de respuesta humana]";

  return `Pregunta: ${suggestion.question}\n\nRespuesta: ${answer}`;
}

export function getFaqSuggestionsErrorMessage(error: unknown): string {
  const message = getFaqSuggestionsErrorData(error)?.message;
  if (typeof message === "string" && message.trim()) return message;
  if (Array.isArray(message)) {
    const firstMessage = message.find(
      (item): item is string => typeof item === "string" && Boolean(item.trim()),
    );
    if (firstMessage) return firstMessage;
  }
  return GENERIC_SUGGESTIONS_ERROR;
}

export function getFaqSuggestionsErrorData(
  error: unknown,
): FaqSuggestionsErrorData | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const response = "response" in error ? error.response : undefined;
  if (!response || typeof response !== "object" || !("data" in response)) {
    return null;
  }

  const data = response.data;
  if (!data || typeof data !== "object") {
    return null;
  }
  return data as FaqSuggestionsErrorData;
}
