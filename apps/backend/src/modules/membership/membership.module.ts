import { Module } from "@nestjs/common";
import { MembershipController } from "./presentation/http/membership.controller";
import { MembershipRepository } from "./domain/repositories/membership.repository";
import { PrismaMembershipRepository } from "./infrastructure/prisma/prisma-membership.repository";
import { CreateMembershipUseCase } from "./application/use-case/create-membership.use-case";
import { FindByUserIdUseCase } from "./application/use-case/find-by-userid.use-case";
import { FindByIdUseCase } from "./application/use-case/find-by-id.use-case";
import { FindAllUseCase } from "./application/use-case/find-all.use-case";
import { UpdateMembershipUseCase } from "./application/use-case/update-membership.use-case";
import { DeleteMembershipUseCase } from "./application/use-case/delete-membership.use-case";

@Module({
  controllers: [
    MembershipController,
  ],
  providers: [
    {
      provide: MembershipRepository,
      useClass: PrismaMembershipRepository,
    },
    CreateMembershipUseCase,
    FindByUserIdUseCase,
    FindByIdUseCase,
    FindAllUseCase,
    UpdateMembershipUseCase,
    DeleteMembershipUseCase,
  ],
  exports: [
    CreateMembershipUseCase,
    FindByUserIdUseCase,
    FindByIdUseCase,
    FindAllUseCase,
    UpdateMembershipUseCase,
    DeleteMembershipUseCase,
  ],
})
export class MembershipModule {}