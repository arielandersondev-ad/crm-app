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
    return sucursales.map(sucursal => new Sucursal(
      sucursal.id,
      sucursal.tenantId,
      sucursal.name,
      sucursal.direccion,
      sucursal.latitude,
      sucursal.longitude,
      sucursal.telefono,
      sucursal.correo,
      sucursal.isDefault,
    ));
  }
  async findById(id: string): Promise<Sucursal | null> {
    const sucursal = await this.prisma.sucursal.findUnique({
      where: {
        id,
      }
    });
    if (!sucursal) {
      return null;
    }
    return new Sucursal(
      sucursal.id,
      sucursal.tenantId,
      sucursal.name,
      sucursal.direccion,
      sucursal.latitude,
      sucursal.longitude,
      sucursal.telefono,
      sucursal.correo,
    );
  }
  async findByTenantId(tenantId: string): Promise<Sucursal[] | null> {
    const sucursal = await this.prisma.sucursal.findMany({
      where: {
        tenantId,
      }
    });
    if (!sucursal) {
      return null;
    }
    return sucursal.map(sucursal => new Sucursal(
      sucursal.id,
      sucursal.tenantId,
      sucursal.name,
      sucursal.direccion,
      sucursal.latitude,
      sucursal.longitude,
      sucursal.telefono,
      sucursal.correo,
    ));
  }

  async create(db: PrismaService | Prisma.TransactionClient, name: string, direccion: string, latitude: number, longitude: number, telefono: string, correo: string, tenantId: string): Promise<Sucursal> {
    const createdSucursal = await db.sucursal.create({
      data: {
        name,
        direccion,
        latitude,
        longitude,
        telefono,
        correo,
        tenantId,
      }
    });
    return new Sucursal(
      createdSucursal.id,
      createdSucursal.tenantId,
      createdSucursal.name,
      createdSucursal.direccion,
      createdSucursal.latitude,
      createdSucursal.longitude,
      createdSucursal.telefono,
      createdSucursal.correo,
    );
  }
  async update(id: string, name: string, direccion: string, latitude: number, longitude: number, telefono: string, correo: string): Promise<Sucursal> {
    
    try {
      const updatedSucursal = await this.prisma.sucursal.update({ 
        where: {
          id,
        },
        data: {
          name,
          direccion,
          latitude,
          longitude,
          telefono,
          correo,
        }
      });
      return new Sucursal(
        updatedSucursal.id,
        updatedSucursal.tenantId,
        updatedSucursal.name,
        updatedSucursal.direccion,
        updatedSucursal.latitude,
        updatedSucursal.longitude,
        updatedSucursal.telefono,
        updatedSucursal.correo,
      );
    } catch (error) {

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Sucursal no encontrada');
      }

      throw error;
    }
   }
  async delete(id: string): Promise<Sucursal> {
    try {
      const deletedSucursal = await this.prisma.sucursal.delete({
        where: {
          id,
        }
      }); 
      return new Sucursal(
        deletedSucursal.id,
        deletedSucursal.tenantId,
        deletedSucursal.name,
        deletedSucursal.direccion,
        deletedSucursal.latitude,
        deletedSucursal.longitude,
        deletedSucursal.telefono,
        deletedSucursal.correo,
      );
    } catch (error) {

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Sucursal no encontrada');
      }

      throw error;
    }
  }
}