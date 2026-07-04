import { IsDateString, IsOptional, IsString } from "class-validator";

export class ReportFiltersDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
