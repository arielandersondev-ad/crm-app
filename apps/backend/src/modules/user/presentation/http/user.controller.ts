import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { FindAllUsersUseCase } from "../../application/use-cases/find-all-users.use-case";
import { CreateUserUseCase } from "../../application/use-cases/create-user.use-case";
import { CreateUserDto, CreateUserSucursalDto } from "../dto/create-user.dto";
import { UpdateUserDto, UpdateUserSucursalMembershipDto } from "../dto/update-user.dto";
import { UpdateUserUseCase } from "../../application/use-cases/update-user.use-case";
import { DeleteUserDto } from "../dto/delete-user.dto";
import { DeleteUserUseCase } from "../../application/use-cases/delete-user.use-case";
import { FindByEmailDto } from "../dto/findByEmail.dto";
import { FindByEmailUseCase } from "../../application/use-cases/find-by-email.use-case";
import { FindByIdUseCase } from "../../application/use-cases/finst-by-id.use-case";
import { FindByIdDto } from "../dto/findById.dto";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { Tenant } from "../../../tenant/domain/entities/tenant.entity";
import { FindAllBySucursalUseCase } from "../../../cita/application/use-cases/find-all-by-sucursal.use-case";
import { FindUsersByTenantUseCase } from "../../application/use-cases/find-by-tenant.use-case";
import { Sucursal } from "../../../sucursal/domain/entities/sucursal.entity";
import { CreateUserSucursalUseCase } from "../../application/use-cases/create-user-sucursal.use-case";
import { UpdateUserSucursalMembershipUseCase } from "../../application/use-cases/update-user-sucursal-membership.use-case";
import { ChangeIsActiveUseCase } from "../../application/use-cases/change-is-activate.use-case";

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findByEmailUseCase: FindByEmailUseCase,
    private readonly findByIdUseCase: FindByIdUseCase,
    private readonly findUsersByTenantUseCase: FindUsersByTenantUseCase,
    private readonly createUserSucursalUseCase: CreateUserSucursalUseCase,
    private readonly updateUserSucursalMembershipUseCase: UpdateUserSucursalMembershipUseCase,
    private readonly changeIsActiveUseCase: ChangeIsActiveUseCase,
  ) {}
  @Get('byTenantId')
  async findByTenantId(
    @CurrentUser('tenantId') tenantId: string,
  ){
    return this.findUsersByTenantUseCase.execute(tenantId);
  }
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
  @Post('assign')
  async asignarSucursal(
    @Body() dto: CreateUserSucursalDto,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sucursalId') sucursalId: string,
  ){
    return this.createUserSucursalUseCase.execute(dto.email, dto.password, dto.firstName, dto.lastName, dto.role, tenantId, sucursalId)
  }
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
  @Patch('updateRolSucursal')
  async updateRolSucursal(
    @Body() dto: UpdateUserSucursalMembershipDto,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.updateUserSucursalMembershipUseCase.execute(dto, tenantId);
  }
  @Patch('deactivate/:id')
  async deactivate(@Param('id') id:string ) {
    return this.changeIsActiveUseCase.execute(id,'deactivate');
  }
  @Patch('activate/:id')
  async activate(@Param('id') id:string) {
    return this.changeIsActiveUseCase.execute(id, 'activate');
  }
  @Patch()
  async update(@Body() dto: UpdateUserDto) {
    return this.updateUserUseCase.execute(dto);
  }
  @Delete('delete/:id')
  async delete(@Param('id') id: string){
    return this.deleteUserUseCase.execute(id);
  }
}