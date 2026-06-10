import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVisitDetailDto {
  
  @IsNotEmpty()
  visitId: string
  
  @IsNotEmpty()
  serviceId: string
  
  @IsNumber()
  quantity: number
  
  @IsOptional()
  @IsString()
  serviceName: string
  
  @IsNumber()
  unitPrice: number
  
  @IsNumber()
  totalPrice: number
  
  @IsNotEmpty()
  @IsString()
  notes: string
  
}
