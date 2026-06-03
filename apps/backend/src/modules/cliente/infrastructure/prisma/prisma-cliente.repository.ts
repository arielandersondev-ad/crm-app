import { Injectable } from "@nestjs/common";
import { ClienteRepository } from "../../domain/repository/cliente.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { Cliente } from "../../domain/entities/cliente.entity";

@Injectable()
export class PrismaClienteRepository implements ClienteRepository {
  constructor(
    private prisma: PrismaService
  ) {}
  async findAll(): Promise<Cliente[]> {
    const clientes = await this.prisma.client.findMany();
    return clientes.map((item) => ({
      ...item,
      id: item.id,
      tenantId: item.tenantId,
      type: item.type,
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      documentNumber: item.documentNumber,
      birthday: item.birthDate?.toISOString().substring(0, 10) || new Date().toISOString().substring(0, 10).toString(),
      direccion: item.address,
      activo: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }
  async findById(id: string): Promise<Cliente> {
    const cliente = await this.prisma.client.findUnique({
      where: {
        id: id,
      },
    });
    return {
      ...cliente,
      id: cliente.id,
      tenantId: cliente.tenantId,
      type: cliente.type,
      fullName: cliente.fullName,
      email: cliente.email,
      phone: cliente.phone,
      documentNumber: cliente.documentNumber,
      birthday: cliente.birthDate?.toISOString().substring(0, 10) || new Date().toISOString().substring(0, 10).toString(),
      address: cliente.address,
      isActive: cliente.isActive,
      createdAt: cliente.createdAt,
      updatedAt: cliente.updatedAt,
    };
  }
  async findByTenantId(tenantId: string): Promise<Cliente[]> {
    const clientes = await this.prisma.client.findMany({
      where: {
        tenantId: tenantId,
      },
    });
    return clientes.map((item) => ({
      ...item,
      id: item.id,
      tenantId: item.tenantId,
      type: item.type,
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      documentNumber: item.documentNumber,
      birthday: item.birthDate?.toISOString().substring(0, 10) || new Date().toISOString().substring(0, 10).toString(),
      address: item.address,
      notes: item.notes,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }
  async create(tenantId: string, fullname: string, email: string, phone: string, documentNumber?: string, birthday?: string, address?: string, notes?: string): Promise<Cliente> {
    const clienteCreated = await this.prisma.client.create({
      data: {
        tenantId: tenantId,
        type: 'PERSON',
        fullName: fullname,
        email: email,
        phone: phone,
        documentNumber: documentNumber || null,
        birthDate: birthday? new Date(birthday) : null,
        address: address || '',
        notes: notes || '',
        isActive: true,
      },
    });
    return {
      ...clienteCreated,
      id: clienteCreated.id,
      tenantId: clienteCreated.tenantId,
      type: clienteCreated.type,
      fullName: clienteCreated.fullName,
      email: clienteCreated.email,
      phone: clienteCreated.phone,
      documentNumber: clienteCreated.documentNumber,
      notes: clienteCreated.notes,
      birthday: clienteCreated.birthDate?.toISOString().substring(0, 10) || new Date().toISOString().substring(0, 10).toString(),
      address: clienteCreated.address,
      isActive: clienteCreated.isActive,
      createdAt: clienteCreated.createdAt,
      updatedAt: clienteCreated.updatedAt,
    };
  }
  async update (id: string, tenantId: string, fullname: string, email: string, phone: string, documentNumber: string, birthday?: string, address?: string, notes?: string, isActive?: boolean): Promise<Cliente> {
    //console.log({ birthday, type: typeof birthday });
    const clienteUpdated = await this.prisma.client.update({
      where: {
        id: id,
      },
      data: {
        tenantId: tenantId,
        type: 'PERSON',
        fullName: fullname,
        email: email,
        phone: phone,
        documentNumber: documentNumber || null,
        birthDate: birthday? new Date(birthday) : null,
        address: address || '',
        isActive: isActive || true,
        notes: notes || '',
      },
      });
    return {
      ...clienteUpdated,
      id: clienteUpdated.id,
      tenantId: clienteUpdated.tenantId,
      type: clienteUpdated.type,
      fullName: clienteUpdated.fullName,
      email: clienteUpdated.email,
      phone: clienteUpdated.phone,
      documentNumber: clienteUpdated.documentNumber,
      notes: clienteUpdated.notes,
      birthday: clienteUpdated.birthDate?.toISOString().substring(0, 10) || new Date().toISOString().substring(0, 10).toString(),
      address: clienteUpdated.address,
      isActive: clienteUpdated.isActive,
      createdAt: clienteUpdated.createdAt,
      updatedAt: clienteUpdated.updatedAt,
    };
  }
  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: {
        id: id,
      },
    });
  }
  async softDeleteById(id: string): Promise<void> {
    await this.prisma.client.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
      },
    });
  }
  async restore(id: string): Promise<void> {
    await this.prisma.client.update({
      where: {
        id: id,
      },
      data: {
        isActive: true,
      },
    });
  }
}