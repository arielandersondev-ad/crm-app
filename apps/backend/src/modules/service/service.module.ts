import { Module } from "@nestjs/common";
import { FindAllUseCase } from "./application/use-cases/find-all.use-case";
import { ServiceController } from "./presentation/http/service.controller";
import { ServiceRepository } from "./domain/repository/service.repository";
import { PrismaServiceRepository } from "./infrastructure/prisma/prisma-service.repository";
import { CreateServiceUseCase } from "./application/use-cases/create-service.use-case";
import { UpdateServiceUseCase } from "./application/use-cases/update-service.use-case";
import { SoftDeleteUseCase } from "./application/use-cases/soft-delete.use-case";
import { ActivateServiceUseCase } from "./application/use-cases/activate.use-case";

@Module({
  controllers: [
    ServiceController,
  ],
  providers: [
    FindAllUseCase,
    CreateServiceUseCase,
    UpdateServiceUseCase,
    SoftDeleteUseCase,
    ActivateServiceUseCase,
    {
      provide: ServiceRepository,
      useClass: PrismaServiceRepository,
    },
  ],
  exports: [],
})
export class ServiceModule {}
