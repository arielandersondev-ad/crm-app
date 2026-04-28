import { Module } from "@nestjs/common";
import { AuthController } from "./presentation/http/auth.controller";
import { RegisterUseCase } from "./application/use-case/register.use-case";
import { UserModule } from "../user/user.module";
import { TenantModule } from "../tenant/tenant.module";
import { MembershipModule } from "../membership/membership.module";

@Module({
  imports: [
    UserModule,
    TenantModule,
    MembershipModule,
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    RegisterUseCase,
  ],
})
export class AuthModule {}
