export interface AIProvider {
  generate(question: string, context: string): Promise<string>;
  generateFaqSuggestions(
    prompt: string,
    options?: { retry?: boolean },
  ): Promise<string>;
}

export class AIProviderRequestError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly retryable: boolean,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = 'AIProviderRequestError';
  }
}
