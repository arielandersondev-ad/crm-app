import { IsString, MinLength } from "class-validator";

export class ChangePasswordDto {

  @IsString()
  userId: string;

  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
