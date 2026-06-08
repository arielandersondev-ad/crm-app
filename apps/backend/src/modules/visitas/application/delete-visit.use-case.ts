import { Injectable } from "@nestjs/common";
import { VisitRepository } from "../domain/repositories/visit.repository";

@Injectable()
export class DeleteVisitUseCase {
  constructor(
    private readonly visitRepo: VisitRepository,
  ) {}
  execute(id: string, tenantId: string, sucursalId: string): Promise<void> {
    if (!id) throw new Error('ID is requerido')
    if (!tenantId) throw new Error('Tenant ID is requerido')
    if (!sucursalId) throw new Error('Sucursal ID is requerido')
    return this.visitRepo.softDelete(tenantId, id, sucursalId);
  }
}