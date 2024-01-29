import { EventsGateway } from '@app/backend-api/admin/gateways';
import { UserRepository } from '@app/backend-api/admin/repositories';
import {
  ActionService,
  ChatMessageService,
  SocketService,
} from '@app/backend-api/admin/services';
import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { PrismaService } from '../database/prisma.service';
import { TwitchAuthProvider } from './api-clients/twitch-api-client/twitch-auth-provider';
import { TwitchUserFilterService } from './chat-clients/twitch-user-filter.service';
import { CommandController, UserController } from './controllers';
import { ActionController } from './controllers/action.controller';
import { RewardController } from './controllers/reward.controller';
import { SettingsController } from './controllers/settings.controller';
import { ActionRepository } from './repositories/action.repository';
import { CommandRepository } from './repositories/command.repository';
import { SettingsRepository } from './repositories/settings.repository';
import { TwitchRewardRepository } from './repositories/twitch-reward.repository';

@Module({
  imports: [],
  controllers: [
    UserController,
    CommandController,
    RewardController,
    ActionController,
    SettingsController,
  ],
  providers: [
    {
      provide: 'TWITCH_AUTH_PROVIDER',
      useFactory: (
        config: ConfigService,
        prisma: PrismaService
      ): TwitchAuthProvider => new TwitchAuthProvider(config, prisma),
      inject: [ConfigService, PrismaService],
    },
    TwitchRewardRepository,
    TwitchUserFilterService,
    ChatMessageService,
    EventsGateway,
    SocketService,
    ActionService,
    UserRepository,
    CommandRepository,
    ActionRepository,
    SettingsRepository,
  ],
})
export class AdminModule {}
