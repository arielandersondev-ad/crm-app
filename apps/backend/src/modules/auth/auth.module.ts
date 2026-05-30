import { Module } from "@nestjs/common";
import { AuthController } from "./presentation/http/auth.controller";
import { RegisterUseCase } from "./application/use-cases/register.use-case";
import { UserModule } from "../user/user.module";
import { TenantModule } from "../tenant/tenant.module";
import { MembershipModule } from "../membership/membership.module";
import { SucursalModule } from "../sucursal/sucursal.module";
import { JwtTokenService } from "./infrastructure/service/jwt.-token.service";
import { JwtModule } from "@nestjs/jwt";
import { TOKEN_SERVICE } from "./application/ports/token.service";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { JwtStrategy } from "./infrastructure/security/jwt.estrategy";

@Module({
  imports: [
    UserModule,
    TenantModule,
    MembershipModule,
    SucursalModule,
    JwtModule.register({}),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    JwtTokenService,
    JwtStrategy,
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    }
  ],
  exports: [
    JwtTokenService,
  ],
})
export class AuthModule {}
