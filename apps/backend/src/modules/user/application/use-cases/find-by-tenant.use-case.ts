import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repositoriy";
import { User } from "../../domain/entities/user.entity";

@Injectable()
export class FindUsersByTenantUseCase{
  constructor(
    private readonly userRepo: UserRepository
  ){}
  async execute(tenantId: string){
    return this.userRepo.findByTenant(tenantId) 
  }
}