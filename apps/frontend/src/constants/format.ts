export function toDateTimeLocal(
  date: string | Date | null | undefined
): string {
  if (!date) {
    return "";
  }

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "";
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDateTime(
  date: string | Date | null | undefined
): string {
  if (!date) {
    return "";
  }

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "";
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${d.getFullYear()} / ${pad(d.getMonth() + 1)} / ${pad(
    d.getDate()
  )} - ${pad(d.getHours())} : ${pad(d.getMinutes())}`;
}