import { Module } from "@nestjs/common";
import { TenantController } from "./presentation/http/tenant.controller";
import { TenantRepository } from "./domain/repositories/tenant.repository";
import { PrismaTenantRepository } from "./infrastructure/prisma/prisma-tenant.repository";
import { CreateTenantUseCase } from "./application/use-cases/create-tenant.use-case";
import { FindAllTenantsUseCase } from "./application/use-cases/find-all-tenants.use-case";
import { FindByIdTenantUseCase } from "./application/use-cases/find-by-id-tenant.use-case";
import { UpdateTenantUseCase } from "./application/use-cases/update-tenant.use-case";
import { DeleteTenantUseCase } from "./application/use-cases/delete-tenant.use-case";

@Module({
  controllers: [TenantController],
  providers: [
    { provide: TenantRepository, useClass: PrismaTenantRepository },
    CreateTenantUseCase,
    FindAllTenantsUseCase,
    FindByIdTenantUseCase,
    UpdateTenantUseCase,
    DeleteTenantUseCase,
  ],
  exports: [
    CreateTenantUseCase,
    FindAllTenantsUseCase,
    FindByIdTenantUseCase,
    UpdateTenantUseCase,
    DeleteTenantUseCase,
    TenantRepository,
  ],
})
export class TenantModule {}
