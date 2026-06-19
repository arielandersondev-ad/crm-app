import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { VisitDetailEntity } from "../../domain/entities/visit-detail.entity";
import { VisitDetailRepository } from "../../domain/repositories/visit-detail.repository";

@Injectable()
export class PrismaVisitDetailRepository implements VisitDetailRepository {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  async create(visitDetail: Omit<VisitDetailEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<VisitDetailEntity> {
    const visitDetailEntity = await this.prisma.visitDetail.create({
      data: visitDetail
    })
    return new VisitDetailEntity(
      visitDetailEntity.id, 
      visitDetailEntity.visitId, 
      visitDetailEntity.serviceId, 
      visitDetailEntity.quantity, 
      visitDetailEntity.serviceName, 
      visitDetailEntity.unitPrice.toNumber(), 
      visitDetailEntity.totalPrice.toNumber(), 
      visitDetailEntity.notes, 
      visitDetailEntity.createdAt, 
      visitDetailEntity.updatedAt,
    )
  }
  async createMany(visitDetails: Omit<VisitDetailEntity,'id' | 'createdAt' | 'updatedAt'>[]): Promise<VisitDetailEntity[]> {
    const result =
      await this.prisma.$transaction(
        visitDetails.map(detail =>
          this.prisma.visitDetail.create({
            data: detail,
          })
        )
      );
    return result.map(
      detail =>
        new VisitDetailEntity(
          detail.id,
          detail.visitId,
          detail.serviceId,
          detail.quantity,
          detail.serviceName,
          detail.unitPrice.toNumber(),
          detail.totalPrice.toNumber(),
          detail.notes,
          detail.createdAt,
          detail.updatedAt
        )
    );
  }
  async update(visitDetail: Partial<VisitDetailEntity> & { id: string }): Promise<VisitDetailEntity> {
    const visitDetailEntity = await this.prisma.visitDetail.update({
      where: {
        id: visitDetail.id
      },
      data: visitDetail
    })
    return new VisitDetailEntity(
      visitDetailEntity.id, 
      visitDetailEntity.visitId, 
      visitDetailEntity.serviceId, 
      visitDetailEntity.quantity, 
      visitDetailEntity.serviceName, 
      visitDetailEntity.unitPrice.toNumber(), 
      visitDetailEntity.totalPrice.toNumber(), 
      visitDetailEntity.notes, 
      visitDetailEntity.createdAt, 
      visitDetailEntity.updatedAt,
    )
  }
  async findById(id: string): Promise<VisitDetailEntity> {
    const visitDetailEntity = await this.prisma.visitDetail.findUnique({
      where: {
        id: id
      }
    })
    if (!visitDetailEntity) throw new Error('no se encontro el detalle de la visita')
    return new VisitDetailEntity(
      visitDetailEntity.id, 
      visitDetailEntity.visitId, 
      visitDetailEntity.serviceId, 
      visitDetailEntity.quantity, 
      visitDetailEntity.serviceName, 
      visitDetailEntity.unitPrice.toNumber(), 
      visitDetailEntity.totalPrice.toNumber(), 
      visitDetailEntity.notes, 
      visitDetailEntity.createdAt, 
      visitDetailEntity.updatedAt,
    )
  }
  async findByVisitId(visitId: string): Promise<VisitDetailEntity[]> {
    const visitDetailsEntities = await this.prisma.visitDetail.findMany({
      where: {
        visitId: visitId
      }
    })
    return visitDetailsEntities.map(
      detail =>
        new VisitDetailEntity(
          detail.id,
          detail.visitId,
          detail.serviceId,
          detail.quantity,
          detail.serviceName,
          detail.unitPrice.toNumber(),
          detail.totalPrice.toNumber(),
          detail.notes,
          detail.createdAt,
          detail.updatedAt
        )
    )
  }
  async delete(id: string): Promise<VisitDetailEntity> {
    const visitDetailEntity = await this.prisma.visitDetail.delete({
      where: {
        id: id
      }
    })
    return new VisitDetailEntity(
      visitDetailEntity.id, 
      visitDetailEntity.visitId, 
      visitDetailEntity.serviceId, 
      visitDetailEntity.quantity, 
      visitDetailEntity.serviceName, 
      visitDetailEntity.unitPrice.toNumber(), 
      visitDetailEntity.totalPrice.toNumber(), 
      visitDetailEntity.notes, 
      visitDetailEntity.createdAt, 
      visitDetailEntity.updatedAt,
    )
  }
}