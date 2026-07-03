import { Prisma } from "@prisma/client";
import { Sucursal } from "../entities/sucursal.entity";

export abstract class SucursalRepository {
  abstract findAll(): Promise<Sucursal[]>;
  abstract findById(id: string): Promise<Sucursal | null>;
  abstract findByTenantId(tenantId: string): Promise<Sucursal[] | null>;
  abstract create(tx: Prisma.TransactionClient, name: string, direccion: string, latitude: number, longitude: number, telefono: string, correo: string, timezone: string, tenantId: string): Promise<Sucursal>;
  abstract update(id: string, name: string, direccion: string, latitude: number, longitude: number, telefono: string, correo: string, timezone?: string, avgConsultationMinutes?: number, intervalBetweenAppointments?: number, autoNoShowMinutes?: number): Promise<Sucursal>;
  abstract delete(id: string): Promise<Sucursal>;
}
