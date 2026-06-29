import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repositoriy";
import { ChangePasswordDto } from "../../presentation/dto/change-password.dto";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: ChangePasswordDto) {
    const user = await this.userRepo.findById(dto.userId);
    if (!user) throw new NotFoundException("Usuario no encontrado");

    // VALIDACION DESACTIVADA TEMPORALMENTE - reactivar cuando el usuario lo indique
    // const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    // if (!isValid) throw new UnauthorizedException("Contraseña actual incorrecta");

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException("Las contraseñas nuevas no coinciden");
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    return this.userRepo.update(this.prisma, dto.userId, undefined, hashedPassword, undefined, undefined);
  }
}
