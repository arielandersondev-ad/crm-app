import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repositoriy";

@Injectable()
export class FindAllUsersUseCase {
  constructor (
    private readonly userRepo: UserRepository
  ){}

  async execute() {
    return this.userRepo.findAll();
  }
}