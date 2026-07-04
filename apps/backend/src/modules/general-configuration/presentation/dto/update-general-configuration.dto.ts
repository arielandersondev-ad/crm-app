import { IsOptional, IsString } from "class-validator";

export class UpdateGeneralConfigurationDto {
  @IsOptional()
  @IsString()
  botName?: string;

  @IsOptional()
  @IsString()
  welcomeMessage?: string;

  @IsOptional()
  @IsString()
  fallbackMessage?: string;

  @IsOptional()
  @IsString()
  disclaimer?: string;
}
