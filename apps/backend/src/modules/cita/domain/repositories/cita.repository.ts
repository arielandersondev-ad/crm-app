import { CitaEntity } from "../entities/cita.entity";

export abstract class CitaRepository{
  abstract create(data: Omit<CitaEntity, 'id'|'createdAt'|'updatedAt'|'status'>): Promise<CitaEntity>
  abstract update(data: Omit<CitaEntity, 'createdAt'|'updatedAt'>): Promise<CitaEntity>
  abstract findAllBySucursal(sucursalId: string, tenantId: string): Promise<CitaEntity[]>
  abstract findById(id:string,sucursalId: string, tenantId: string): Promise<CitaEntity>
  abstract softDelete(id: string, tenantId: string, sucursalId: string): Promise<CitaEntity>
  abstract findByClientId(clientId: string): Promise<CitaEntity[]>
  abstract getAgenda(tenantId: string, sucursalId: string)
}