import { Module } from "@nestjs/common";
import { VisitDetailController } from "./presentation/http/visit-detail.controller";
import { UpdateVisitDetailUseCase } from "./application/update-visit-detail.use-case";
import { CreateVisitDetailUseCase } from "./application/create-visit-detail.use-case";
import { FindByIdVisitDetailUseCase } from "./application/find-by-id-visit-detail.use-case";
import { VisitDetailRepository } from "./domain/repositories/visit-detail.repository";
import { PrismaVisitDetailRepository } from "./infrastructure/prisma/prisma-visit-detail.repository";

@Module({
  controllers: [
    VisitDetailController
  ],
  providers: [
    UpdateVisitDetailUseCase,
    CreateVisitDetailUseCase,
    FindByIdVisitDetailUseCase,
    {
      provide: VisitDetailRepository,
      useClass: PrismaVisitDetailRepository,
    }
  ],

})
export class VisitDetailModule {}