import { Body, Controller, Delete, Get, Patch, Post, Query } from "@nestjs/common";
import { CreateMembershipUseCase } from "../../application/use-case/create-membership.use-case";
import { CreateMembershipDto } from "../dto/create-memebership.dto";
import { FindByUserIdUseCase } from "../../application/use-case/find-by-userid.use-case";
import { FindByIdUseCase } from "../../application/use-case/find-by-id.use-case";
import { FindAllUseCase } from "../../application/use-case/find-all.use-case";
import { UpdateMembershipUseCase } from "../../application/use-case/update-membership.use-case";
import { UpdateMembershipDto } from "../dto/update-membership.sto";
import { DeleteMembershipUseCase } from "../../application/use-case/delete-membership.use-case";

@Controller('membership')
export class MembershipController {
  constructor(
    private readonly createMembershipUseCase: CreateMembershipUseCase,
    private readonly findByUserIdUseCase: FindByUserIdUseCase,
    private readonly findByIdUseCase: FindByIdUseCase,
    private readonly findAllUseCase: FindAllUseCase,
    private readonly updateMembershipUseCase: UpdateMembershipUseCase,
    private readonly deleteMembershipUseCase: DeleteMembershipUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateMembershipDto) {
    return this.createMembershipUseCase.execute(dto);
  }
  @Get()
  async findByUserId(@Query('userId') userId: string){
    return this.findByUserIdUseCase.execute(userId);
  }
  @Get()
  async findById(@Query('id') id: string){
    return this.findByIdUseCase.execute(id);
  }
  @Get()
  async findAll(){
    return this.findAllUseCase.execute();
  }
  @Patch()
  async update(@Body() dto: UpdateMembershipDto) {
    return this.updateMembershipUseCase.execute(dto);
  }
  @Delete()
  async delete(@Query('id') id: string){
    return this.deleteMembershipUseCase.execute(id);
  }
}
