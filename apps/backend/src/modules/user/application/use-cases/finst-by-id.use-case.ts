import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repositoriy";

@Injectable()
export class FindByIdUseCase {
  constructor(private readonly userRepo: UserRepository) {}
  async execute(id: string) {
    return this.userRepo.findById(id);
  }
}