import { Module } from '@nestjs/common';
import { TwitchAuthGuard } from '@app/backend-api/auth/guards/twitch-auth.guard';
import { AuthController } from '@app/backend-api/auth/controllers/auth.controller';
import { AuthSerializer } from './serializers';
import { AuthService } from '@app/backend-api/auth/services';
import { HttpModule } from '@nestjs/axios';
import { UserRepository } from '@app/backend-api/auth/repositories';
import { TwitchStrategy } from '@app/backend-api/auth/strategies';
import { SeedService } from './services/seed.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TwitchStrategy,
    TwitchAuthGuard,
    AuthSerializer,
    UserRepository,
    SeedService,
  ],
})
export class AuthModule {}
