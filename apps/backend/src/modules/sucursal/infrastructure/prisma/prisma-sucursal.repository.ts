import { Injectable } from "@nestjs/common";
import { SucursalRepository } from "../../domain/repositories/sucursal.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { Sucursal } from "../../domain/entities/sucursal.entity";

@Injectable()
export class PrismaSucursalRepository implements SucursalRepository {
  constructor (private prisma: PrismaService) {}

  async findAll(): Promise<Sucursal[]> {
    const sucursales = await this.prisma.sucursal.findMany();
    return sucursales.map(sucursal => new Sucursal(
      sucursal.id,
      sucursal.name,
      sucursal.direccion,
      sucursal.latitude,
      sucursal.longitude,
      sucursal.telefono,
      sucursal.correo,
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
      sucursal.name,
      sucursal.direccion,
      sucursal.latitude,
      sucursal.longitude,
      sucursal.telefono,
      sucursal.correo,
    );
  }

  async create(name: string, direccion: string, latitude: number, longitude: number, telefono: string, correo: string, tenantId: string): Promise<Sucursal> {
    const createdSucursal = await this.prisma.sucursal.create({
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
      createdSucursal.name,
      createdSucursal.direccion,
      createdSucursal.latitude,
      createdSucursal.longitude,
      createdSucursal.telefono,
      createdSucursal.correo,
    );
  }
}