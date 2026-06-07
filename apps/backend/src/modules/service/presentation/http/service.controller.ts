import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { FindAllUseCase } from "../../application/use-cases/find-all.use-case";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { CreateServiceDto } from "../dto/create.service.dto";
import { CreateServiceUseCase } from "../../application/use-cases/create-service.use-case";
import { UpdateServiceUseCase } from "../../application/use-cases/update-service.use-case";
import { UpdateServiceDto } from "../dto/update.service.dto";
import { SoftDeleteUseCase } from "../../application/use-cases/soft-delete.use-case";
import { ActivateClienteUseCase } from "../../../cliente/application/use-cases/activate.use-case";

@Controller('service')
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(
    private readonly findAllUseCase: FindAllUseCase,
    private readonly createUseCase: CreateServiceUseCase,
    private readonly updateUseCase: UpdateServiceUseCase,
    private readonly softDeleteUseCase: SoftDeleteUseCase,
  ) {}

  @Get('all/active')
  async findAllActive(
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.findAllUseCase.execute(tenantId);
  }

  @Post('create')
  async create(
    @CurrentUser('tenantId') tenantId: string,
    @Body() service: CreateServiceDto,
  ) {
    return this.createUseCase.execute(tenantId, service);
  }

  @Patch('update')
  async update(
    @CurrentUser('tenantId') tenantId: string,
    @Body() service: UpdateServiceDto,
  ) {
    return this.updateUseCase.execute(tenantId, service);
  }

  @Patch('soft-delete/:id')
  async softDelete(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.softDeleteUseCase.execute(tenantId, id);
  }
}
