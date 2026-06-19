import { IsDateString, IsNotEmpty, IsString } from "class-validator"

export class CreateCitaDto{
  @IsString()
  @IsNotEmpty()
  clientId: string

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string
  
}