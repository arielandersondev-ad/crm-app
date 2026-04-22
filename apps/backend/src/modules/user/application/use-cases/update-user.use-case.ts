import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repositoriy";
import { UpdateUserDto } from "../../presentation/dto/update-user.dto";

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(dto: UpdateUserDto) {
    if (!dto.id || dto.id.trim() === '') {throw new Error('El ID es requerido')}
    return this.userRepo.update(dto.id, dto.email, dto.password, dto.firstName, dto.lastName);
  }
}
