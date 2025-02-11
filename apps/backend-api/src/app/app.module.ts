import { AdminModule } from '@app/backend-api/admin/admin.module';
import { AuthModule } from '@app/backend-api/auth/auth.module';
import { ConfigModule } from '@app/backend-api/config/config.module';
import { DatabaseModule } from '@app/backend-api/database/database.module';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    AdminModule,
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
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
