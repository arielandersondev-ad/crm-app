import { Injectable } from "@nestjs/common";
import { CitaRepository } from "../../../cita/domain/repositories/cita.repository";
import type { ChatResponse } from "../../domain/interfaces/chatbot.interface";

@Injectable()
export class AppointmentStatusHandler {
  constructor(private readonly citaRepo: CitaRepository) {}

  async tryHandle(question: string, tenantId: string): Promise<ChatResponse | null> {
    // Regex: busca patrón APT-XXXXXX y un número de CI (6-15 dígitos)
    const codeMatch = question.match(/APT-[A-Z2-9]{6}/i);
    const ciMatch = question.match(/\b\d{6,15}\b/);

    if (!codeMatch || !ciMatch) return null;

    const code = codeMatch[0].toUpperCase();
    const documentNumber = ciMatch[0];

    const cita = await this.citaRepo.findByCodeAndDocument(code, documentNumber, tenantId);
    if (!cita) {
      return {
        answer: "No fue posible verificar la información. Verifique el código y el documento ingresados.",
        source: "Fallback",
        confidence: 0,
      };
    }

    const statusLabels: Record<string, string> = {
      PENDING: "Pendiente",
      CONFIRMED: "Confirmada",
      COMPLETED: "Atendida",
      CANCELLED: "Cancelada",
      NO_SHOW: "No asistió",
    };

    const dateStr = cita.scheduledAt.toLocaleDateString("es-BO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const timeStr = cita.scheduledAt.toLocaleTimeString("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const answer = `Estado: ${statusLabels[cita.status] ?? cita.status}
Fecha: ${dateStr}
Hora: ${timeStr}
Código: ${cita.appointmentCode}

Si desea reprogramar o cancelar su cita, comuníquese con recepción.`;

    return { answer, source: "FAQ", confidence: 1 };
  }
}
