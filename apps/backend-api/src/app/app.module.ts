import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@app/backend-api/auth/auth.module';
import { DatabaseModule } from '@app/backend-api/database/database.module';
import { AdminModule } from '@app/backend-api/admin/admin.module';
import { ConfigModule } from '@app/backend-api/config/config.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    DatabaseModule,
    ConfigModule,
    PassportModule.register({ session: true }),
    RouterModule.register([
      {
        path: '/auth',
        module: AuthModule,
      },
      {
        path: '/admin',
        module: AdminModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
