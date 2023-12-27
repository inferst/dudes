import { AdminModule } from '@app/backend-api/admin/admin.module';
import { AuthModule } from '@app/backend-api/auth/auth.module';
import { ConfigModule } from '@app/backend-api/config/config.module';
import { DatabaseModule } from '@app/backend-api/database/database.module';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './controllers/app.controller';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend-client'),
      renderPath: '*',
      serveRoot: '/client',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend-admin'),
      renderPath: '*',
      serveRoot: '/admin',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
