import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { CreateMembershipUseCase } from "../../application/use-case/create-membership.use-case";
import { FindByUserIdUseCase } from "../../application/use-case/find-by-userid.use-case";
import { FindByIdUseCase } from "../../application/use-case/find-by-id.use-case";
import { FindByTenantUseCase } from "../../application/use-case/find-by-tenant.use-case";
import { FindAllUseCase } from "../../application/use-case/find-all.use-case";
import { UpdateMembershipUseCase } from "../../application/use-case/update-membership.use-case";
import { UpdateMembershipDto } from "../dto/update-membership.dto";
import { DeleteMembershipUseCase } from "../../application/use-case/delete-membership.use-case";
import { CreateMembershipDto } from "../dto/create-memebership.dto";

@Controller('membership')
@UseGuards(JwtAuthGuard)
export class MembershipController {
  constructor(
    private readonly createMembershipUseCase: CreateMembershipUseCase,
    private readonly findByUserIdUseCase: FindByUserIdUseCase,
    private readonly findByIdUseCase: FindByIdUseCase,
    private readonly findByTenantUseCase: FindByTenantUseCase,
    private readonly findAllUseCase: FindAllUseCase,
    private readonly updateMembershipUseCase: UpdateMembershipUseCase,
    private readonly deleteMembershipUseCase: DeleteMembershipUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateMembershipDto) {
    return this.createMembershipUseCase.execute(dto);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string){
    return this.findByUserIdUseCase.execute(userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string){
    return this.findByIdUseCase.execute(id);
  }

  @Get()
  async findAll(){
    return this.findAllUseCase.execute();
  }

  @Get('tenant')
  async findByTenant(
    @CurrentUser('tenantId') tenantId: string,
  ){
    return this.findByTenantUseCase.execute(tenantId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMembershipDto) {
    return this.updateMembershipUseCase.execute(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string){
    return this.deleteMembershipUseCase.execute(id);
  }
}
