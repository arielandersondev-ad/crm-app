import { Injectable } from "@nestjs/common";
import { VisitRepository } from "../domain/repositories/visit.repository";
import { CreateVisitDto } from "../presentation/dto/create-visit.dto";
import { VisitEntity } from "../domain/entities/visit.entity";

@Injectable()
export class CreateVisitUseCase {
  constructor(
    private readonly visitRepo: VisitRepository,
  ) {}
  async execute(createVisitDto: CreateVisitDto, tenantId: string, sucursalId: string, userId: string): Promise<VisitEntity> {
    if (!sucursalId) throw new Error('Sucursal ID is requerido')
    if (!tenantId) throw new Error('Tenant ID is requerido')
    return this.visitRepo.create(tenantId, sucursalId, userId, createVisitDto);
  }
}