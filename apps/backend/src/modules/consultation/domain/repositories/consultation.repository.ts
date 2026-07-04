import { ConsultationEntity } from "../entities/consultation.entity";
import { CreateConsultationDto } from "../../presentation/dto/create-consultation.dto";
import { UpdateConsultationDto } from "../../presentation/dto/update-consultation.dto";

export abstract class ConsultationRepository {
  abstract create(data: CreateConsultationDto & { tenantId: string; userId: string }): Promise<ConsultationEntity>;
  abstract update(id: string, tenantId: string, data: UpdateConsultationDto): Promise<ConsultationEntity>;
  abstract softDelete(id: string, tenantId: string): Promise<void>;
  abstract findById(id: string, tenantId: string): Promise<ConsultationEntity | null>;
  abstract findByClientId(clientId: string, tenantId: string): Promise<ConsultationEntity[]>;
  abstract findAllByTenant(tenantId: string): Promise<any[]>;
}
