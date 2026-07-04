import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { ConsultationStatus } from "../../domain/entities/consultation.entity";

export class UpdateConsultationDto {
  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  diagnostico?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsDateString()
  nextControlAt?: string;

  @IsOptional()
  @IsDateString()
  consultationDate?: string;

  @IsOptional()
  @IsEnum(ConsultationStatus)
  status?: ConsultationStatus;
}
