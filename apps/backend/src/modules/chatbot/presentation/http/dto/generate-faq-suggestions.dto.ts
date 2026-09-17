import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class GenerateFaqSuggestionsDto {
  @IsBoolean()
  useQwen!: boolean;

  @IsOptional()
  @IsDateString()
  snapshotAt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsBoolean()
  retry?: boolean;
}
