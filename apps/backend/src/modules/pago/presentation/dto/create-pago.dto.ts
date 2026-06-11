import { PaymentMethod } from "@prisma/client"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreatePagoDto {
  
  @IsString()
  @IsNotEmpty()
  visitId: string
  
  @IsString()
  @IsNotEmpty()
  sucursalId: string
  
  @IsString()
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