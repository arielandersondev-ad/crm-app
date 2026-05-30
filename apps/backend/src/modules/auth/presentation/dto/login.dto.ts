import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginRequestDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email requerido' })
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'Contraseña requerida' })
  @MinLength(2, { message: 'La contraseña debe ser >= a 2 caracteres' })
  password: string;
}
export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; firstName: string; lastName: string };
  tenant: { id: string; name: string; plan: string };
  sucursal: { id: string; name: string };
}