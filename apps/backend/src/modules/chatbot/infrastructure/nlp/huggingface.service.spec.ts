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
          FAQ_HF_TIMEOUT: 1_200,
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

  it('duplica el timeout únicamente para el reintento manual', async () => {
    const configService = {
      get: jest.fn((key: string, fallback?: unknown) => {
        const values: Record<string, unknown> = {
          HF_TOKEN: 'secret-token',
          FAQ_HF_MODEL: 'Qwen/test-model',
          FAQ_HF_PROVIDER: 'nscale',
          FAQ_HF_TIMEOUT: 120_000,
        };
        return values[key] ?? fallback;
      }),
    } as unknown as ConfigService;
    const timeoutSpy = jest.spyOn(global, 'setTimeout');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [{ message: { content: '{"suggestions":[]}' } }],
      }),
    });
    const service = new HuggingFaceService(configService);

    await service.generateFaqSuggestions('primer-intento');
    await service.generateFaqSuggestions('retry', { retry: true });

    expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), 120_000);
    expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), 240_000);
  });

  it('expone 429 como recuperable sin reintentar automáticamente', async () => {
    const configService = {
      get: jest.fn((key: string, fallback?: unknown) => {
        const values: Record<string, unknown> = {
          HF_TOKEN: 'secret-token',
          FAQ_HF_MODEL: 'Qwen/test-model',
          FAQ_HF_PROVIDER: 'nscale',
        };
        return values[key] ?? fallback;
      }),
    } as unknown as ConfigService;
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: jest.fn().mockResolvedValue('{"error":"rate limit"}'),
      headers: { get: jest.fn().mockReturnValue('5') },
    });
    const service = new HuggingFaceService(configService);

    await expect(
      service.generateFaqSuggestions('prompt'),
    ).rejects.toMatchObject({
      statusCode: 429,
      code: 'FAQ_AI_RATE_LIMITED',
      retryable: true,
      retryAfterSeconds: 5,
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('registra la causa técnica de un fallo de conexión sin exponer el token', async () => {
    const configService = {
      get: jest.fn((key: string, fallback?: unknown) => {
        const values: Record<string, unknown> = {
          HF_TOKEN: 'secret-token',
          FAQ_HF_MODEL: 'Qwen/test-model',
          FAQ_HF_PROVIDER: 'nscale',
          FAQ_HF_TIMEOUT: 120_000,
        };
        return values[key] ?? fallback;
      }),
    } as unknown as ConfigService;
    const cause = Object.assign(
      new Error('unable to verify the first certificate'),
      { code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' },
    );
    global.fetch = jest
      .fn()
      .mockRejectedValue(Object.assign(new TypeError('fetch failed'), { cause }));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const service = new HuggingFaceService(configService);

    await expect(
      service.generateFaqSuggestions('preguntas anonimizadas'),
    ).rejects.toMatchObject({
      statusCode: 503,
      code: 'FAQ_AI_UNAVAILABLE',
      retryable: true,
    });

    expect(errorSpy).toHaveBeenCalledWith('[FAQ AI ERROR]', {
      name: 'TypeError',
      message: 'fetch failed',
      cause: {
        name: 'Error',
        message: 'unable to verify the first certificate',
        code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
      },
      model: 'Qwen/test-model',
      provider: 'nscale',
      retry: false,
      timeoutMs: 120_000,
    });
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain('secret-token');
  });
});
