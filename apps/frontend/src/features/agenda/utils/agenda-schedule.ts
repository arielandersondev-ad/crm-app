import type { BranchSchedule } from "../../configuracion/services/configuracion.service";
import { toDateTimeInput } from "../../../shared/utils/date-time";

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
type Schedule = Pick<BranchSchedule, "dayOfWeek" | "openTime" | "closeTime" | "isOpen">;

export function isClosedDay(day: Date, schedules?: Schedule[]): boolean {
  if (!schedules?.length) return false;
  return !schedules.find((schedule) => schedule.dayOfWeek === DAYS[day.getDay()])?.isOpen;
}

export function getScheduleWarning(scheduledAt: string, timezone: string, schedules?: Schedule[]): string | null {
  if (!schedules?.length) return null;
  const local = toDateTimeInput(scheduledAt, timezone);
  if (!local) return null;
  const day = new Date(`${local.slice(0, 10)}T12:00:00`).getDay();
  const time = local.slice(11, 16);
  const schedule = schedules.find((item) => item.dayOfWeek === DAYS[day]);
  const previous = schedules.find((item) => item.dayOfWeek === DAYS[(day + 6) % 7]);

  // Un turno nocturno del día anterior puede continuar después de medianoche.
  if (previous?.isOpen && previous.openTime && previous.closeTime &&
      previous.openTime > previous.closeTime && time < previous.closeTime) return null;
  if (!schedule?.isOpen) return "Día sin atención configurada";
  if (!schedule.openTime || !schedule.closeTime) return null;
  const inside = schedule.openTime > schedule.closeTime
    ? time >= schedule.openTime
    : time >= schedule.openTime && time < schedule.closeTime;
  return inside ? null : "Fuera del horario de atención";
}

export const OUTSIDE_SCHEDULE_CLASSES = "border-yellow-400 bg-yellow-100 hover:bg-yellow-200 dark:border-yellow-600 dark:bg-yellow-950/60 dark:hover:bg-yellow-900/60";
