import type { Details } from "../types/interfaces";
import { dateKey } from "../../../shared/utils/date-time";

// Las fechas de navegación representan días del calendario de la sucursal.
export function buildAgendaCalendar(appointments: Details[], currentDate: Date, timezone: string) {
  const calendarKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const ordered = [...appointments].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const dayAppointments = ordered.filter((appointment) => dateKey(appointment.scheduledAt, timezone) === calendarKey(currentDate));
  const weekStart = new Date(currentDate);
  weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + 6) % 7);
  const week = Array.from({ length: 7 }, (_, index) => {
    const fecha = new Date(weekStart);
    fecha.setDate(fecha.getDate() + index);
    return { fecha, citas: ordered.filter((appointment) => dateKey(appointment.scheduledAt, timezone) === calendarKey(fecha)) };
  });
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 12);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 12);
  const month = [];
  for (let inicio = firstDay; inicio <= lastDay;) {
    const fin = new Date(inicio);
    fin.setDate(Math.min(fin.getDate() + 6, lastDay.getDate()));
    const startKey = calendarKey(inicio);
    const endKey = calendarKey(fin);
    month.push({
      numero: month.length + 1, inicio: new Date(inicio), fin,
      citas: ordered.filter((appointment) => {
        const key = dateKey(appointment.scheduledAt, timezone);
        return key >= startKey && key <= endKey;
      }),
    });
    inicio = new Date(fin);
    inicio.setDate(inicio.getDate() + 1);
  }
  return { dayAppointments, week, month };
}

export function daySlots(appointments: Details[]) {
  const hours = appointments.map((appointment) => Number(appointment.hora.split(":")[0]))
    .filter((hour) => Number.isInteger(hour) && hour >= 0 && hour <= 23);
  const first = Math.min(9, ...hours);
  const last = Math.max(16, ...hours);
  return Array.from({ length: last - first + 1 }, (_, index) => `${String(first + index).padStart(2, "0")}:00`);
}
