import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/infrastructure/database/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { MembershipModule } from './modules/membership/membership.module';
import { AuthModule } from './modules/auth/auth.module';
import { SucursalModule } from './modules/sucursal/sucursal.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { ServiceModule } from './modules/service/service.module';
import { VisitaModule } from './modules/visitas/visita-module';
import { VisitDetailModule } from './modules/visit-detail/visit-detail.module';
import { PagoModule } from './modules/pago/pago.module';
import { CitaModule } from './modules/cita/cita.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    UserModule,
    TenantModule,
    SucursalModule,
    MembershipModule,
    AuthModule,
    VisitDetailModule,
    ClienteModule,
    ServiceModule,
    VisitaModule,
    PagoModule,
    CitaModule,
  ],       
  controllers: [],
  providers: [],
})
export class AppModule {}