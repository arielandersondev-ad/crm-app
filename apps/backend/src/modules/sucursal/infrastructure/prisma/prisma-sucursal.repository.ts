import { Injectable, NotFoundException } from "@nestjs/common";
import { SucursalRepository } from "../../domain/repositories/sucursal.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { Sucursal } from "../../domain/entities/sucursal.entity";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaSucursalRepository implements SucursalRepository {
  constructor (private prisma: PrismaService) {}

  async findAll(): Promise<Sucursal[]> {
    const sucursales = await this.prisma.sucursal.findMany();
    return sucursales.map(s => this.toEntity(s));
  }

  async findById(id: string): Promise<Sucursal | null> {
    const sucursal = await this.prisma.sucursal.findUnique({ where: { id } });
    if (!sucursal) return null;
    return this.toEntity(sucursal);
  }

  async findByTenantId(tenantId: string): Promise<Sucursal[] | null> {
    const sucursales = await this.prisma.sucursal.findMany({ where: { tenantId } });
    if (!sucursales) return null;
    return sucursales.map(s => this.toEntity(s));
  }

  async create(db: PrismaService | Prisma.TransactionClient, name: string, direccion: string, latitude: number, longitude: number, telefono: string, correo: string, timezone: string, tenantId: string): Promise<Sucursal> {
    const created = await db.sucursal.create({
      data: { name, direccion, latitude, longitude, telefono, correo, timezone, tenantId }
    });
    return this.toEntity(created);
  }

  async update(id: string, name: string, direccion: string, latitude: number, longitude: number, telefono: string, correo: string, timezone?: string, avgConsultationMinutes?: number, intervalBetweenAppointments?: number, autoNoShowMinutes?: number): Promise<Sucursal> {
    try {
      const updated = await this.prisma.sucursal.update({
        where: { id },
        data: {
          name, direccion, latitude, longitude, telefono, correo,
          ...(timezone && { timezone }),
          ...(avgConsultationMinutes !== undefined && { avgConsultationMinutes }),
          ...(intervalBetweenAppointments !== undefined && { intervalBetweenAppointments }),
          ...(autoNoShowMinutes !== undefined && { autoNoShowMinutes }),
        }
      });
      return this.toEntity(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Sucursal no encontrada');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Sucursal> {
    try {
      const deleted = await this.prisma.sucursal.delete({ where: { id } });
      return this.toEntity(deleted);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Sucursal no encontrada');
      }
      throw error;
    }
  }

  private toEntity(s: any): Sucursal {
    return new Sucursal(
      s.id, s.tenantId, s.name, s.direccion,
      s.latitude, s.longitude, s.telefono, s.correo,
      s.isDefault, s.timezone,
      s.avgConsultationMinutes ?? 30,
      s.intervalBetweenAppointments ?? 5,
      s.autoNoShowMinutes ?? 30,
    );
  }
}
