import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { FindAllBySucursalIdUseCase } from "../../application/find-all-sucursalId.use-case";
import { UpdateVisitUseCase } from "../../application/update-visit.use-case";
import { CreateVisitUseCase } from "../../application/create-visit.use-case";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { CreateVisitDto } from "../dto/create-visit.dto";
import { DeleteVisitUseCase } from "../../application/delete-visit.use-case";
import { FindByClientIdUseCase } from "../../application/find-by-client-id.use-case";
import { UpdateVisitDto } from "../dto/update-visit.dto";

@Controller('visitas')
@UseGuards(JwtAuthGuard)
export class VisitController {
  constructor(
    private readonly findAllBySucursalIdUseCase: FindAllBySucursalIdUseCase,
    private readonly updateVisitUseCase: UpdateVisitUseCase,
    private readonly createVisitUseCase: CreateVisitUseCase,
    private readonly deleteVisitUseCase: DeleteVisitUseCase,
    private readonly findByClientIdUseCase: FindByClientIdUseCase,
  ) {}
  @Get('client/:clientId')
  findByClientId(
    @Param('clientId') clientId: string,
  ) {
    return this.findByClientIdUseCase.execute(clientId);
  }

  @Get('all')
  findAllBySucursalId(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sucursalId') sucursalId: string,
  ) {
    return this.findAllBySucursalIdUseCase.execute(tenantId, sucursalId);
  }
  @Post('create')
  createVisit(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sucursalId') sucursalId: string,
    @CurrentUser('sub') userId: string,
    @Body() createVisitDto: CreateVisitDto,
  ) {
    return this.createVisitUseCase.execute(createVisitDto, tenantId, sucursalId, userId);
  }

  @Patch('update/:id')
  updateVisit(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sucursalId') sucursalId: string,
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateVisitDto: UpdateVisitDto,
  ) {
    return this.updateVisitUseCase.execute(tenantId, sucursalId, id, userId, updateVisitDto);
  }

  @Get('all/complete')
  findAllBySucursalIdForForm(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sucursalId') sucursalId: string,
  ) {
    return this.findAllBySucursalIdUseCase.execute(tenantId, sucursalId, 'complete');
  }

  @Delete('delete/:id')
  deleteVisit(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sucursalId') sucursalId: string,
    @Param('id') id: string,
  ) {
    return this.deleteVisitUseCase.execute(id, tenantId, sucursalId);
  }
}
