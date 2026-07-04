import { IsString, IsOptional, IsEnum, IsBoolean } from "class-validator";
import { FAQCategory } from "@prisma/client";

export class UpdateFaqDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsEnum(FAQCategory)
  category?: FAQCategory;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
