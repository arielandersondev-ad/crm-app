import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/infrastructure/database/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { MembershipModule } from './modules/membership/membership.module';
import { AuthModule } from './modules/auth/auth.module';
import { SucursalModule } from './modules/sucursal/sucursal.module';

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
  ],       
  controllers: [],
  providers: [],
})
export class AppModule {}