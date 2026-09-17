"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Clipboard,
  Clock3,
  Loader2,
  MessageSquareText,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/shared/components/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/utils";

import { useGenerateFaqSuggestions } from "../hooks/use-faqs";
import type {
  FaqSuggestion,
  FaqConsolidatedQuestion,
  FaqExcludedGroup,
  FaqExclusionReason,
  FaqSuggestionExcludedSummary,
  FaqSuggestionsResponse,
  GenerateFaqSuggestionsDto,
} from "../types/faq";
import {
  buildCompleteFaqText,
  getFaqSuggestionsErrorData,
  getFaqSuggestionsErrorMessage,
} from "../utils/faq-suggestions";

const QWEN_DISABLED_MESSAGE =
  "La generación con Qwen está desactivada. Actívala únicamente si cuentas con capacidad suficiente en el modelo configurado.";

const NO_SUGGESTIONS_MESSAGE =
  "No se encontraron conversaciones recientes que generen nuevas sugerencias de FAQ.";

const EMPTY_EXCLUDED_SUMMARY: FaqSuggestionExcludedSummary = {
  totalExcluded: 0,
  repeatedQuestions: 0,
  repeatedGroups: 0,
  byReason: {
    resolvedOrHighConfidence: 0,
    prohibitedOrSensitive: 0,
    emptyOrInvalid: 0,
    other: 0,
  },
  byCategory: {},
};

const CATEGORY_LABELS: Record<string, string> = {
  GENERAL: "General",
  HORARIOS: "Horarios",
  SERVICIOS: "Servicios",
  PRECIOS: "Precios",
  CONTACTO: "Contacto",
  EMERGENCIAS: "Emergencias",
  CITAS: "Citas",
};

const EXCLUSION_REASON_LABELS: Record<
  keyof FaqSuggestionExcludedSummary["byReason"],
  string
> = {
  resolvedOrHighConfidence: "Resueltas o con confianza suficiente",
  prohibitedOrSensitive: "Temática excluida o contenido sensible",
  emptyOrInvalid: "Vacías o sin contenido útil",
  other: "Otros motivos",
};

const EXCLUSION_GROUP_LABELS: Record<FaqExclusionReason, string> = {
  GREETING: "Saludos o conversación social",
  NOISE: "Texto sin significado suficiente",
  OUT_OF_SCOPE: "Contenido fuera de temática",
  CLINICAL: "Consulta clínica",
  SENSITIVE: "Datos personales o identificadores",
  APPOINTMENT_TRANSACTION: "Gestión individual de una cita",
  PROMPT_INJECTION: "Instrucción potencialmente insegura",
  RESOLVED_HIGH_CONFIDENCE: "Resuelta con confianza suficiente",
  EMPTY_OR_INVALID: "Vacía o sin contenido útil",
};

