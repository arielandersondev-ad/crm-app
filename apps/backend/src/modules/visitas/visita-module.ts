import { Module } from "@nestjs/common";
import { VisitController } from "./presentation/http/visit.controller";
import { CreateVisitUseCase } from "./application/create-visit.use-case";
import { FindAllBySucursalIdUseCase } from "./application/find-all-sucursalId.use-case";
import { UpdateVisitUseCase } from "./application/update-visit.use-case";
import { FindAllVisitUseCase } from "./application/find-all.use-case";
import { VisitRepository } from "./domain/repositories/visit.repository";
import { PrismaVisitaRepository } from "./infrastructure/prisma/prisma-visita.repository";
import { DeleteVisitUseCase } from "./application/delete-visit.use-case";

@Module({
  controllers: [
    VisitController,
  ],
  providers: [
    CreateVisitUseCase,
    FindAllBySucursalIdUseCase,
    UpdateVisitUseCase,
    FindAllVisitUseCase,
    DeleteVisitUseCase,
    {
      provide: VisitRepository,
      useClass: PrismaVisitaRepository,
    }
  ],
  exports: [
    
  ],
})
export class VisitaModule {}