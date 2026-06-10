import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/infrastructure/security/jwt-auth.guard";
import { UpdateVisitDetailUseCase } from "../../application/update-visit-detail.use-case";
import { CreateVisitDetailUseCase } from "../../application/create-visit-detail.use-case";
import { FindByIdVisitDetailUseCase } from "../../application/find-by-id-visit-detail.use-case";
import { CreateVisitDetailDto } from "../dto/create-visit-detail.dto";
import { UpdateVisitDetailDto } from "../dto/update-visit-detail.dto";

@Controller('visit-detail')
@UseGuards(JwtAuthGuard)
export class VisitDetailController {
  constructor(
    private readonly updateVisitDetailUseCase: UpdateVisitDetailUseCase,
    private readonly createVisitDetailUseCase: CreateVisitDetailUseCase,
    private readonly findVisitDetailUseCase: FindByIdVisitDetailUseCase,
  ) {}
  @Post('create')
  async create(
    @Body() visitDetail: CreateVisitDetailDto
  ) {
    return this.createVisitDetailUseCase.execute(visitDetail);
  }
  @Patch('update')
  async update(
    @Body() visitDetail: UpdateVisitDetailDto
  ) {
    return this.updateVisitDetailUseCase.execute(visitDetail);
  }
  @Get('find-by-id')
  async findById(
    @Body('id') id: string
  ) {
    return this.findVisitDetailUseCase.execute(id);
  }
}
