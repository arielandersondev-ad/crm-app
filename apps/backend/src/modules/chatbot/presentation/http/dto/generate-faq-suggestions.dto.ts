import { IsBoolean } from 'class-validator';

export class GenerateFaqSuggestionsDto {
  @IsBoolean()
  useQwen!: boolean;
}
