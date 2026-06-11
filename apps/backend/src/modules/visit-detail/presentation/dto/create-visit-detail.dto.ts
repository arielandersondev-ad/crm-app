import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class CreateVisitDetailDto {
  
  @IsNotEmpty()
  visitId: string
  
  @IsNotEmpty()
  serviceId: string
  
  @IsNumber()
  quantity: number
  
  @IsOptional()
  @IsString()
  notes: string
  
}
export class CreateVisitItemDto {
  
  @IsNotEmpty()
  serviceId: string
  
  @IsNumber()
  @Min(1)
  quantity: number
  
  @IsOptional()
  @IsString()
  notes: string
  
}
export class CreateManyVisitDetailDto {

  @IsNotEmpty()
  @IsString()
  visitId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVisitItemDto)
  details: CreateVisitItemDto[];
}