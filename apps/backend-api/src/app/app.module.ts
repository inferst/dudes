import { AdminModule } from '@/admin/admin.module';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@/config/config.module';
import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'frontend-client/dist'),
      renderPath: '*',
      serveRoot: '/client',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'frontend-admin/dist'),
      renderPath: '*',
      serveRoot: '/admin',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
