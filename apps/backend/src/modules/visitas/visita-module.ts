import { Module } from "@nestjs/common";
import { VisitController } from "./presentation/http/visit.controller";
import { CreateVisitUseCase } from "./application/create-visit.use-case";
import { FindAllBySucursalIdUseCase } from "./application/find-all-sucursalId.use-case";
import { UpdateVisitUseCase } from "./application/update-visit.use-case";
import { VisitRepository } from "./domain/repositories/visit.repository";
import { PrismaVisitaRepository } from "./infrastructure/prisma/prisma-visita.repository";
import { DeleteVisitUseCase } from "./application/delete-visit.use-case";
import { FindByClientIdUseCase } from "./application/find-by-client-id.use-case";
import { CitaModule } from "../cita/cita.module";

@Module({
  imports: [
    CitaModule,
  ],
  controllers: [
    VisitController,
  ],
  providers: [
    CreateVisitUseCase,
    FindAllBySucursalIdUseCase,
    UpdateVisitUseCase,
    DeleteVisitUseCase,
    FindByClientIdUseCase,
    {
      provide: VisitRepository,
      useClass: PrismaVisitaRepository,
    }
  ],
  exports: [
    
  ],
})
export class VisitaModule {}