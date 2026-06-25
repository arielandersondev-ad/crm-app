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
import { FindUsersByTenantUseCase } from "./application/use-cases/find-by-tenant.use-case";
import { CreateUserSucursalUseCase } from "./application/use-cases/create-user-sucursal.use-case";
import { UserSucursalRepository } from "./domain/repositories/user-sucursal.repository";
import { PrismaUserSucursalRepository } from "./infrastructure/prisma/prisma-user-sucursal.repository";
import { MembershipModule } from "../membership/membership.module";
import { SucursalModule } from "../sucursal/sucursal.module";
import { UpdateUserSucursalMembershipUseCase } from "./application/use-cases/update-user-sucursal-membership.use-case";
import { ChangeIsActiveUseCase } from "./application/use-cases/change-is-activate.use-case";

@Module({
  imports:[
    MembershipModule,
    SucursalModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: UserSucursalRepository,
      useClass: PrismaUserSucursalRepository,
    },
    FindAllUsersUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindByEmailUseCase,
    FindByIdUseCase,
    FindUsersByTenantUseCase,
    CreateUserSucursalUseCase,
    UpdateUserSucursalMembershipUseCase,
    ChangeIsActiveUseCase,
  ],
  exports: [
    FindByEmailUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    UserRepository,
  ],
})
export class UserModule {}