interface SummaryItemProps {
  label: string;
  value: string | number;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ExcludedSummary({
  summary,
  groups,
  consolidatedQuestions,
}: {
  summary: FaqSuggestionExcludedSummary;
  groups: FaqExcludedGroup[];
  consolidatedQuestions: FaqConsolidatedQuestion[];
}) {
  const reasons = Object.entries(summary.byReason).filter(
    ([, count]) => count > 0,
  ) as Array<[keyof FaqSuggestionExcludedSummary["byReason"], number]>;
  const categories = Object.entries(summary.byCategory)
    .filter(([, count]) => count > 0)
    .sort((left, right) => right[1] - left[1]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Resumen de filtros y repeticiones
        </CardTitle>
        <CardDescription>
          Las muestras están anonimizadas. El contenido sensible nunca se
          muestra literalmente.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 md:grid-cols-3">
        <div>
          <p className="text-2xl font-semibold">{summary.totalExcluded}</p>
          <p className="text-sm text-muted-foreground">Preguntas excluidas</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{summary.repeatedQuestions}</p>
          <p className="text-sm text-muted-foreground">
            Repeticiones adicionales en {summary.repeatedGroups} grupos
          </p>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Motivos de exclusión</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {reasons.length > 0
                ? reasons
                    .map(
                      ([reason, count]) =>
                        `${EXCLUSION_REASON_LABELS[reason]}: ${count}`,
                    )
                    .join(" · ")
                : "No hubo exclusiones"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Categorías o temas excluidos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {categories.length > 0
                ? categories
                    .map(
                      ([category, count]) =>
                        `${CATEGORY_LABELS[category] ?? category.replaceAll("_", " ").toLowerCase()}: ${count}`,
                    )
                    .join(" · ")
                : "Sin categorías excluidas"}
            </p>
          </div>
        </div>
      </CardContent>
      {(groups.length > 0 || consolidatedQuestions.length > 0) && (
        <CardFooter className="grid w-full gap-5 border-t pt-5 lg:grid-cols-2">
          <div>
            <p className="mb-3 font-medium">Preguntas descartadas</p>
            {groups.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hubo preguntas descartadas.
              </p>
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {groups.map((group, index) => (
                  <li
                    key={`${group.reason}-${group.representativeQuestion}-${index}`}
                    className="rounded-md border bg-background p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">
                          {EXCLUSION_GROUP_LABELS[group.reason]}
                        </p>
                        <p className="mt-1 break-words text-sm text-muted-foreground">
                          “{group.representativeQuestion}”
                        </p>
                      </div>
                      <Badge variant="secondary">{group.count}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-3 font-medium">Repeticiones consolidadas</p>
            {consolidatedQuestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hubo preguntas relevantes repetidas.
              </p>
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {consolidatedQuestions.map((item, index) => (
                  <li
                    key={`${item.question}-${index}`}
                    className="rounded-md border bg-background p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="break-words text-sm font-medium">
                          “{item.question}”
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Enviada una sola vez a la IA
                        </p>
                      </div>
                      <Badge variant="outline">
                        {item.occurrences} ocurrencias
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

interface SuggestionCardProps {
  suggestion: FaqSuggestion;
  position: number;
  onCopy: (text: string, contentName: string) => Promise<void>;
}

function SuggestionCard({ suggestion, position, onCopy }: SuggestionCardProps) {
  const answerAvailable = Boolean(suggestion.suggestedAnswer?.trim());

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Sugerencia {position}</Badge>
          <Badge variant="outline">
            {CATEGORY_LABELS[suggestion.category] ?? suggestion.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {suggestion.evidenceCount}{" "}
            {suggestion.evidenceCount === 1
              ? "pregunta relacionada"
              : "preguntas relacionadas"}
          </span>
        </div>
        <CardTitle className="mt-2 text-lg">{suggestion.question}</CardTitle>
        <CardDescription>{suggestion.reason}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg bg-muted/60 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Respuesta sugerida
          </p>
          {answerAvailable ? (
            <p className="whitespace-pre-wrap leading-6">
              {suggestion.suggestedAnswer}
            </p>
          ) : (
            <div className="flex items-start gap-2 text-amber-700 dark:text-amber-300">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>
                Requiere una respuesta humana antes de crear la FAQ. No se
                encontró una fuente institucional suficiente.
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCopy(suggestion.question, "Pregunta")}
        >
          <Clipboard />
          Copiar pregunta
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!answerAvailable}
          title={
            answerAvailable
              ? undefined
              : "Esta sugerencia aún no tiene respuesta"
          }
          onClick={() => onCopy(suggestion.suggestedAnswer ?? "", "Respuesta")}
        >
          <Clipboard />
          Copiar respuesta
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onCopy(buildCompleteFaqText(suggestion), "FAQ completa")
          }
        >
          <Clipboard />
          Copiar FAQ completa
        </Button>
      </CardFooter>
    </Card>
  );
}

export function FaqSuggestionsPanel() {
  const [useQwen, setUseQwen] = useState(false);
  const [result, setResult] = useState<FaqSuggestionsResponse | null>(null);
  const [lastRequest, setLastRequest] =
    useState<GenerateFaqSuggestionsDto | null>(null);
  const [retryWaitSeconds, setRetryWaitSeconds] = useState(0);
  const generateMutation = useGenerateFaqSuggestions();
  const errorData = getFaqSuggestionsErrorData(generateMutation.error);

  useEffect(() => {
    if (!generateMutation.isError || retryWaitSeconds <= 0) return;
    const intervalId = window.setInterval(() => {
      setRetryWaitSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }
        return current - 1;
      });
    }, 1_000);

    return () => window.clearInterval(intervalId);
  }, [generateMutation.isError, retryWaitSeconds]);

  const mergeResults = (
    previous: FaqSuggestionsResponse | null,
    next: FaqSuggestionsResponse,
    append: boolean,
  ): FaqSuggestionsResponse => {
    if (!append || !previous) return next;

    const suggestions = [...previous.suggestions];
    const existing = new Set(
      suggestions.map(
        (item) => `${item.category}:${item.question.trim().toLowerCase()}`,
      ),
    );
    for (const suggestion of next.suggestions) {
      const key = `${suggestion.category}:${suggestion.question.trim().toLowerCase()}`;
      if (!existing.has(key)) {
        suggestions.push(suggestion);
        existing.add(key);
      }
    }

    return {
      ...next,
      offset: previous.offset,
      questionsAnalyzed:
        previous.questionsAnalyzed + next.questionsAnalyzed,
      groupsDetected: suggestions.length,
      suggestions,
    };
  };

  const executeAnalysis = async (
    request: GenerateFaqSuggestionsDto,
    append: boolean,
  ) => {
    setLastRequest(request);
    setRetryWaitSeconds(0);
    generateMutation.reset();

    try {
      const response = await generateMutation.mutateAsync(request);
      setResult((current) => mergeResults(current, response, append));
    } catch (error) {
      const details = getFaqSuggestionsErrorData(error);
      setRetryWaitSeconds(details?.retryAfterSeconds ?? 0);
      if (details?.analysis) {
        setLastRequest({
          useQwen: true,
          snapshotAt: details.analysis.snapshotAt,
          offset: details.analysis.offset,
        });
        if (!append) {
          setResult({
            ...details.analysis,
            groupsDetected: 0,
            suggestions: [],
          });
        }
      }
    }
  };

  const handleAnalyze = async () => {
    if (!useQwen || generateMutation.isPending) return;

    setResult(null);
    setLastRequest(null);
    await executeAnalysis({ useQwen: true, offset: 0 }, false);
  };

  const handleNextBatch = async () => {
    if (
      !result?.hasMore ||
      result.nextOffset === null ||
      generateMutation.isPending
    ) {
      return;
    }

    await executeAnalysis(
      {
        useQwen: true,
        snapshotAt: result.snapshotAt,
        offset: result.nextOffset,
      },
      true,
    );
  };

  const handleRetry = async () => {
    if (
      !lastRequest ||
      !errorData?.retryable ||
      retryWaitSeconds > 0 ||
      generateMutation.isPending
    ) {
      return;
    }

    await executeAnalysis(
      { ...lastRequest, retry: true },
      (lastRequest.offset ?? 0) > 0,
    );
  };

  const handleCopy = async (text: string, contentName: string) => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(text);
      toast.success(`${contentName} copiada al portapapeles`);
    } catch {
      toast.error(`No se pudo copiar ${contentName.toLowerCase()}`);
    }
  };

  const hasSuggestions = Boolean(result?.suggestions.length);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <CardTitle>Sugerencias basadas en conversaciones</CardTitle>
              <CardDescription className="mt-1 max-w-3xl">
                Analiza preguntas anonimizadas de las últimas 48 horas y propone
                contenido para que lo revises y copies manualmente. Este proceso
                no crea ni modifica preguntas frecuentes.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Bot className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <div>
                <label htmlFor="use-qwen" className="font-medium">
                  Usar Qwen en este análisis
                </label>
                <p
                  id="use-qwen-description"
                  className="mt-1 text-sm text-muted-foreground"
                >
                  Confirmación temporal e independiente de FAQ_PLUS_AI. No se
                  guardará al recargar ni cambiar de página.
                </p>
              </div>
            </div>

            <button
              id="use-qwen"
              type="button"
              role="switch"
              aria-checked={useQwen}
              aria-describedby="use-qwen-description"
              aria-label="Usar Qwen en este análisis"
              disabled={generateMutation.isPending}
              onClick={() => {
                setUseQwen((current) => !current);
                generateMutation.reset();
                setLastRequest(null);
              }}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                useQwen ? "bg-primary" : "bg-input",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform",
                  useQwen ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>

          {!useQwen && (
            <div
              id="qwen-disabled-message"
              className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{QWEN_DISABLED_MESSAGE}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="size-4" />
              Los resultados viven solo en esta pantalla y desaparecerán al
              salir o recargar.
            </p>
            <Button
              type="button"
              size="lg"
              disabled={!useQwen || generateMutation.isPending}
              aria-describedby={!useQwen ? "qwen-disabled-message" : undefined}
              onClick={handleAnalyze}
            >
              {generateMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <MessageSquareText />
              )}
              {generateMutation.isPending
                ? "Analizando conversaciones…"
                : "Analizar las últimas 48 horas"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generateMutation.isPending && (
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center"
        >
          <Loader2 className="size-7 animate-spin text-muted-foreground" />
          <div>
            <p className="font-medium">Analizando conversaciones recientes</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Estamos agrupando preguntas por tema y validando las sugerencias.
            </p>
          </div>
        </div>
      )}

      {generateMutation.isError && !generateMutation.isPending && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-medium">No se pudo completar el análisis</p>
              <p className="mt-1 text-sm">
                {getFaqSuggestionsErrorMessage(generateMutation.error)}
              </p>
              {errorData?.retryable && (
                <p className="mt-2 text-sm">
                  No se realizó un reintento automático para evitar consumo
                  duplicado. El reintento manual utilizará hasta 240 segundos.
                </p>
              )}
              {errorData?.retryable && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 border-destructive/40 bg-background text-foreground"
                  disabled={retryWaitSeconds > 0}
                  onClick={handleRetry}
                >
                  <RefreshCw />
                  {retryWaitSeconds > 0
                    ? `Reintentar en ${retryWaitSeconds} s`
                    : "Reintentar análisis"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {!generateMutation.isPending &&
        !generateMutation.isError &&
        !result &&
        useQwen && (
          <EmptyState
            title="Aún no hay sugerencias"
            description="Inicia el análisis para revisar las preguntas frecuentes detectadas en las conversaciones recientes."
          />
        )}

      {result && !generateMutation.isPending && (
        <div className="space-y-6" aria-live="polite">
          <section aria-labelledby="suggestions-summary-title">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-600" />
              <h2
                id="suggestions-summary-title"
                className="text-lg font-semibold"
              >
                Resumen del análisis
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryItem
                label="Periodo analizado"
                value={`${result.periodHours} h`}
              />
              <SummaryItem
                label="Logs encontrados"
                value={result.totalLogs ?? result.questionsFound}
              />
              <SummaryItem
                label="Preguntas descartadas"
                value={result.excludedSummary?.totalExcluded ?? 0}
              />
              <SummaryItem
                label="Repeticiones consolidadas"
                value={result.consolidatedDuplicates}
              />
              <SummaryItem
                label="Preguntas únicas elegibles"
                value={result.eligibleQuestions}
              />
              <SummaryItem
                label="Preguntas analizadas"
                value={result.questionsAnalyzed}
              />
              <SummaryItem
                label="Preguntas pendientes"
                value={result.pendingQuestions}
              />
              <SummaryItem
                label="FAQ sugeridas"
                value={result.suggestions.length}
              />
            </div>
          </section>

          <ExcludedSummary
            summary={result.excludedSummary ?? EMPTY_EXCLUDED_SUMMARY}
            groups={result.excludedGroups ?? []}
            consolidatedQuestions={result.consolidatedQuestions ?? []}
          />

          {result.message && hasSuggestions && (
            <p className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
              {result.message}
            </p>
          )}

          {!hasSuggestions ? (
            <EmptyState
              title="Sin nuevas sugerencias"
              description={result.message || NO_SUGGESTIONS_MESSAGE}
            />
          ) : (
            <section
              aria-labelledby="suggestions-list-title"
              className="space-y-4"
            >
              <div>
                <h2
                  id="suggestions-list-title"
                  className="text-lg font-semibold"
                >
                  FAQ sugeridas
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Revisa el contenido antes de copiarlo al formulario manual de
                  Nueva FAQ.
                </p>
              </div>
              {result.suggestions.map((suggestion, index) => (
                <SuggestionCard
                  key={`${suggestion.group}-${suggestion.question}`}
                  suggestion={suggestion}
                  position={index + 1}
                  onCopy={handleCopy}
                />
              ))}
            </section>
          )}

          {result.hasMore && result.nextOffset !== null && (
            <div className="flex flex-col items-start gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Quedan {result.pendingQuestions} preguntas únicas relevantes
                por analizar. Cada solicitud procesa como máximo 10.
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={generateMutation.isPending || generateMutation.isError}
                onClick={handleNextBatch}
              >
                <MessageSquareText />
                Analizar siguiente lote
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
