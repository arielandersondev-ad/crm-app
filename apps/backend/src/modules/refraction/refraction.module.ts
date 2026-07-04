import { Module } from "@nestjs/common";
import { RefractionController } from "./presentation/http/refraction.controller";
import { UpsertRefractionUseCase } from "./application/use-cases/upsert-refraction.use-case";
import { RefractionRepository } from "./domain/repository/refraction.repository";
import { PrismaRefractionRepository } from "./infrastructure/prisma/prisma-refraction.repository";

@Module({
  controllers: [RefractionController],
  providers: [
    UpsertRefractionUseCase,
    {
      provide: RefractionRepository,
      useClass: PrismaRefractionRepository,
    },
  ],
})
export class RefractionModule {}
