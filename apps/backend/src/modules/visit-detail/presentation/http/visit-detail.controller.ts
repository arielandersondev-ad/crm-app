import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { UpdateVisitDetailUseCase } from "../../application/update-visit-detail.use-case";
import { CreateVisitDetailUseCase } from "../../application/create-visit-detail.use-case";
import { FindByIdUseCase } from "../../application/find-by-id.use-case";
import { CreateManyVisitDetailDto, CreateVisitDetailDto } from "../dto/create-visit-detail.dto";
import { UpdateVisitDetailDto } from "../dto/update-visit-detail.dto";
import { CreateManyVisitDetailUseCase } from "../../application/create-many.use-case";
import { DeleteVisitDetailUseCase } from "../../application/delete-visit-detail.use-case";
import { FindVisitDetailUseCase } from "../../application/find-detail-by-visit.use-case";

@Controller('visit-detail')
@UseGuards(JwtAuthGuard)
export class VisitDetailController {
  constructor(
    private readonly updateVisitDetailUseCase: UpdateVisitDetailUseCase,
    private readonly createVisitDetailUseCase: CreateVisitDetailUseCase,
    private readonly createManyVisitDetailUseCase: CreateManyVisitDetailUseCase,
    private readonly deleteVisitDetailUseCase: DeleteVisitDetailUseCase,
    private readonly findVisitDetailUseCase: FindVisitDetailUseCase,
    private readonly findByIdUseCase: FindByIdUseCase,
  ) {}
  @Post('create')
  async create(
    @Body() visitDetail: CreateVisitDetailDto
  ) {
    return this.createVisitDetailUseCase.execute(visitDetail);
  }
  @Post('bulk-create')
  async createMany(
    @Body()
    dto: CreateManyVisitDetailDto
  ) {
    return this.createManyVisitDetailUseCase.execute(dto);
  }
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() visitDetail: UpdateVisitDetailDto
  ) {
    return this.updateVisitDetailUseCase.execute(id, visitDetail);
  }
  @Get('find-by-id')
  async findById(
    @Body('id') id: string
  ) {
    return this.findByIdUseCase.execute(id);
  }
  @Get('detail/visitId/:id')
  async findByVisitId(
    @Param('id') visitId: string
  ) {
    return this.findVisitDetailUseCase.execute(visitId);
  }
  @Delete('delete')
  async delete(
    @Body('id') id: string
  ) {
    return this.deleteVisitDetailUseCase.execute(id);
  }
}
