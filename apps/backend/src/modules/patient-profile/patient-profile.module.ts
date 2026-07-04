import { Module } from "@nestjs/common";
import { PatientProfileController } from "./presentation/http/patient-profile.controller";
import { CreatePatientProfileUseCase } from "./application/use-cases/create-patient-profile.use-case";
import { UpdatePatientProfileUseCase } from "./application/use-cases/update-patient-profile.use-case";
import { FindByClientIdUseCase } from "./application/use-cases/find-by-client-id.use-case";
import { PatientProfileRepository } from "./domain/repository/patient-profile.repository";
import { PrismaPatientProfileRepository } from "./infrastructure/prisma/prisma-patient-profile.repository";

@Module({
  controllers: [PatientProfileController],
  providers: [
    CreatePatientProfileUseCase,
    UpdatePatientProfileUseCase,
    FindByClientIdUseCase,
    {
      provide: PatientProfileRepository,
      useClass: PrismaPatientProfileRepository,
    },
  ],
})
export class PatientProfileModule {}
