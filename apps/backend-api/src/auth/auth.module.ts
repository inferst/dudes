import { Module } from '@nestjs/common';
import { TwitchAuthGuard } from '@app/backend-api/auth/guards/twitch-auth.guard';
import { AuthController } from '@app/backend-api/auth/controllers/auth.controller';
import { AuthSerializer } from './serializers';
import { ConfigService, AuthService } from '@app/backend-api/auth/services';
import { HttpModule } from '@nestjs/axios';
import { UserRepository } from '@app/backend-api/auth/repositories';
import { TwitchStrategy } from '@app/backend-api/auth/strategies';

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
