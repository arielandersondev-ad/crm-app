import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repositoriy";
@Injectable()
export class FindByEmailUseCase {
  constructor (
    private readonly userRepo: UserRepository
  ){}

  async execute(email: string) {
    if (!email) {throw new Error(`Email es requerido:__ ${email}`)}
    return this.userRepo.findByEmail(email);
  }
}