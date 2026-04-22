import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repositoriy";
import { DeleteUserDto } from "../../presentation/dto/delete-user.dto";
@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(dto: DeleteUserDto) {
    if (!dto.id || dto.id.trim() === '') {throw new Error('El ID es requerido')}
    return this.userRepository.delete(dto.id);
  }
}