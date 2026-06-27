import { Injectable } from "@nestjs/common";
import { VisitRepository } from "../domain/repositories/visit.repository";

@Injectable()
export class FindByClientIdUseCase {
  constructor(
    private readonly visitRepo: VisitRepository,
  ) {}

  execute(clientId: string) {
    if (!clientId) throw new Error("clientId es requerido");
    return this.visitRepo.findAllByClientId(clientId);
  }
}
