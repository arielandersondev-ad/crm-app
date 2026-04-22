import { Logger } from "@nestjs/common";

export class RegisterUseCase {
  async execute() {
    Logger.log('validando Email');
    Logger.log('Hasheando Password');
    Logger.log('creando tenant');
    Logger.log('Creando user');
    Logger.log('creando membership');
    Logger.log('creando session');
    //await this.authRepository.register();
    //return this.authRepository.register();
  }
}