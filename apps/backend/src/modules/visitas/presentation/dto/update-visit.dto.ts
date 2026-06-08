import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateVisitDto {

  @IsNotEmpty()
  @IsString()
  clientId: string;

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
  @IsString()
  startedAt?: string;

  @IsOptional()
  @IsString()
  completedAt?: string;
}