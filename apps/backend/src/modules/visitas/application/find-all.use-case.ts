import { Injectable } from "@nestjs/common";
import { VisitRepository } from "../domain/repositories/visit.repository";
import { VisitEntity } from "../domain/entities/visit.entity";

@Injectable()
export class FindAllVisitUseCase {
  constructor(
    private readonly visitRepo: VisitRepository,
  ) {}
  execute(tenantId: string): Promise<VisitEntity[]> {
    if (!tenantId) throw new Error('Tenant ID is requerido')
    return this.visitRepo.findAll(tenantId);
  }
}