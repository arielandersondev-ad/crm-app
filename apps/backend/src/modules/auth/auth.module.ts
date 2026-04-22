import { Module } from "@nestjs/common";
import { AuthController } from "./presentation/http/auth.controller";
import { RegisterUseCase } from "./application/use-case/register.use-case";

@Module({
  controllers: [
    AuthController,
  ],
  providers: [
    RegisterUseCase,
  ],
})
export class AuthModule {}
