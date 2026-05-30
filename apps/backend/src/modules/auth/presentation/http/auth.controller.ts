import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { LoginRequestDto } from "../dto/login.dto";
import { RegisterRequestDto } from "../dto/register.dto";
import { JwtAuthGuard } from "../../infrastructure/security/jwt-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase, 
    private readonly loginUseCase: LoginUseCase
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto
  ) {
    const { email, password } = dto;
    return await this.loginUseCase.execute(email, password);
  }
  @Post('register')
  async register(
    @Body() dto: RegisterRequestDto
  ) {  
    const { email, password, nombres, apellidos } = dto;
    return await this.registerUseCase.execute(email, password, nombres, apellidos);
  } 
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(
    @Req() req
  ) {
    return req.user;
  }
}