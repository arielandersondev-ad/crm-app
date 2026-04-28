import { Body, Controller, Post } from "@nestjs/common";
import { RegisterUseCase } from "../../application/use-case/register.use-case";

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  @Post('login')
  login() {
    return 'Login';
  }
  @Post('register')
  async register(@Body('email') email: string, @Body('password') password: string, @Body('nombres') nombres: string, @Body('apellidos') apellidos: string) {  
    return await this.registerUseCase.execute(email, password, nombres, apellidos);
  }
}