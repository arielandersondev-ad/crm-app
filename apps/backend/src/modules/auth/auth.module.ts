import { Module } from "@nestjs/common";
import { AuthController } from "./presentation/http/auth.controller";
import { RegisterUseCase } from "./application/use-case/register.use-case";
import { UserModule } from "../user/user.module";
import { TenantModule } from "../tenant/tenant.module";
import { MembershipModule } from "../membership/membership.module";
import { SucursalModule } from "../sucursal/sucursal.module";

@Module({
  imports: [
    UserModule,
    TenantModule,
    MembershipModule,
    SucursalModule,
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    RegisterUseCase,
  ],
})
export class AuthModule {}
