import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRole } from "@prisma/client";

export class RegisterTenantUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Contraseña requerida' })
  @MinLength(8, { message: 'La contraseña debe ser >= a 8 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nombre requerido' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Apellido requerido' })
  lastName: string;

  @IsEnum(UserRole, { message: 'Rol inválido' })
  @IsNotEmpty({ message: 'Rol requerido' })
  role: UserRole;
}
