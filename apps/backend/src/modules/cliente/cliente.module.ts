import { Module } from "@nestjs/common";
import { ClienteController } from "./presentation/http/cliente.controller";
import { FindByIdUseCase } from "./application/use-cases/find-by-id.use-case";
import { DeleteClienteUseCase } from "./application/use-cases/delete-cliente.use-case";
import { UpdateClienteUseCase } from "./application/use-cases/update-cliente.use-case";
import { CreateClienteUseCase } from "./application/use-cases/create-cliente.use-case";
import { FindAllUseCase } from "./application/use-cases/find-all.use-case";
import { FindByTenantIdUseCase } from "./application/use-cases/find-by-tenantId.use-case";
import { ClienteRepository } from "./domain/repository/cliente.repository";
import { PrismaClienteRepository } from "./infrastructure/prisma/prisma-cliente.repository";
import { ActivateClienteUseCase } from "./application/use-cases/activate.use-case";

@Module({
  controllers: [
    ClienteController
  ],
  providers: [
    FindByIdUseCase, 
    FindAllUseCase,
    FindByTenantIdUseCase,
    DeleteClienteUseCase,
    UpdateClienteUseCase,
    CreateClienteUseCase,
    ActivateClienteUseCase,
    {
      provide: ClienteRepository,
      useClass: PrismaClienteRepository,
    }
  ],
})
export class ClienteModule {}