import { Module } from '@nestjs/common';
import { TwitchStrategy } from 'apps/backend-api/src/auth/strategies';
import { TwitchAuthGuard } from '@app/backend-api/auth/guards/twitch-auth.guard';
import { AuthController } from '@app/backend-api/auth/controllers/auth.controller';
import { AuthSerializer } from './serializers';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [TwitchStrategy, TwitchAuthGuard, AuthSerializer],
})
export class AuthModule {}
