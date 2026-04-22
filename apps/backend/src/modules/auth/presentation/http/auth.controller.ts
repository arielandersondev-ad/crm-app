import { Controller, Post } from "@nestjs/common";
import { RegisterUseCase } from "../../application/use-case/register.use-case";

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  @Post('login')
  login() {
    return 'Login';
  }
  @Post('register')
  async register() {
    return await this.registerUseCase.execute();
  }
}