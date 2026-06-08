import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { CreateVisitDto } from "../../presentation/dto/create-visit.dto";
import { VisitEntity } from "../../domain/entities/visit.entity";
import { UpdateVisitDto } from "../../presentation/dto/update-visit.dto";
import { VisitRepository } from "../../domain/repositories/visit.repository";
import { VisitStatus } from "@prisma/client";

@Injectable()
export class PrismaVisitaRepository implements VisitRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}   
  async findAll(tenantId: string): Promise<VisitEntity[]> {
    const prismaResult = await this.prisma.visit.findMany({  
      where: {
        tenantId,
      }
    })
    return prismaResult.map((visit) => new VisitEntity(
      visit.id,
      visit.tenantId,
      visit.sucursalId,
      visit.clientId,
      visit.userId,
      visit.appointmentId,
      visit.status,
      visit.notes,
      visit.startedAt?.toISOString(),
      visit.completedAt?.toISOString(),
      visit.createdAt,
      visit.updatedAt,
    ))
  }
  async findAllBySucursalId(tenantId: string, sucursalId: string): Promise<VisitEntity[]> {
    const prismaResult = await this.prisma.visit.findMany({
      where: {
        tenantId,
        sucursalId,
      }
    })
    return prismaResult.map((visit) => new VisitEntity(
      visit.id,
      visit.tenantId,
      visit.sucursalId,
      visit.clientId,
      visit.userId,
      visit.appointmentId,
      visit.status,
      visit.notes,
      visit.startedAt?.toISOString(),
      visit.completedAt?.toISOString(),
      visit.createdAt,
      visit.updatedAt,
    ))
  }
  async findAllBySucursalIdComplete(tenantId: string, sucursalId: string): Promise<VisitEntity[]> {
    const prismaResult = await this.prisma.visit.findMany({
      where: {
        tenantId,
        sucursalId,
      }
    })
    return prismaResult.map((visit) => new VisitEntity(
      visit.id,
      visit.tenantId,
      visit.sucursalId,
      visit.clientId,
      visit.userId,
      visit.appointmentId,
      visit.status,
      visit.notes,
      visit.startedAt?.toISOString(),
      visit.completedAt?.toISOString(),
      visit.createdAt,
      visit.updatedAt,
    ))
  }
  async findById(tenantId: string, id: string): Promise<VisitEntity | null> {
    const prismaResult = await this.prisma.visit.findUnique({
      where: {
        tenantId,
        id,
      }
    })
    if (!prismaResult) {
      return null
    }
    return new VisitEntity(
      prismaResult.id,
      prismaResult.tenantId,
      prismaResult.sucursalId,
      prismaResult.clientId,
      prismaResult.userId,
      prismaResult.appointmentId,
      prismaResult.status,
      prismaResult.notes,
      prismaResult.startedAt?.toISOString(),
      prismaResult.completedAt?.toISOString(),
      prismaResult.createdAt,
      prismaResult.updatedAt,
    )
  }
  async create(tenantId: string, sucursalId: string, userId: string, data: CreateVisitDto): Promise<VisitEntity> {
    const prismaResult = await this.prisma.visit.create({
      data: {
        tenantId,
        sucursalId,
        clientId: data.clientId,
        userId,
        appointmentId: data.appointmentId,
        notes: data.notes,
        status: data.status as any,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      }
    })
    return new VisitEntity(
      prismaResult.id,
      prismaResult.tenantId,
      prismaResult.sucursalId,
      prismaResult.clientId,
      prismaResult.userId,
      prismaResult.appointmentId,
      prismaResult.status,
      prismaResult.notes,
      prismaResult.startedAt?.toISOString(),
      prismaResult.completedAt?.toISOString(),
      prismaResult.createdAt,
      prismaResult.updatedAt,
    )
  }
  async update(tenantId: string, id: string, sucursalId: string, userId: string, data: UpdateVisitDto): Promise<VisitEntity> {
    const prismaResult = await this.prisma.visit.update({
      where: {
        tenantId,
        id,
        sucursalId,
      },
      data: {
        tenantId,
        sucursalId,
        clientId: data.clientId,
        userId,
        appointmentId: data.appointmentId,
        notes: data.notes,
        status: data.status as any,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      }
    })
    return new VisitEntity(
      prismaResult.id,
      prismaResult.tenantId,
      prismaResult.sucursalId,
      prismaResult.clientId,
      prismaResult.userId,
      prismaResult.appointmentId,
      prismaResult.status,
      prismaResult.notes,
      prismaResult.startedAt?.toISOString(),
      prismaResult.completedAt?.toISOString(),
      prismaResult.createdAt,
      prismaResult.updatedAt,
    )
  }
  async delete(tenantId: string, id: string, sucursalId: string): Promise<void> {
    await this.prisma.visit.delete({
      where: {
        tenantId,
        id,
        sucursalId,
      }
    })
  }
  async softDelete(tenantId: string, id: string, sucursalId: string): Promise<void> {
    await this.prisma.visit.update({
      where: {
        tenantId,
        id,
        sucursalId,
      },
      data: {
        status: VisitStatus.CANCELLED,
      }
    })
  }
}