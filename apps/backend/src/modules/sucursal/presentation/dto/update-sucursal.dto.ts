import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateSucursalDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  direccion: string;
  
  @IsNotEmpty()
  @IsNumber()
  latitude: number;
  
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
  
  @IsOptional()
  @IsString()
  telefono: string;
  
  @IsOptional()
  @IsString()
  correo: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsNumber()
  avgConsultationMinutes?: number;

  @IsOptional()
  @IsNumber()
  intervalBetweenAppointments?: number;

  @IsOptional()
  @IsNumber()
  autoNoShowMinutes?: number;
}
