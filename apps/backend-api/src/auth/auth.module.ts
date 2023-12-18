import { Module } from '@nestjs/common';
import { TwitchStrategy } from 'apps/backend-api/src/auth/strategies';
import { TwitchAuthGuard } from '@app/backend-api/auth/guards/twitch-auth.guard';
import { AuthController } from '@app/backend-api/auth/controllers/auth.controller';
import { AuthSerializer } from './serializers';
import { ConfigService, AuthService } from '@app/backend-api/auth/services';
import { HttpModule } from '@nestjs/axios';
import { UserRepository } from '@app/backend-api/auth/repositories';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TwitchStrategy,
    TwitchAuthGuard,
    AuthSerializer,
    ConfigService,
    UserRepository,
  ],
})
export class AuthModule {}
