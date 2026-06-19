import { Module } from "@nestjs/common";
import { VisitDetailController } from "./presentation/http/visit-detail.controller";
import { UpdateVisitDetailUseCase } from "./application/update-visit-detail.use-case";
import { CreateVisitDetailUseCase } from "./application/create-visit-detail.use-case";
import { FindByIdUseCase } from "./application/find-by-id.use-case";
import { VisitDetailRepository } from "./domain/repositories/visit-detail.repository";
import { PrismaVisitDetailRepository } from "./infrastructure/prisma/prisma-visit-detail.repository";
import { ServiceModule } from "../service/service.module";
import { CreateManyVisitDetailUseCase } from "./application/create-many.use-case";
import { DeleteVisitDetailUseCase } from "./application/delete-visit-detail.use-case";
import { FindVisitDetailUseCase } from "./application/find-detail-by-visit.use-case";

@Module({
  imports: [
    ServiceModule,
  ],
  controllers: [
    VisitDetailController
  ],
  providers: [
    UpdateVisitDetailUseCase,
    CreateManyVisitDetailUseCase,
    DeleteVisitDetailUseCase,
    FindVisitDetailUseCase,
    CreateVisitDetailUseCase,
    FindByIdUseCase,
    {
      provide: VisitDetailRepository,
      useClass: PrismaVisitDetailRepository,
    }
  ],
  exports: [
    VisitDetailRepository,
  ]
})
export class VisitDetailModule {}