import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { CreateTenantDto } from "../dto/create-tenant.dto";
import { UpdateTenantDto } from "../dto/update-tenant.dto";
import { CreateTenantUseCase } from "../../application/use-cases/create-tenant.use-case";
import { FindAllTenantsUseCase } from "../../application/use-cases/find-all-tenants.use-case";
import { FindByIdTenantUseCase } from "../../application/use-cases/find-by-id-tenant.use-case";
import { UpdateTenantUseCase } from "../../application/use-cases/update-tenant.use-case";
import { DeleteTenantUseCase } from "../../application/use-cases/delete-tenant.use-case";

@Controller('tenant')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(
    private readonly createTenantUseCase: CreateTenantUseCase,
    private readonly findAllTenantsUseCase: FindAllTenantsUseCase,
    private readonly findByIdTenantUseCase: FindByIdTenantUseCase,
    private readonly updateTenantUseCase: UpdateTenantUseCase,
    private readonly deleteTenantUseCase: DeleteTenantUseCase,
  ) {}

  @Get()
  async findAll() {
    return this.findAllTenantsUseCase.execute();
  }

  @Get('byId')
  async findById(@Query('id') id: string) {
    return this.findByIdTenantUseCase.execute(id);
  }

  @Post()
  async create(@Body() dto: CreateTenantDto) {
    return this.createTenantUseCase.execute(dto);
  }

  @Patch()
  async update(@Body() dto: UpdateTenantDto) {
    return this.updateTenantUseCase.execute(dto);
  }

  @Delete()
  async delete(@Body('id') id: string) {
    return this.deleteTenantUseCase.execute(id);
  }
}
