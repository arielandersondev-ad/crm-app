export function formatDate( value: unknown ) {
  if (!value) return '-';

  const str =
    typeof value === 'string'
      ? value
      : String(value);

  const isPlainDate =
    /^\d{4}-\d{2}-\d{2}$/.test(str);

  if (isPlainDate) {
    return str;
  }

  const date = new Date(str);

  if (isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'es-ES',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    }
  ).format(date);
}