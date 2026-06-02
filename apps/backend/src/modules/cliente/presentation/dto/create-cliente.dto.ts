import { IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateClienteDto {
  @IsUUID()
  tenantId: string;

  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsString()
  birthday?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}