import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

export class CreateClienteDto {

  @IsNotEmpty({ message: "El nombre completo es obligatorio" })
  @IsString({ message: "El nombre completo debe ser un texto" })
  fullName: string;

  @IsEmail({}, { message: "Ingrese un correo electrónico válido" })
  email: string;

  @IsNotEmpty({ message: "El teléfono es obligatorio" })
  @IsString({ message: "El teléfono debe ser un texto" })
  phone: string;

  @IsOptional()
  @IsString({ message: "El número de documento debe ser un texto" })
  documentNumber?: string;

  @IsOptional()
  @ValidateIf((_object, value) => value !== "")
  @IsDateString({ strict: true }, { message: "Ingrese una fecha de nacimiento válida" })
  birthDate?: string;

  @IsOptional()
  @IsString({ message: "La dirección debe ser un texto" })
  address?: string;

  @IsOptional()
  @IsString({ message: "Las notas deben ser un texto" })
  notes?: string;
}
