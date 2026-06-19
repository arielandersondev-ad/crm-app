import { Injectable } from "@nestjs/common";
import { SucursalRepository } from "../../domain/repositories/sucursal.repository";
import { CreateSucursalDto } from "../../presentation/dto/create-sucursal.dto";
import { TenantRepository } from "../../../tenant/domain/repositories/tenant.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";

@Injectable()
export class CreateSucursalUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sucursalRepository: SucursalRepository,
    private readonly tenantRepository: TenantRepository,
  ){}
  async execute(dto: CreateSucursalDto) {

    const validTenantId = await this.tenantRepository.findOne(dto.tenantId);
    //console.log(validTenantId);
    if (!validTenantId) {
      throw new Error('El tenantId no existe');
    }
    return this.sucursalRepository.create(this.prisma, dto.name, dto.direccion, dto.latitude, dto.longitude, dto.telefono, dto.correo, dto.timezone || 'America/La_Paz', dto.tenantId);
  }
}
