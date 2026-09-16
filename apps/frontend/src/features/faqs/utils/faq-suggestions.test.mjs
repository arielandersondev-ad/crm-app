import assert from "node:assert/strict";
import test from "node:test";

import {
  FAQ_SUGGESTIONS_REQUEST_TIMEOUT_MS,
  buildCompleteFaqText,
  canAccessFaqSuggestions,
  getFaqSuggestionsErrorMessage,
} from "./faq-suggestions.ts";

test("permite que el backend complete Qwen antes del timeout del navegador", () => {
  assert.equal(FAQ_SUGGESTIONS_REQUEST_TIMEOUT_MS, 60_000);
  assert.ok(FAQ_SUGGESTIONS_REQUEST_TIMEOUT_MS > 10_000);
});

test("las sugerencias solo son visibles para OWNER", () => {
  assert.equal(canAccessFaqSuggestions("OWNER"), true);
  assert.equal(canAccessFaqSuggestions("ADMIN"), false);
  assert.equal(canAccessFaqSuggestions("MANAGER"), false);
  assert.equal(canAccessFaqSuggestions("EMPLOYEE"), false);
  assert.equal(canAccessFaqSuggestions(undefined), false);
});

test("construye una FAQ completa sin inventar una respuesta", () => {
  assert.equal(
    buildCompleteFaqText({
      question: "¿Atienden los domingos?",
      suggestedAnswer: null,
    }),
    "Pregunta: ¿Atienden los domingos?\n\nRespuesta: [Pendiente de respuesta humana]",
  );
});

test("construye una FAQ completa con la respuesta sugerida", () => {
  assert.equal(
    buildCompleteFaqText({
      question: "¿Qué métodos de pago aceptan?",
      suggestedAnswer: "Aceptamos pagos con tarjeta.",
    }),
    "Pregunta: ¿Qué métodos de pago aceptan?\n\nRespuesta: Aceptamos pagos con tarjeta.",
  );
});

test("prioriza el mensaje de error devuelto por el endpoint", () => {
  assert.equal(
    getFaqSuggestionsErrorMessage({
      response: { data: { message: "Qwen no está disponible." } },
    }),
    "Qwen no está disponible.",
  );
});

test("usa un mensaje seguro cuando el error no tiene detalle", () => {
  assert.equal(
    getFaqSuggestionsErrorMessage(new Error("network")),
    "No fue posible generar sugerencias válidas. Intenta nuevamente más tarde.",
  );
});
