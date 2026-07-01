import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateCitaDto{
  @IsString()
  @IsNotEmpty()
  clientId: string

  @IsString()
  @IsOptional()
  userId: string
  
  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string
  
  @IsNotEmpty()
  @IsString()
  status: "PENDING"|"CONFIRMED"|"CANCELLED"|"COMPLETED" |"NO_SHOW" 
}