import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIProvider } from '../../domain/interfaces/ai-provider.interface';

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
  private readonly timeout: number;

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
    this.timeout = this.configService.get<number>('HF_TIMEOUT', 10000);
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
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

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

  async generateFaqSuggestions(prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

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

        throw new Error(`HuggingFace API error: ${res.status}`);
      }

      const data = (await res.json()) as unknown;
      const generatedText = this.extractChatCompletionText(data);

      if (typeof generatedText !== 'string' || generatedText.trim() === '') {
        throw new Error('HuggingFace returned an empty suggestions response');
      }

      return generatedText.trim();
    } finally {
      clearTimeout(timeoutId);
    }
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
