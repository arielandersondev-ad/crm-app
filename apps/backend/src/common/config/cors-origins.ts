export function normalizeOrigin(origin: string): string {
  const value = origin.trim();
  if (!value) return '';

  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, '');
  }
}

export function parseAllowedOrigins(...values: Array<string | undefined>): string[] {
  const origins = values
    .flatMap((value) => value?.split(',') ?? [])
    .map(normalizeOrigin)
    .filter(Boolean);

  return [...new Set(origins)];
}
