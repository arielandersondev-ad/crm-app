import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repositoriy";
import { CreateUserDto } from "../../presentation/dto/create-user.dto";

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
  ){}
  async execute(dto: CreateUserDto) {
    if (!dto.email) {throw new Error('Email invalido')}
    if (!dto.password) {throw new Error('Contraseña invalida')}
    if (!dto.firstName) {throw new Error('Nombre invalido')}
    if (!dto.lastName) {throw new Error('Apellido invalido')}
    return this.userRepo.create(dto.email, dto.password, dto.firstName, dto.lastName);
  }
}