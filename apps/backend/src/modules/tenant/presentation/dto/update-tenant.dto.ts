import { Plan } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

export class UpdateTenantDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Plan)
  plan?: Plan;

  @Transform(({ value }) => {
    if (typeof value !== "string") return value;
    const slug = value.trim().toLowerCase();
    return slug || undefined;
  })
  @IsOptional()
  @IsString()
  @Length(2, 80)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "El identificador solo puede contener letras minúsculas, números y guiones",
  })
  slug?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}
