import { Body, Controller, Delete, Get, Patch, Post, Query } from "@nestjs/common";
import { FindAllUsersUseCase } from "../../application/use-cases/find-all-users.use-case";
import { CreateUserUseCase } from "../../application/use-cases/create-user.use-case";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UpdateUserUseCase } from "../../application/use-cases/update-user.use-case";
import { DeleteUserDto } from "../dto/delete-user.dto";
import { DeleteUserUseCase } from "../../application/use-cases/delete-user.use-case";
import { FindByEmailDto } from "../dto/findByEmail.dto";
import { FindByEmailUseCase } from "../../application/use-cases/find-by-email.use-case";
import { FindByIdUseCase } from "../../application/use-cases/finst-by-id.use-case";
import { FindByIdDto } from "../dto/findById.dto";

@Controller('users')
export class UserController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findByEmailUseCase: FindByEmailUseCase,
    private readonly findByIdUseCase: FindByIdUseCase,
  ) {}
  @Get()
  async findAll() {
    return this.findAllUsersUseCase.execute();
  }
  @Get('byId')
  async findById(@Query('id') id: string){
    return this.findByIdUseCase.execute(id);
  }
  @Get('byEmail')
  async findByEmail(@Query('email') email: string){
    return this.findByEmailUseCase.execute(email);
  }
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
  @Patch()
  async update(@Body() dto: UpdateUserDto) {
    return this.updateUserUseCase.execute(dto);
  }
  @Delete()
  async delete(@Body() dto: DeleteUserDto){
    return this.deleteUserUseCase.execute(dto);
  }
}