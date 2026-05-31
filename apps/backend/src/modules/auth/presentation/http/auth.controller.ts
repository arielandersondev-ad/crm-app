import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { LoginRequestDto } from "../dto/login.dto";
import { RegisterRequestDto } from "../dto/register.dto";
import { JwtAuthGuard } from "../../infrastructure/security/jwt-auth.guard";
import { Response } from "express";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase, 
    private readonly loginUseCase: LoginUseCase
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true })res: Response,
  ) {
    const { email, password } = dto;
    const result = await this.loginUseCase.execute(email, password);
    res.cookie(
      'access_token', 
      result.accessToken, 
      { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      }
    );
    return {
      user: result.user,
      tenant: result.tenant,
      sucursal: result.sucursal,
    };
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