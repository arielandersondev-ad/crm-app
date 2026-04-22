import { Module } from "@nestjs/common";
import { TenantController } from "./presentation/http/tenant.controller";
import { TenantRepository } from "./domain/repositories/tenant.repository";
import { PrismaTenantRepository } from "./infrastructure/prisma/prisma-tenant.repository";
import { CreateTenantUseCase } from "./aplication/use-cases/create-tenant.use-case";
import { FindAllTenantsUseCase } from "./aplication/use-cases/find-all-tenants.use-case";
import { FindByIdTenantUseCase } from "./aplication/use-cases/find-by-Id-tenant.use-case";
import { UpdateTenantUseCase } from "./aplication/use-cases/update-tenant.use-case";
import { DeleteTenantUseCase } from "./aplication/use-cases/delete-tenant.use-case";

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
})
export class TenantModule {}
