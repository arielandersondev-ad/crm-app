import { CreateVisitDto } from "../../presentation/dto/create-visit.dto";
import { UpdateVisitDto } from "../../presentation/dto/update-visit.dto";
import { VisitEntity } from "../entities/visit.entity";

export abstract class VisitRepository {
  abstract findAll(tenantId: string): Promise<VisitEntity[]>;
  abstract findAllBySucursalId(tenantId: string, sucursalId: string): Promise<VisitEntity[]>;
  abstract findById(tenantId: string, id: string): Promise<VisitEntity | null>;
  abstract create(tenantId: string, sucursalId: string, userId: string, data: CreateVisitDto): Promise<VisitEntity>;
  abstract update(tenantId: string, id: string, sucursalId: string, userId: string, data: UpdateVisitDto): Promise<VisitEntity>;
  abstract softDelete(tenantId: string, id: string, sucursalId: string): Promise<void>;
  abstract findAllBySucursalIdComplete(tenantId: string, sucursalId: string): Promise<any[]>;
}