import { PaymentMethod } from "@prisma/client"
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreatePagoDto {
  
  @IsString()
  @IsNotEmpty()
  visitId: string
  
  @IsOptional()
  sucursalId: string | null
  
  @IsNumber()
  @IsNotEmpty()
  amount: number
  
  @IsNotEmpty()
  method: PaymentMethod
  
  @IsString()
  @IsOptional()
  reference: string
  
  @IsString()
  @IsOptional()
  notes: string
}