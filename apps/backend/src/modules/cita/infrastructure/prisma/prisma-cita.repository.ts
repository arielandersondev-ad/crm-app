import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { CitaEntity } from "../../domain/entities/cita.entity";
import { CitaRepository } from "../../domain/repositories/cita.repository";

@Injectable()
export class PrismaCitaRepository implements CitaRepository {
  constructor(
    private readonly prisma: PrismaService
  ){}

  async create(data: Omit<CitaEntity, 'id'|'createdAt'|'updatedAt'|'status'>): Promise<CitaEntity> {
    const cita = await this.prisma.appointment.create({
      data
      /* : {
        tenantId: data.tenantId,
        sucursalId: data.sucursalId,
        clientId: data.clientId,
        userId: data.userId,
        scheduledAt: data.scheduledAt,
        status: data.status,
      }, */
    })
    return new CitaEntity(
      cita.id,
      cita.tenantId,
      cita.sucursalId,
      cita.clientId,
      cita.userId,
      cita.scheduledAt,
      cita.status,
      cita.createdAt,
      cita.updatedAt,
    )
  }

  async update(data: Omit<CitaEntity, 'createdAt'|'updatedAt'>): Promise<CitaEntity> {
    const {id, tenantId, sucursalId, ...rest} = data
    const cita = await this.prisma.appointment.update({
      where:{
        id,
        tenantId,
        sucursalId
      },
      data: rest
    })
    return new CitaEntity(
      cita.id,
      cita.tenantId,
      cita.sucursalId,
      cita.clientId,
      cita.userId,
      cita.scheduledAt,
      cita.status,
      cita.createdAt,
      cita.updatedAt,
    )
  }

  async findAllBySucursal(tenantId: string, sucursalId: string): Promise<CitaEntity[]>{
    const citas = await this.prisma.appointment.findMany({
      where:{
        sucursalId,
        tenantId
      }
    })
    return citas.map((cita)=> new CitaEntity(
      cita.id,
      cita.tenantId,
      cita.sucursalId,
      cita.clientId,
      cita.userId,
      cita.scheduledAt,
      cita.status,
      cita.createdAt,
      cita.updatedAt,
    ))
  }

  async findById(id:string,sucursalId: string, tenantId: string): Promise<CitaEntity>{
    const cita = await this.prisma.appointment.findUnique({
      where:{
        id,
        sucursalId,
        tenantId
      }
    })
    return new CitaEntity(
      cita.id,
      cita.tenantId,
      cita.sucursalId,
      cita.clientId,
      cita.userId,
      cita.scheduledAt,
      cita.status,
      cita.createdAt,
      cita.updatedAt,
    )
  }
  
  async softDelete(id: string, tenantId: string, sucursalId: string): Promise<CitaEntity>{
    const cita = await this.prisma.appointment.update({
      where:{
        id,
        sucursalId,
        tenantId,
      },
      data:{
        status: 'CANCELLED'
      }
    })
    return new CitaEntity(
      cita.id,
      cita.tenantId,
      cita.sucursalId,
      cita.clientId,
      cita.userId,
      cita.scheduledAt,
      cita.status,
      cita.createdAt,
      cita.updatedAt,
    )
  }
  async findByClientId(clientId: string): Promise<CitaEntity[]>{
    const citas = await this.prisma.appointment.findMany({
      where: { clientId },
      orderBy: { scheduledAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    })
    return citas.map((cita) => new CitaEntity(
      cita.id,
      cita.tenantId,
      cita.sucursalId,
      cita.clientId,
      cita.userId,
      cita.scheduledAt,
      cita.status,
      cita.createdAt,
      cita.updatedAt,
    ))
  }

  async getAgenda(tenantId: string, sucursalId: string): Promise<any[]>{
    const citas = await this.prisma.appointment.findMany({
      where:{
        sucursalId,
        tenantId
      },
      select:{
        id: true,
        clientId: true,
        status: true,
        scheduledAt: true,
        client: {
          select: {
            fullName: true
          }
        },
        user: {
          select: {
            firstName:true,
            lastName:true
          }
        },
        visit: true
      }
    })
    return citas
  }
}