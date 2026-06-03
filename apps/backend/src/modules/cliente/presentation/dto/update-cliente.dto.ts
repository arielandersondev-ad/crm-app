import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class UpdateClienteDto {

  @IsNotEmpty()
  @IsString()
  fullName: string;  

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
  birthDate?: string;
  
  @IsOptional()
  address?: string;
  
  @IsOptional()
  notes?: string;
}