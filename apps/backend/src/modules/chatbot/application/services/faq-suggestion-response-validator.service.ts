import { Injectable } from '@nestjs/common';
import {
  FAQ_SUGGESTION_CATEGORIES,
  FaqSuggestion,
  FaqSuggestionCategory,
} from '../../domain/interfaces/faq-suggestion.interface';
import { FaqSuggestionSanitizer } from './faq-suggestion-sanitizer.service';

export class InvalidFaqSuggestionsResponseError extends Error {
  constructor() {
    super('La respuesta de IA no contiene sugerencias FAQ válidas');
    this.name = 'InvalidFaqSuggestionsResponseError';
  }
}

const REQUIRED_SUGGESTION_KEYS = [
  'group',
  'sourceQuestionIndexes',
  'question',
  'category',
  'suggestedAnswer',
  'reason',
  'needsHumanAnswer',
  'evidenceCount',
] as const;

@Injectable()
export class FaqSuggestionResponseValidator {
  constructor(private readonly sanitizer: FaqSuggestionSanitizer) {}

  validate(
    rawResponse: string,
    questionCount: number,
    authorizedCategories: ReadonlySet<FaqSuggestionCategory>,
  ): FaqSuggestion[] {
    let parsed: unknown;

    try {
      parsed = JSON.parse(rawResponse) as unknown;
    } catch {
      throw new InvalidFaqSuggestionsResponseError();
    }

    if (!this.isPlainObject(parsed)) {
      throw new InvalidFaqSuggestionsResponseError();
    }

    const topLevelKeys = Object.keys(parsed);
    const parsedSuggestions = parsed.suggestions;
    if (
      topLevelKeys.length !== 1 ||
      topLevelKeys[0] !== 'suggestions' ||
      !Array.isArray(parsedSuggestions) ||
      parsedSuggestions.length > questionCount
    ) {
      throw new InvalidFaqSuggestionsResponseError();
    }

    const usedIndexes = new Set<number>();
    const usedGroups = new Set<number>();

    return parsedSuggestions.map((candidate): FaqSuggestion => {
      if (
        !this.isPlainObject(candidate) ||
        !this.hasOnlyRequiredKeys(candidate)
      ) {
        throw new InvalidFaqSuggestionsResponseError();
      }

      const {
        group,
        sourceQuestionIndexes,
        question,
        category,
        suggestedAnswer,
        reason,
        needsHumanAnswer,
        evidenceCount,
      } = candidate;

      if (
        typeof group !== 'number' ||
        !Number.isInteger(group) ||
        group < 1 ||
        usedGroups.has(group) ||
        !Array.isArray(sourceQuestionIndexes) ||
        sourceQuestionIndexes.length === 0 ||
        typeof evidenceCount !== 'number' ||
        !Number.isInteger(evidenceCount) ||
        evidenceCount !== sourceQuestionIndexes.length ||
        typeof needsHumanAnswer !== 'boolean' ||
        !this.isSafeText(question, 300) ||
        !this.isSafeText(reason, 1_000) ||
        !this.isAllowedCategory(category)
      ) {
        throw new InvalidFaqSuggestionsResponseError();
      }

      usedGroups.add(group);

      const localIndexes = new Set<number>();
      const validatedIndexes: number[] = [];
      for (const indexValue of sourceQuestionIndexes) {
        if (
          typeof indexValue !== 'number' ||
          !Number.isInteger(indexValue) ||
          indexValue < 1 ||
          indexValue > questionCount ||
          localIndexes.has(indexValue) ||
          usedIndexes.has(indexValue)
        ) {
          throw new InvalidFaqSuggestionsResponseError();
        }
        localIndexes.add(indexValue);
        usedIndexes.add(indexValue);
        validatedIndexes.push(indexValue);
      }

      let validatedAnswer: string | null;
      if (suggestedAnswer === null) {
        validatedAnswer = null;
      } else {
        if (!this.isSafeText(suggestedAnswer, 2_000)) {
          throw new InvalidFaqSuggestionsResponseError();
        }
        validatedAnswer = suggestedAnswer.trim();
      }

      if (
        (!needsHumanAnswer && suggestedAnswer === null) ||
        (suggestedAnswer !== null && !authorizedCategories.has(category))
      ) {
        throw new InvalidFaqSuggestionsResponseError();
      }

      return {
        group,
        sourceQuestionIndexes: validatedIndexes,
        question: question.trim(),
        category,
        suggestedAnswer: validatedAnswer,
        reason: reason.trim(),
        needsHumanAnswer,
        evidenceCount,
      };
    });
  }

  private hasOnlyRequiredKeys(value: Record<string, unknown>): boolean {
    const keys = Object.keys(value).sort();
    const required = [...REQUIRED_SUGGESTION_KEYS].sort();
    return (
      keys.length === required.length &&
      keys.every((key, index) => key === required[index])
    );
  }

  private isSafeText(value: unknown, maxLength: number): value is string {
    if (
      typeof value !== 'string' ||
      value.trim().length === 0 ||
      value.length > maxLength ||
      this.hasForbiddenControlCharacter(value) ||
      /<\/?[a-z][^>]*>|javascript\s*:|\bon(?:click|load|error|mouseover)\s*=|```/i.test(
        value,
      ) ||
      this.sanitizer.containsSensitiveData(value) ||
      this.sanitizer.containsProhibitedContent(value)
    ) {
      return false;
    }

    return true;
  }

  private isAllowedCategory(value: unknown): value is FaqSuggestionCategory {
    const allowedCategories: readonly string[] = FAQ_SUGGESTION_CATEGORIES;
    return typeof value === 'string' && allowedCategories.includes(value);
  }

  private hasForbiddenControlCharacter(value: string): boolean {
    for (const character of value) {
      const code = character.charCodeAt(0);
      if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
        return true;
      }
    }
    return false;
  }

  private isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.getPrototypeOf(value) === Object.prototype
    );
  }
}
