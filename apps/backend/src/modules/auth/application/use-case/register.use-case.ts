import { Injectable, Logger } from "@nestjs/common";
import { FindByEmailUseCase } from "../../../user/application/use-cases/find-by-email.use-case";
import * as bcrypt from 'bcrypt';
import { CreateTenantUseCase } from "../../../tenant/aplication/use-cases/create-tenant.use-case";
import { CreateUserUseCase } from "../../../user/application/use-cases/create-user.use-case";
import { DeleteTenantUseCase } from "../../../tenant/aplication/use-cases/delete-tenant.use-case";
import { CreateMembershipUseCase } from "../../../membership/application/use-case/create-membership.use-case";
import { UserRole } from "@prisma/client";
import { DeleteUserUseCase } from "../../../user/application/use-cases/delete-user.use-case";
@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly findByEmailUseCase: FindByEmailUseCase,
    private readonly createTenantUseCase: CreateTenantUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteTenantUseCase: DeleteTenantUseCase,
    private readonly createMembershipUseCase: CreateMembershipUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}
  async execute(email: string, password: string, nombres: string, apellidos: string, rol?: string) {
    Logger.log (`datos: ${email}, ${password}, ${nombres}, ${apellidos}, ${rol || 'unknown'}`)
    
    Logger.log('1 validando Email');
    const existUser = await this.findByEmailUseCase.execute(email);
    if (existUser) {
      throw new Error('Email ya esta en uso');
    }

    Logger.log('2 Hasheando Password');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    Logger.log('3 creando tenant');
    const tenant = await this.createTenantUseCase.execute({name: 'Nombre-Empresa'});
    if (!tenant) {
      throw new Error('Error creando tenant');
    }
    Logger.log('4 Creando user');
    const user = await this.createUserUseCase.execute({email: email, password: hashedPassword, firstName: nombres, lastName: apellidos});
    if (!user) {
      Logger.log('Eliminando el tenant debido al error al crear user. Tenant id: ', tenant.id);
      await this.deleteTenantUseCase.execute(tenant.id);
      throw new Error('Error creando user');
    }

    Logger.log('5 creando membership');
    const membership = await this.createMembershipUseCase.execute({userId: user.id, tenantId: tenant.id, role: rol ?? UserRole.ADMIN});
    if (!membership) {
      Logger.log('Eliminando el tenant y usuario debido al error al crear membership. Tenant id: ', tenant.id, 'User id: ', user.id);
      await this.deleteTenantUseCase.execute(tenant.id);
      await this.deleteUserUseCase.execute({id: user.id});
      throw new Error('Error creando membership');
    }

    Logger.log('6 creando session');
  }
}