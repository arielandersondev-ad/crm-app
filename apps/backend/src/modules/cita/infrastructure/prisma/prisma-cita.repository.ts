import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { CitaEntity } from "../../domain/entities/cita.entity";
import { CitaRepository } from "../../domain/repositories/cita.repository";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

@Injectable()
export class PrismaCitaRepository implements CitaRepository {
  constructor(
    private readonly prisma: PrismaService
  ){}

  private generateCode(): string {
    let code = "APT-";
    for (let i = 0; i < 6; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    return code;
  }

  async create(data: Omit<CitaEntity, 'id'|'createdAt'|'updatedAt'|'status'>): Promise<CitaEntity> {
    let appointmentCode = (data as any).appointmentCode;
    if (!appointmentCode) {
      do {
        appointmentCode = this.generateCode();
      } while (await this.existsByCode(appointmentCode));
    }
    const cita = await this.prisma.appointment.create({
      data: { ...data, appointmentCode } as any,
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
      cita.appointmentCode,
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
      cita.appointmentCode,
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
      cita.appointmentCode,
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
      cita.appointmentCode,
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
      cita.appointmentCode,
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
      cita.appointmentCode,
    ))
  }

  async findByCodeAndDocument(code: string, documentNumber: string, tenantId: string): Promise<CitaEntity | null> {
    const cita = await this.prisma.appointment.findFirst({
      where: {
        appointmentCode: code,
        tenantId,
        client: { documentNumber },
      },
      include: {
        client: { select: { documentNumber: true } },
        user: { select: { firstName: true, lastName: true } },
      },
    });
    if (!cita) return null;
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
      cita.appointmentCode,
    );
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.prisma.appointment.count({
      where: { appointmentCode: code },
    });
    return count > 0;
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
        appointmentCode: true,
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
        visit: true,
        consultation: {
          select: { id: true, status: true },
        }
      }
    })
    return citas
  }
}