import { ConfigService } from '@nestjs/config';
import { HuggingFaceService } from './huggingface.service';

describe('HuggingFaceService FAQ suggestions', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('usa una generación estructurada independiente y conserva 800 tokens', async () => {
    const configService = {
      get: jest.fn((key: string, fallback?: unknown) => {
        const values: Record<string, unknown> = {
          HF_TOKEN: 'secret-token',
          HF_MODEL: 'Qwen/test-model',
          FAQ_HF_MODEL: 'Qwen/test-model',
          FAQ_HF_PROVIDER: 'nscale',
          HF_TIMEOUT: 1_000,
        };
        return values[key] ?? fallback;
      }),
    } as unknown as ConfigService;
    const service = new HuggingFaceService(configService);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [{ message: { content: '{"suggestions":[]}' } }],
      }),
    });

    await expect(
      service.generateFaqSuggestions('prompt-estructurado'),
    ).resolves.toBe('{"suggestions":[]}');

    const calls = (global.fetch as jest.MockedFunction<typeof fetch>).mock
      .calls;
    const options = calls[0]?.[1];
    if (typeof options?.body !== 'string') {
      throw new Error('Expected a JSON request body');
    }
    const body = JSON.parse(options.body) as Record<string, unknown>;
    expect(body).toEqual({
      model: 'Qwen/test-model:nscale',
      messages: [{ role: 'user', content: 'prompt-estructurado' }],
      max_tokens: 800,
      temperature: 0,
      response_format: {
        type: 'json_schema',
        json_schema: expect.objectContaining({
          name: 'faq_suggestions',
          strict: true,
          schema: expect.objectContaining({
            type: 'object',
            required: ['suggestions'],
          }),
        }),
      },
      stream: false,
    });
    expect(JSON.stringify(body.response_format)).toContain(
      '"needsHumanAnswer"',
    );
  });
});
