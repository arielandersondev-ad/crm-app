import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateVisitDto {

  @IsOptional()
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  appointmentId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;
}