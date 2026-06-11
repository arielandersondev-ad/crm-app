import { Module } from "@nestjs/common";
import { CreatePagoUseCase } from "./application/use-cases/create-pago.use-case";
import { PagoRepository } from "./domain/repositories/pago.repository";
import { PrismaPagoRepository } from "./infrastructure/prisma/prisma-pago.repository";
import { PagoController } from "./presentation/http/pago.controller";

@Module({
  controllers: [
    PagoController
  ],
  providers: [
    CreatePagoUseCase,
    {
      provide: PagoRepository,
      useClass: PrismaPagoRepository
    }
  ]
})
export class PagoModule {}