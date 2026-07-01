import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreatePatientProfileDto {
  @IsUUID()
  clientId: string;

  @IsOptional()
  @IsString()
  antecedentes?: string;

  @IsOptional()
  @IsString()
  alergias?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  contactoEmergencia?: string;
}
