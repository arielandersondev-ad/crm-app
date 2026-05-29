import { Module } from "@nestjs/common";
import { SucursalController } from "./presentation/http/sucursal.controller";
import { FindAllSucursalesUseCase } from "./application/use-case/find-all-sucursal.use-case";
import { SucursalRepository } from "./domain/repositories/sucursal.repository";
import { PrismaSucursalRepository } from "./infrastructure/prisma/prisma-sucursal.repository";
import { CreateSucursalUseCase } from "./application/use-case/create-sucursal.use-case";
import { TenantModule } from "../tenant/tenant.module";
import { FindOneSucursalUseCase } from "./application/use-case/find-one-sucursal.use-case";
import { UpdateSucursalUseCase } from "./application/use-case/update-sucursal.use-case";
import { DeleteSucursalUseCase } from "./application/use-case/delete-sucursal.use-case";

@Module({
  imports: [
    TenantModule,
  ],
  controllers: [
    SucursalController,
  ],
  providers: [
    FindAllSucursalesUseCase,
    CreateSucursalUseCase,
    FindOneSucursalUseCase,
    UpdateSucursalUseCase,
    DeleteSucursalUseCase,
    {
      provide: SucursalRepository,
      useClass: PrismaSucursalRepository,
    },
  ],
  exports: [
    FindAllSucursalesUseCase,
    CreateSucursalUseCase,
    DeleteSucursalUseCase,
    SucursalRepository,
  ],
})
export class SucursalModule { }