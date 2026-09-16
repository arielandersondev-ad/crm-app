import { ConflictException, Injectable } from "@nestjs/common";
import { Plan } from "@prisma/client";
import { TenantRepository } from "../../domain/repositories/tenant.repository";
import { UpdateTenantDto } from "../../presentation/dto/update-tenant.dto";

@Injectable()
export class UpdateTenantUseCase {
  constructor(private readonly tenantRepo: TenantRepository) {}

  async execute(dto: UpdateTenantDto) {
    if (!dto.id) {
      throw new Error('El ID es requerido');
    }

    if (dto.plan && !Object.values(Plan).includes(dto.plan)) {
      throw new Error('Plan inválido');
    }

    if (dto.slug) {
      const tenantWithSlug = await this.tenantRepo.findBySlug(dto.slug);
      if (tenantWithSlug && tenantWithSlug.id !== dto.id) {
        throw new ConflictException('El identificador público ya está en uso');
      }
    }

    return this.tenantRepo.update(dto.id, dto.name, dto.plan, dto.slug, dto.phone, dto.email, dto.whatsapp, dto.timezone);
  }
}
