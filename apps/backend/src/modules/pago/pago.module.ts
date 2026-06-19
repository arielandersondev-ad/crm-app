import { Module } from "@nestjs/common";
import { CreatePagoUseCase } from "./application/use-cases/create-pago.use-case";
import { PagoRepository } from "./domain/repositories/pago.repository";
import { PrismaPagoRepository } from "./infrastructure/prisma/prisma-pago.repository";
import { PagoController } from "./presentation/http/pago.controller";
import { UpdatePagoUseCase } from "./application/use-cases/update-pago.use-case";
import { FindByVisitIdUseCase } from "./application/use-cases/find-by-visit-id.use-case";
import { ChangePagoUseCase } from "./application/use-cases/change-pago.use-case";
import { SumaryPagoUseCase } from "./application/use-cases/sumary-pago.use-case";
import { VisitDetailModule } from "../visit-detail/visit-detail.module";

@Module({
  imports:[
    VisitDetailModule
  ],
  controllers: [
    PagoController
  ],
  providers: [
    CreatePagoUseCase,
    UpdatePagoUseCase,
    FindByVisitIdUseCase,
    ChangePagoUseCase,
    SumaryPagoUseCase,
    {
      provide: PagoRepository,
      useClass: PrismaPagoRepository
    }
  ]
})
export class PagoModule {}