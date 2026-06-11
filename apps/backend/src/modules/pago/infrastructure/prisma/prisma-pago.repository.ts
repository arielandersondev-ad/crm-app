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
      pagoCreado.createdAt
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
      pagoActualizado.createdAt
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
      pago.createdAt
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
      pagoObtenido.createdAt
    )
  }
  async findByVisitId(visitId: string): Promise<PagoEntity[]> {
    const pagoObtenido = await this.prisma.payment.findMany({
      where: {
        id: visitId
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
      pago.createdAt
    ))
  }
}