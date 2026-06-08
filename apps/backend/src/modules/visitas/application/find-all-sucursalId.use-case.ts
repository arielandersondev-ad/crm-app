import { Injectable } from "@nestjs/common";
import { VisitRepository } from "../domain/repositories/visit.repository";
import { VisitEntity } from "../domain/entities/visit.entity";

@Injectable()
export class FindAllBySucursalIdUseCase {
  constructor(
    private readonly visitRepo: VisitRepository,
  ) {}
  execute(tenantId: string, sucursalId: string, status?: string): Promise<VisitEntity[]> {
    if (!sucursalId) throw new Error('Sucursal ID is requerido')
    if (!tenantId) throw new Error('Tenant ID is requerido')
    if (status === 'complete') {
      return this.visitRepo.findAllBySucursalIdComplete(tenantId, sucursalId);
    }
    return this.visitRepo.findAllBySucursalId(tenantId, sucursalId);
  }
}