import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { FindAllUseCase } from "../../application/use-cases/find-all.use-case";
import { FindByIdUseCase } from "../../application/use-cases/find-by-id.use-case";
import { FindByTenantIdUseCase } from "../../application/use-cases/find-by-tenantId.use-case";
import { CreateClienteUseCase } from "../../application/use-cases/create-cliente.use-case";
import { UpdateClienteUseCase } from "../../application/use-cases/update-cliente.use-case";
import { DeleteClienteUseCase } from "../../application/use-cases/delete-cliente.use-case";
import { CreateClienteDto } from "../dto/create-cliente.dto";
import { UpdateClienteDto } from "../dto/update-cliente.dto";
import { ActivateClienteUseCase } from "../../application/use-cases/activate.use-case";

@Controller('cliente')
export class ClienteController {
  constructor(
    private readonly findAllUseCase: FindAllUseCase,
    private readonly findByIdUseCase: FindByIdUseCase,
    private readonly findByTenantIdUseCase: FindByTenantIdUseCase,
    private readonly createUseCase: CreateClienteUseCase,
    private readonly updateUseCase: UpdateClienteUseCase,
    private readonly deleteUseCase: DeleteClienteUseCase,
    private readonly activateUseCase: ActivateClienteUseCase,
  ){}
  @Get()
  async findAll() {
    return this.findAllUseCase.execute();
  }
  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.findByIdUseCase.execute(id);
  }
  @Get('tenant/:tenantId')
  async findByTenantId(
    @Param('tenantId', ParseUUIDPipe) tenantId: string
  ) { 
    return this.findByTenantIdUseCase.execute(tenantId);
  }
  @Post()
  async create(
    @Body() dto: CreateClienteDto
  ) {
    return this.createUseCase.execute(dto);
  }
  @Patch('update/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClienteDto
  ) {

    return this.updateUseCase.execute(id, dto);
  }
  @Delete('delete/:id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.deleteUseCase.execute(id);
  }
  @Post('activate/:id')
  async activate(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.activateUseCase.execute(id);
  }

}
