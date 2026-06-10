import { Injectable } from "@nestjs/common";
import { VisitRepository } from "../domain/repositories/visit.repository";
import { UpdateVisitDto } from "../presentation/dto/update-visit.dto";
import { VisitEntity } from "../domain/entities/visit.entity";

@Injectable()
export class UpdateVisitUseCase {
  constructor(
    private readonly visitRepo: VisitRepository,
  ) {}
  execute( tenantId: string, sucursalId: string, id: string, userId: string, updateVisitDto: UpdateVisitDto): Promise<VisitEntity> {
    if (!sucursalId) throw new Error('Sucursal ID es requerido')
    if (!tenantId) throw new Error('Tenant ID es requerido')
    if (!id) throw new Error('ID es requerido')
    if (!userId) throw new Error('User ID es requerido')
    return this.visitRepo.update(tenantId, sucursalId, id, userId, updateVisitDto);
  }
}