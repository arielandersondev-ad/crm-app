import { IsOptional, IsNumber, IsString } from "class-validator";

export class UpdateVisitDetailDto {
  @IsOptional()
  @IsString()
  visitId?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}