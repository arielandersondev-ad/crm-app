import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterRequestDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Contraseña requerida' })
  @MinLength(8, { message: 'La contraseña debe ser >= a 8 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nombres requeridos' })
  nombres: string;
  
  @IsString()
  @IsNotEmpty({ message: 'Apellidos requeridos' })
  apellidos: string;
}