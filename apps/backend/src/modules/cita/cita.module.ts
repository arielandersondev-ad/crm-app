import { Module } from "@nestjs/common";
import { CitaController } from "./presentation/http/cita.controller";
import { CitaRepository } from "./domain/repositories/cita.repository";
import { PrismaCitaRepository } from "./infrastructure/prisma/prisma-cita.repository";
import { CreateCitaUseCase } from "./application/use-cases/create-cita.use-case";
import { UpdateCitaUseCase } from "./application/use-cases/update-cita.use-case";
import { FindAllBySucursalUseCase } from "./application/use-cases/find-all-by-sucursal.use-case";
import { FindAgendaUseCase } from "./application/use-cases/find-agenda.use-case";
import { SucursalModule } from "../sucursal/sucursal.module";

@Module({
  imports: [
    SucursalModule,
  ],
  controllers:[
    CitaController
  ],
  providers:[
    CreateCitaUseCase,
    UpdateCitaUseCase,
    FindAllBySucursalUseCase,
    FindAgendaUseCase,
    {
      provide: CitaRepository,
      useClass: PrismaCitaRepository
    }
  ]
})
export class CitaModule{}