import { Module } from "@nestjs/common";
import { ConsultationController } from "./presentation/http/consultation.controller";
import { CreateConsultationUseCase } from "./application/use-cases/create-consultation.use-case";
import { StartConsultationUseCase } from "./application/use-cases/start-consultation.use-case";
import { UpdateConsultationUseCase } from "./application/use-cases/update-consultation.use-case";
import { DeleteConsultationUseCase } from "./application/use-cases/delete-consultation.use-case";
import { GetConsultationDetailUseCase } from "./application/use-cases/get-consultation-detail.use-case";
import { GetPatientHistoryUseCase } from "./application/use-cases/get-patient-history.use-case";
import { ConsultationRepository } from "./domain/repositories/consultation.repository";
import { PrismaConsultationRepository } from "./infrastructure/prisma/prisma-consultation.repository";
import { CitaModule } from "../cita/cita.module";

@Module({
  imports: [CitaModule],
  controllers: [ConsultationController],
  providers: [
    CreateConsultationUseCase,
    StartConsultationUseCase,
    UpdateConsultationUseCase,
    DeleteConsultationUseCase,
    GetConsultationDetailUseCase,
    GetPatientHistoryUseCase,
    {
      provide: ConsultationRepository,
      useClass: PrismaConsultationRepository,
    },
  ],

})
export class ConsultationModule {}
