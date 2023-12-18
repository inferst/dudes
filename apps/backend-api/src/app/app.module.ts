import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@app/backend-api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/backend-api/database/database.module';
import { AdminModule } from '@app/backend-api/admin/admin.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    DatabaseModule,
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
