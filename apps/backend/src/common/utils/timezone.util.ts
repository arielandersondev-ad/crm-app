import { DateTime } from 'luxon';

export function toUTC(dateStr: string, timezone: string): Date {
  const dt = DateTime.fromISO(dateStr, { zone: timezone });
  if (!dt.isValid) {
    throw new Error(`Fecha inválida: ${dateStr} para zona ${timezone}`);
  }
  return dt.toUTC().toJSDate();
}

export function toBranchLocal(utcDate: Date, timezone: string): string {
  const dt = DateTime.fromJSDate(utcDate).setZone(timezone);
  if (!dt.isValid) {
    throw new Error(`Zona horaria inválida: ${timezone}`);
  }
  return dt.toISO({ includeOffset: true })!;
}

export function formatInTimezone(utcDate: Date, timezone: string, format: string = 'yyyy-MM-dd HH:mm'): string {
  return DateTime.fromJSDate(utcDate).setZone(timezone).toFormat(format);
}
