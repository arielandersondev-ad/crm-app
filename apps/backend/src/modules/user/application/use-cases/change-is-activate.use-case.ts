import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repositoriy";

@Injectable()
export class ChangeIsActiveUseCase{
  constructor(
    private readonly userRepo: UserRepository
  ){}
  execute(id: string, option: string){
    if (option==='activate'){
      return this.userRepo.activate(id)
    }
    if (option==='deactivate'){
      return this.userRepo.deactivate(id)
    }
    return 'opcion no valida'
  }
}