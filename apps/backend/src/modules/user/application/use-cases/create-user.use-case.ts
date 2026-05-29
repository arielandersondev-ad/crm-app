import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repositoriy";
import { CreateUserDto } from "../../presentation/dto/create-user.dto";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService,
  ){}
  async execute(dto: CreateUserDto) {
    if (!dto.email) {throw new Error('Email invalido')}
    if (!dto.password) {throw new Error('Contraseña invalida')}
    if (!dto.firstName) {throw new Error('Nombre invalido')}
    if (!dto.lastName) {throw new Error('Apellido invalido')}
    return this.userRepo.create(this.prisma, dto.email, dto.password, dto.firstName, dto.lastName);
  }
}