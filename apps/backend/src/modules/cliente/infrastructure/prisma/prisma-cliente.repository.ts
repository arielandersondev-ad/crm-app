import { Injectable } from "@nestjs/common";
import { ClienteRepository } from "../../domain/repository/cliente.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { Cliente } from "../../domain/entities/cliente.entity";

@Injectable()
export class PrismaClienteRepository implements ClienteRepository {
  constructor(
    private prisma: PrismaService
  ) {}

  private toEntity(item: any): Cliente {
    return new Cliente(
      item.id,
      item.tenantId,
      item.type,
      item.fullName,
      item.phone,
      item.email,
      item.documentNumber ?? '',
      item.birthDate?.toISOString().substring(0, 10) || '',
      item.address ?? '',
      item.notes ?? '',
      item.isActive,
      item.createdAt,
      item.updatedAt,
    );
  }

  async findAll(): Promise<Cliente[]> {
    const clientes = await this.prisma.client.findMany();
    return clientes.map((item) => this.toEntity(item));
  }
  async findByTenantIdActivo(tenantId: string): Promise<Cliente[]> {
    const clientes = await this.prisma.client.findMany({
      where: {
        tenantId: tenantId,
        isActive: true,
      },
    });
    return clientes.map((item) => this.toEntity(item));
  }
  async findById(id: string): Promise<Cliente> {
    const cliente = await this.prisma.client.findUnique({
      where: {
        id: id,
      },
    });
    if (!cliente) return null;
    return this.toEntity(cliente);
  }
  async findByTenantId(tenantId: string): Promise<Cliente[]> {
    const clientes = await this.prisma.client.findMany({
      where: {
        tenantId: tenantId,
      },
    });
    return clientes.map((item) => this.toEntity(item));
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
    return this.toEntity(clienteCreated);
  }
  async update (id: string, tenantId: string, fullname: string, email: string, phone: string, documentNumber: string, birthday?: string, address?: string, notes?: string, isActive?: boolean): Promise<Cliente> {
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
    return this.toEntity(clienteUpdated);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: {
        id: id,
      },
    });
  }
  async softDeleteById(tenantId: string, id: string): Promise<void> {
    await this.prisma.client.update({
      where: {
        tenantId: tenantId,
        id: id,
      },
      data: {
        isActive: false,
      },
    });
  }
  async restore(tenantId: string, id: string): Promise<void> {
    await this.prisma.client.update({
      where: {
        tenantId: tenantId,
        id: id,
      },
      data: {
        isActive: true,
      },
    });
  }
}