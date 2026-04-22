import { Module } from "@nestjs/common";
import { UserController } from "./presentation/http/user.controller";
import { UserRepository } from "./domain/repositories/user.repositoriy";
import { PrismaUserRepository } from "./infrastructure/prisma/prisma-user.repository";
import { FindAllUsersUseCase } from "./application/use-cases/find-all-users.use-case";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case";
import { UpdateUserUseCase } from "./application/use-cases/update-user.use-case";
import { DeleteUserUseCase } from "./application/use-cases/delete-user.use-case";
import { FindByEmailUseCase } from "./application/use-cases/find-by-email.use-case";
import { FindByIdUseCase } from "./application/use-cases/finst-by-id.use-case";

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    FindAllUsersUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindByEmailUseCase,
    FindByIdUseCase,
  ],
})
export class UserModule {}