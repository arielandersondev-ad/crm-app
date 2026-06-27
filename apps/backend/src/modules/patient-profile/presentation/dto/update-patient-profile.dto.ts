import { IsOptional, IsString } from "class-validator";

export class UpdatePatientProfileDto {
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
