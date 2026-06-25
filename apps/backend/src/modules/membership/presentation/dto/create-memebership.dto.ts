import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "@prisma/client";

export class CreateMembershipDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  tenantId: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}