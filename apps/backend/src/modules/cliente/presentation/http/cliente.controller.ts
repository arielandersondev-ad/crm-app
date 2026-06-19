import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { FindAllUseCase } from "../../application/use-cases/find-all.use-case";
import { FindByIdUseCase } from "../../application/use-cases/find-by-id.use-case";
import { FindByTenantIdUseCase } from "../../application/use-cases/find-by-tenantId.use-case";
import { CreateClienteUseCase } from "../../application/use-cases/create-cliente.use-case";
import { UpdateClienteUseCase } from "../../application/use-cases/update-cliente.use-case";
import { DeleteClienteUseCase } from "../../application/use-cases/delete-cliente.use-case";
import { CreateClienteDto } from "../dto/create-cliente.dto";
import { UpdateClienteDto } from "../dto/update-cliente.dto";
import { ActivateClienteUseCase } from "../../application/use-cases/activate.use-case";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { FindByTenantIdActivoClienteUseCase } from "../../application/use-cases/find-by-active.use-case";

@Controller('cliente')
@UseGuards(JwtAuthGuard)
export class ClienteController {
  constructor(
    private readonly findAllUseCase: FindAllUseCase,
    private readonly findByIdUseCase: FindByIdUseCase,
    private readonly findByTenantIdUseCase: FindByTenantIdUseCase,
    private readonly createUseCase: CreateClienteUseCase,
    private readonly updateUseCase: UpdateClienteUseCase,
    private readonly deleteUseCase: DeleteClienteUseCase,
    private readonly activateUseCase: ActivateClienteUseCase,
    private readonly findByTenantIdActivoUseCase: FindByTenantIdActivoClienteUseCase,
  ){}
  @Get()
  async findAll() {
    return this.findAllUseCase.execute();
  }
  @Get('tenant')
  async findByTenantId(
    @CurrentUser('tenantId') tenantId: string,
  ) { 
    return this.findByTenantIdUseCase.execute(tenantId);
  }
  @Get('activo/tenant')
  async findByTenantIdActivo(
    @CurrentUser('tenantId') tenantId: string,
  ) { 
    return this.findByTenantIdActivoUseCase.execute(tenantId);
  }
  @Post('create')
  async create(
    @CurrentUser('tenantId') tenantId: string,
    @Body() dto: CreateClienteDto
  ) {
    return this.createUseCase.execute(tenantId, dto);
  }
  @Patch('update/:id')
  async update(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClienteDto
  ) {

    return this.updateUseCase.execute(tenantId, id, dto);
  }
  @Delete('delete/:id')
  async delete(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    console.log('Controller delete: ', id);
    return this.deleteUseCase.execute(tenantId, id);
  }
  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.findByIdUseCase.execute(id);
  }
  @Post('activate/:id')
  async activate(
    @CurrentUser('tenantId') tenantId: string,  
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.activateUseCase.execute(tenantId, id);
  }

}
