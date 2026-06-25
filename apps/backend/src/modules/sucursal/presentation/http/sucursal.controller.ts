import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { FindAllSucursalesUseCase } from "../../application/use-case/find-all-sucursal.use-case";
import { CreateSucursalDto } from "../dto/create-sucursal.dto";
import { CreateSucursalUseCase } from "../../application/use-case/create-sucursal.use-case";
import { FindOneSucursalUseCase } from "../../application/use-case/find-one-sucursal.use-case";
import { UpdateSucursalUseCase } from "../../application/use-case/update-sucursal.use-case";
import { UpdateSucursalDto } from "../dto/update-sucursal.dto";
import { DeleteSucursalUseCase } from "../../application/use-case/delete-sucursal.use-case";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";

@Controller('sucursal')
@UseGuards(JwtAuthGuard)
export class SucursalController {
  constructor(
    private readonly findAllSucursalesUseCase: FindAllSucursalesUseCase,
    private readonly createSucursalUseCase: CreateSucursalUseCase,
    private readonly findOneSucursalUseCase: FindOneSucursalUseCase,
    private readonly updateSucursalUseCase: UpdateSucursalUseCase,
    private readonly deleteSucursalUseCase: DeleteSucursalUseCase,
  ){}

  @Get()
  async findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.findAllSucursalesUseCase.execute(tenantId);
  }
  @Post()
  async create(
    @Body() dto: CreateSucursalDto
  ) {
    return this.createSucursalUseCase.execute(dto);
  }
  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.findOneSucursalUseCase.execute(id);
  }
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSucursalDto
  ) {
    return this.updateSucursalUseCase.execute(id, dto);
  }
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteSucursalUseCase.execute(id);
  }
}
