import { PaymentMethod, PaymentStatus } from "@prisma/client"
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdatePagoDto{
  @IsOptional()
  id: string

  @IsString()
  @IsNotEmpty()
  visitId: string
  
  @IsOptional()
  sucursalId: string
  
  @IsNumber()
  @IsOptional()
  amount: number
  
  @IsOptional()
  method: PaymentMethod
  
  @IsString()
  @IsOptional()
  reference: string
  
  @IsString()
  @IsOptional()
  notes: string  
  
  @IsString()
  @IsOptional()
  status: PaymentStatus  
  
  @IsString()
  @IsOptional()
  voidedAt: Date

  @IsString()
  @IsOptional()
  paidAt: Date
   
}