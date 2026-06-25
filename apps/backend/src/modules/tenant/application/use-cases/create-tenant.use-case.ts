import { Injectable } from "@nestjs/common";
import { TenantRepository } from "../../domain/repositories/tenant.repository";
import { CreateTenantDto } from "../../presentation/dto/create-tenant.dto";
import { Plan } from "@prisma/client";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";

@Injectable()
export class CreateTenantUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantRepo: TenantRepository
  ) {}

  async execute(dto: CreateTenantDto) {
    if (!dto.name || dto.name.trim() === '') {
      throw new Error('El nombre es requerido');
    }
    
    if (dto.plan && !Object.values(Plan).includes(dto.plan)) {
      throw new Error('Plan inválido');
    }

    const plan = dto.plan || Plan.FREE;
    return this.tenantRepo.create(this.prisma, dto.name, plan);
  }
}
