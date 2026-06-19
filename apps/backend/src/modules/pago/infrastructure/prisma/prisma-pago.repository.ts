import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { PagoEntity } from "../../domain/entities/entity";
import { PagoRepository } from "../../domain/repositories/pago.repository";

@Injectable()
export class PrismaPagoRepository implements PagoRepository {
  constructor(
    private readonly prisma: PrismaService
  ){}

  async create (data: Omit<PagoEntity, 'id' | 'createdAt' | 'paidAt'>): Promise<PagoEntity> {
    const pagoCreado = await this.prisma.payment.create({data})
    return new PagoEntity(
      pagoCreado.id,
      pagoCreado.visitId,
      pagoCreado.sucursalId,
      pagoCreado.amount.toNumber(),
      pagoCreado.method,
      pagoCreado.reference,
      pagoCreado.notes,
      pagoCreado.paidAt,
      pagoCreado.status,
      pagoCreado.createdAt,
      pagoCreado.voidedAt,
    )
  }
  async update (data: Partial<PagoEntity> & {id: string}): Promise<PagoEntity> {
    const pagoActualizado = await this.prisma.payment.update({
      where: {
        id: data.id
      },
      data: data
    })
    return new PagoEntity(
      pagoActualizado.id,
      pagoActualizado.visitId,
      pagoActualizado.sucursalId,
      pagoActualizado.amount.toNumber(),
      pagoActualizado.method,
      pagoActualizado.reference,
      pagoActualizado.notes,
      pagoActualizado.paidAt,
      pagoActualizado.status,
      pagoActualizado.createdAt,
      pagoActualizado.voidedAt
    )
  }
  async findAll(): Promise<PagoEntity[]> {
    const pagoObtenido = await this.prisma.payment.findMany()
    return pagoObtenido.map((pago) => new PagoEntity(
      pago.id,
      pago.visitId,
      pago.sucursalId,
      pago.amount.toNumber(),
      pago.method,
      pago.reference,
      pago.notes,
      pago.paidAt,
      pago.status,
      pago.createdAt,
      pago.voidedAt,
    ))
  }
  async findById(id: string): Promise<PagoEntity> {
    const pagoObtenido = await this.prisma.payment.findFirst({
      where: {
        id 
      }
    })
    return new PagoEntity(
      pagoObtenido.id,
      pagoObtenido.visitId,
      pagoObtenido.sucursalId,
      pagoObtenido.amount.toNumber(),
      pagoObtenido.method,
      pagoObtenido.reference,
      pagoObtenido.notes,
      pagoObtenido.paidAt,
      pagoObtenido.status,
      pagoObtenido.createdAt,
      pagoObtenido.voidedAt,
    )
  }
  async findByVisitId(visitId: string): Promise<PagoEntity[]> {
    const pagoObtenido = await this.prisma.payment.findMany({
      where: {
        visitId
      }
    })
    return pagoObtenido.map((pago) => new PagoEntity(
      pago.id,
      pago.visitId,
      pago.sucursalId,
      pago.amount.toNumber(),
      pago.method,
      pago.reference,
      pago.notes,
      pago.paidAt,
      pago.status,
      pago.createdAt,
      pago.voidedAt,
    ))
  }
  async desactivar(id: string): Promise<PagoEntity> {
    const pagoDescartado = await this.prisma.payment.update({
      where: {
        id
      },
      data: {
        status: 'VOIDED',
        voidedAt: new Date()
      }
    })
    return new PagoEntity(
      pagoDescartado.id,
      pagoDescartado.visitId,
      pagoDescartado.sucursalId,
      pagoDescartado.amount.toNumber(),
      pagoDescartado.method,
      pagoDescartado.reference,
      pagoDescartado.notes,
      pagoDescartado.paidAt,
      pagoDescartado.status,
      pagoDescartado.createdAt,
      pagoDescartado.voidedAt,
    )
  }
  async activar(id: string): Promise<PagoEntity> {
    const pagoDescartado = await this.prisma.payment.update({
      where: {
        id
      },
      data: {
        status: 'ACTIVE',
        voidedAt: null
      }
    })
    return new PagoEntity(
      pagoDescartado.id,
      pagoDescartado.visitId,
      pagoDescartado.sucursalId,
      pagoDescartado.amount.toNumber(),
      pagoDescartado.method,
      pagoDescartado.reference,
      pagoDescartado.notes,
      pagoDescartado.paidAt,
      pagoDescartado.status,
      pagoDescartado.createdAt,
      pagoDescartado.voidedAt,
    )
  }
}