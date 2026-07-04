import { IsString, IsOptional, IsEnum } from "class-validator";
import { FAQCategory } from "@prisma/client";

export class CreateFaqDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;

  @IsOptional()
  @IsEnum(FAQCategory)
  category?: FAQCategory;
}
