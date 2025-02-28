import { Module } from '@nestjs/common';
import { TwitchAuthGuard } from '@/auth/guards/twitch-auth.guard';
import { AuthController } from '@/auth/controllers/auth.controller';
import { AuthSerializer } from './serializers';
import { AuthService } from '@/auth/services';
import { HttpModule } from '@nestjs/axios';
import { UserRepository } from '@/auth/repositories';
import { TwitchStrategy } from '@/auth/strategies';
import { SeedService } from './services/seed.service';
import { UserTokenRepository } from './repositories/user-token.repository';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TwitchStrategy,
    TwitchAuthGuard,
    AuthSerializer,
    UserRepository,
    UserTokenRepository,
    SeedService,
  ],
})
export class AuthModule {}
