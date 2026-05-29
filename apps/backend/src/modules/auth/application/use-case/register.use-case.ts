import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { FindByEmailUseCase } from "../../../user/application/use-cases/find-by-email.use-case";
import * as bcrypt from 'bcrypt';
import { UserRole } from "@prisma/client";
import { SucursalRepository } from "../../../sucursal/domain/repositories/sucursal.repository";
import { TenantRepository } from "../../../tenant/domain/repositories/tenant.repository";
import { UserRepository } from "../../../user/domain/repositories/user.repositoriy";
import { MembershipRepository } from "../../../membership/domain/repositories/membership.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly membershipRepo: MembershipRepository,
    private readonly tenantRepo: TenantRepository,
    private readonly sucursalRepo: SucursalRepository,

    private readonly prisma: PrismaService,// para transaccion rompe un poco lo exagonal, pero sera una de las exepciones que se puede resolver (permitimos esta injection para la transaccion sin romper el patron de exagonal)
  ) {}
  async execute(email: string, password: string, nombres: string, apellidos: string, rol?: string) {
    
    Logger.log('1 validando Email (agregar validacion de contraseña)');
    const existUser = await this.userRepo.findByEmail(email);
    if (existUser) {
      throw new ConflictException('Email ya esta en uso');
    }

    Logger.log('2 Hasheando Password');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return this.prisma.$transaction(async (tx) => {

      Logger.log('3 creando tenant');
      const tenant = await this.tenantRepo.create(tx,'Mi empresa');

      Logger.log('3.1 Crear una sucursal por defecto');
      const sucursal = await this.sucursalRepo.create(tx,'Sucursal-Principal', '-', 0, 0,'', email, tenant.id);
      
      Logger.log('4 Creando user');
      const user = await this.userRepo.create(tx,email, hashedPassword, nombres, apellidos);

      Logger.log('5 creando membership');
      const membership = await this.membershipRepo.create(tx,user.id, tenant.id, rol as UserRole ?? UserRole.ADMIN);

      return {
        tenant,
        sucursal,
        user,
        membership,
      }
    })


    
    Logger.log('6 creando session');
    Logger.log('7 responder con el token, usuario, tenant y sucursal');
    Logger.log('8 meter todo dentro de una transacccion para evitar inconsistencias en los datos agregados(una especi de rollback cuando algo falle a mitad del caso de uso)');
  }
}