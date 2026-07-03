import { Injectable } from "@nestjs/common";
import { BranchScheduleRepository } from "../../../branch-schedule/domain/repositories/branch-schedule.repository";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";
import type { ChatResponse } from "../../domain/interfaces/chatbot.interface";

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

@Injectable()
export class ScheduleHandler {
  constructor(
    private readonly scheduleRepo: BranchScheduleRepository,
    private readonly sucursalRepo: SucursalRepository,
  ) {}

  async tryHandle(question: string, tenantId: string): Promise<ChatResponse | null> {
    const normalized = question.toLowerCase().trim();

    const scheduleKeywords = [
      /horario/i, /atienden/i, /abren/i, /abierto/i, /cerrado/i, /cierran/i,
      /hora/i, /d[ií]as/i, /abre/i, /cierra/i, /atenci[oó]n/i,
    ];

    const isScheduleQuestion = scheduleKeywords.some((rx) => rx.test(normalized));
    if (!isScheduleQuestion) return null;

    const sucursales = await this.sucursalRepo.findByTenantId(tenantId);
    if (!sucursales || sucursales.length === 0) return null;

    const sucursal = sucursales.find((s) => s.isDefault) ?? sucursales[0];
    const schedules = await this.scheduleRepo.findBySucursalId(sucursal.id);

    const lines = schedules
      .filter((s) => s.isOpen)
      .map((s) => `  ${DAY_LABELS[s.dayOfWeek] ?? s.dayOfWeek}: ${s.openTime ?? "—"} a ${s.closeTime ?? "—"}`);

    if (lines.length > 0) {
      const answer = `Horarios de atención — ${sucursal.name}\n\n${lines.join("\n")}\n\n${sucursal.direccion ? `📍 ${sucursal.direccion}` : ""}`;
      return { answer, source: "FAQ", confidence: 1 };
    }

    return {
      answer: `Actualmente no tenemos horarios registrados para ${sucursal.name}. Comuníquese con recepción para más información.`,
      source: "Fallback",
      confidence: 0,
    };
  }
}
