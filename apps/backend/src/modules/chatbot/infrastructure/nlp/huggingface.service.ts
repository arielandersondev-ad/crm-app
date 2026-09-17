import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AIProvider,
  AIProviderRequestError,
} from '../../domain/interfaces/ai-provider.interface';

const FAQ_SUGGESTIONS_RESPONSE_FORMAT = {
  type: 'json_schema',
  json_schema: {
    name: 'faq_suggestions',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        suggestions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              group: { type: 'integer' },
              sourceQuestionIndexes: {
                type: 'array',
                items: { type: 'integer' },
              },
              question: { type: 'string' },
              category: {
                type: 'string',
                enum: [
                  'GENERAL',
                  'HORARIOS',
                  'SERVICIOS',
                  'PRECIOS',
                  'CONTACTO',
                  'EMERGENCIAS',
                  'CITAS',
                ],
              },
              suggestedAnswer: {
                type: ['string', 'null'],
              },
              reason: { type: 'string' },
              needsHumanAnswer: { type: 'boolean' },
              evidenceCount: { type: 'integer' },
            },
            required: [
              'group',
              'sourceQuestionIndexes',
              'question',
              'category',
              'suggestedAnswer',
              'reason',
              'needsHumanAnswer',
              'evidenceCount',
            ],
          },
        },
      },
      required: ['suggestions'],
    },
  },
} as const;

