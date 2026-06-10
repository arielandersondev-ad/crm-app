import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { VisitDetailEntity } from "../../domain/entities/visit-detail.entity";
import { CreateVisitDetailDto } from "../../presentation/dto/create-visit-detail.dto";
import { UpdateVisitDetailDto } from "../../presentation/dto/update-visit-detail.dto";
import { VisitDetailRepository } from "../../domain/repositories/visit-detail.repository";

@Injectable()
export class PrismaVisitDetailRepository implements VisitDetailRepository {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  async create(visitDetail: CreateVisitDetailDto): Promise<VisitDetailEntity> {
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
  async update(visitDetail: UpdateVisitDetailDto): Promise<VisitDetailEntity> {
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
}