import { Injectable } from "@nestjs/common";
import { CitaRepository } from "../../domain/repositories/cita.repository";

@Injectable()
export class FindByClientIdUseCase {
  constructor(
    private readonly citaRepo: CitaRepository,
  ) {}

  execute(clientId: string) {
    if (!clientId) throw new Error("clientId es requerido");
    return this.citaRepo.findByClientId(clientId);
  }
}
