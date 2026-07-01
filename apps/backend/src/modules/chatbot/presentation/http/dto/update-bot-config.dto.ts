import { IsString, IsOptional, IsNumber, IsBoolean } from "class-validator";

export class UpdateBotConfigDto {
  @IsOptional()
  @IsString()
  botName?: string;

  @IsOptional()
  @IsString()
  welcomeMessage?: string;

  @IsOptional()
  @IsString()
  disclaimer?: string;

  @IsOptional()
  @IsString()
  fallbackMessage?: string;

  @IsOptional()
  @IsNumber()
  similarityThreshold?: number;

  @IsOptional()
  @IsString()
  mode?: string;

  @IsOptional()
  @IsString()
  modelProvider?: string;

  @IsOptional()
  @IsNumber()
  maxTokens?: number;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
