import type { FaqSuggestion } from "../types/faq";

const GENERIC_SUGGESTIONS_ERROR =
  "No fue posible generar sugerencias válidas. Intenta nuevamente más tarde.";

export const FAQ_SUGGESTIONS_REQUEST_TIMEOUT_MS = 60_000;

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
  if (!error || typeof error !== "object") {
    return GENERIC_SUGGESTIONS_ERROR;
  }

  const response = "response" in error ? error.response : undefined;
  if (!response || typeof response !== "object" || !("data" in response)) {
    return GENERIC_SUGGESTIONS_ERROR;
  }

  const data = response.data;
  if (!data || typeof data !== "object" || !("message" in data)) {
    return GENERIC_SUGGESTIONS_ERROR;
  }

  const message = data.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (Array.isArray(message)) {
    const firstMessage = message.find(
      (item): item is string => typeof item === "string" && Boolean(item.trim()),
    );
    if (firstMessage) return firstMessage;
  }

  return GENERIC_SUGGESTIONS_ERROR;
}
