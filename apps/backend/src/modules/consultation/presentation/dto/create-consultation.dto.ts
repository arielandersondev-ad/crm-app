import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateConsultationDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsOptional()
  @IsUUID()
  visitId?: string;

  @IsOptional()
  @IsDateString()
  consultationDate?: string;

  @IsString()
  @IsNotEmpty({ message: "El motivo de consulta es obligatorio" })
  motivo: string;

  @IsOptional()
  @IsString()
  diagnostico?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsDateString()
  nextControlAt?: string;
}
