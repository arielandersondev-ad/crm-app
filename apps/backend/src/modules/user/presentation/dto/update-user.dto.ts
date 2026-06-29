import { UserRole } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}
export class UpdateUserSucursalMembershipDto {

  @IsString()
  id: string;
  
  @IsString()
  email?: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEnum(UserRole)
  role?: UserRole;

  @IsString()
  sucursalId?: string
}