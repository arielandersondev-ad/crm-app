import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class UpdateClienteDto {

  @IsNotEmpty()
  tenantId: string;
  
  @IsNotEmpty()
  @IsString()
  fullname: string;  

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsString()
  documentNumber?: string;
 
  @IsOptional()
  birthday?: string;
  
  @IsOptional()
  address?: string;
  
  @IsOptional()
  notes?: string;
}