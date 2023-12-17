import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from 'apps/backend-api/src/admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@app/backend-api/auth/auth.module';

@Module({
  imports: [
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
  providers: [AppService],
})
export class AppModule {}
