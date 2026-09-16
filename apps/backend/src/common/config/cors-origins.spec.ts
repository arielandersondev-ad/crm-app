import { normalizeOrigin, parseAllowedOrigins } from './cors-origins';

describe('CORS origins', () => {
  it('normaliza URLs con barra final', () => {
    expect(normalizeOrigin('https://www.aminesttech.com/')).toBe(
      'https://www.aminesttech.com',
    );
  });

  it('acepta múltiples orígenes separados por comas', () => {
    expect(
      parseAllowedOrigins(
        'https://www.aminesttech.com/, https://preview.example.com',
        'http://localhost:3000',
      ),
    ).toEqual([
      'https://www.aminesttech.com',
      'https://preview.example.com',
      'http://localhost:3000',
    ]);
  });
});