@Injectable()
export class HuggingFaceService implements AIProvider {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly faqModel: string;
  private readonly faqProvider: string;
  private readonly chatTimeout: number;
  private readonly faqTimeout: number;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('HF_TOKEN') ?? '';
    this.model = this.configService.get<string>(
      'HF_MODEL',
      'Qwen/Qwen2.5-3B-Instruct',
    );
    this.faqModel = this.configService.get<string>(
      'FAQ_HF_MODEL',
      'Qwen/Qwen3-4B-Instruct-2507',
    );
    this.faqProvider = this.configService.get<string>(
      'FAQ_HF_PROVIDER',
      'nscale',
    );
    this.chatTimeout = this.readPositiveNumber('HF_TIMEOUT', 20_000);
    this.faqTimeout = this.readPositiveNumber('FAQ_HF_TIMEOUT', 120_000);
  }

  async generate(question: string, context: string): Promise<string> {
    const systemPrompt = `Eres un asistente administrativo de una clínica oftalmológica.
Responde únicamente utilizando la información proporcionada.
No inventes información.
No realices diagnósticos médicos.
No recomiendes tratamientos.
Si el contexto no contiene la respuesta, responde exactamente:
"No cuento con información suficiente. Comuníquese con recepción."`;

    const prompt = `${systemPrompt}\n\nContexto:\n${context}\n\nPregunta: ${question}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.chatTimeout);

    try {
      const res = await fetch(
        `https://router.huggingface.co/hf-inference/models/${this.model}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 800, temperature: 0.2 },
          }),
          signal: controller.signal,
        },
      );

      if (!res.ok) {
        const errorBody = await res.text();

        console.error('[FAQ DEBUG] Hugging Face:', {
          status: res.status,
          body: errorBody,
          model: this.model,
        });

        throw new Error(`HuggingFace API error: ${res.status}`);
      }

      const data = (await res.json()) as unknown;
      const text = this.extractGeneratedText(data) ?? '';
      const answer = text.replace(prompt, '').trim();
      return (
        answer ||
        'No cuento con información suficiente. Comuníquese con recepción.'
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return 'El servicio de IA está temporalmente no disponible. Comuníquese con recepción.';
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateFaqSuggestions(
    prompt: string,
    options: { retry?: boolean } = {},
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = options.retry ? this.faqTimeout * 2 : this.faqTimeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(
        'https://router.huggingface.co/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: `${this.faqModel}:${this.faqProvider}`,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 800,
            temperature: 0,
            response_format: FAQ_SUGGESTIONS_RESPONSE_FORMAT,
            stream: false,
          }),
          signal: controller.signal,
        },
      );

      if (!res.ok) {
        const body = await res.text();

        console.error('[HF ERROR]', {
          status: res.status,
          body,
          model: this.faqModel,
        });

        throw this.buildProviderError(
          res.status,
          res.headers.get('retry-after'),
        );
      }

      const data = (await res.json()) as unknown;
      const generatedText = this.extractChatCompletionText(data);

      if (typeof generatedText !== 'string' || generatedText.trim() === '') {
        throw new Error('HuggingFace returned an empty suggestions response');
      }

      return generatedText.trim();
    } catch (error: unknown) {
      if (error instanceof AIProviderRequestError) {
        throw error;
      }

      this.logFaqProviderFailure(error, options.retry === true, timeout);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new AIProviderRequestError(
          `El proveedor no respondió dentro de ${timeout / 1_000} segundos.`,
          504,
          'FAQ_AI_TIMEOUT',
          true,
        );
      }

      throw new AIProviderRequestError(
        'No fue posible establecer comunicación con el proveedor de IA.',
        503,
        'FAQ_AI_UNAVAILABLE',
        true,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private logFaqProviderFailure(
    error: unknown,
    retry: boolean,
    timeoutMs: number,
  ): void {
    const errorRecord = this.isRecord(error) ? error : undefined;
    const cause = errorRecord?.cause;
    const causeRecord = this.isRecord(cause) ? cause : undefined;

    console.error('[FAQ AI ERROR]', {
      name: error instanceof Error ? error.name : typeof error,
      message:
        error instanceof Error ? error.message : 'Error no reconocido',
      cause: causeRecord
        ? {
            name:
              typeof causeRecord.name === 'string'
                ? causeRecord.name
                : undefined,
            message:
              typeof causeRecord.message === 'string'
                ? causeRecord.message
                : undefined,
            code:
              typeof causeRecord.code === 'string'
                ? causeRecord.code
                : undefined,
          }
        : undefined,
      model: this.faqModel,
      provider: this.faqProvider,
      retry,
      timeoutMs,
    });
  }

  private buildProviderError(
    status: number,
    retryAfterHeader: string | null,
  ): AIProviderRequestError {
    const retryAfterSeconds = this.parseRetryAfter(retryAfterHeader);
    const definitions: Record<
      number,
      { code: string; message: string; retryable: boolean }
    > = {
      400: {
        code: 'FAQ_AI_INVALID_REQUEST',
        message: 'El modelo o los parámetros configurados no son válidos.',
        retryable: false,
      },
      401: {
        code: 'FAQ_AI_AUTH_ERROR',
        message: 'El proveedor rechazó las credenciales configuradas.',
        retryable: false,
      },
      403: {
        code: 'FAQ_AI_AUTH_ERROR',
        message: 'La cuenta no tiene permisos para utilizar el modelo.',
        retryable: false,
      },
      429: {
        code: 'FAQ_AI_RATE_LIMITED',
        message: 'El proveedor alcanzó temporalmente su límite de solicitudes.',
        retryable: true,
      },
      502: {
        code: 'FAQ_AI_BAD_GATEWAY',
        message: 'El proveedor devolvió una respuesta temporalmente inválida.',
        retryable: true,
      },
      503: {
        code: 'FAQ_AI_UNAVAILABLE',
        message: 'El proveedor de IA está temporalmente no disponible.',
        retryable: true,
      },
      504: {
        code: 'FAQ_AI_TIMEOUT',
        message: 'El proveedor agotó el tiempo disponible para responder.',
        retryable: true,
      },
    };
    const definition = definitions[status] ?? definitions[503];

    return new AIProviderRequestError(
      definition.message,
      status >= 400 && status <= 599 ? status : 503,
      definition.code,
      definition.retryable,
      retryAfterSeconds,
    );
  }

  private parseRetryAfter(value: string | null): number | undefined {
    if (!value) return undefined;

    const seconds = Number(value);
    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.ceil(seconds);
    }

    const date = Date.parse(value);
    if (Number.isNaN(date)) return undefined;
    return Math.max(0, Math.ceil((date - Date.now()) / 1_000));
  }

  private readPositiveNumber(key: string, fallback: number): number {
    const value = Number(
      this.configService.get<string | number>(key, fallback),
    );
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }

  private extractGeneratedText(data: unknown): string | undefined {
    const candidate: unknown = Array.isArray(data) ? data[0] : data;
    if (
      !this.isRecord(candidate) ||
      typeof candidate.generated_text !== 'string'
    ) {
      return undefined;
    }

    return candidate.generated_text;
  }

  private extractChatCompletionText(data: unknown): string | undefined {
    if (!this.isRecord(data) || !Array.isArray(data.choices)) {
      return undefined;
    }

    const firstChoice: unknown = data.choices[0];
    if (!this.isRecord(firstChoice) || !this.isRecord(firstChoice.message)) {
      return undefined;
    }

    const content: unknown = firstChoice.message.content;
    return typeof content === 'string' ? content : undefined;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
