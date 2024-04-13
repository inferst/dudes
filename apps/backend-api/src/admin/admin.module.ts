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
import { CommandController, UserController } from './controllers';
import { ActionController } from './controllers/action.controller';
import { RewardController } from './controllers/reward.controller';
import { SettingsController } from './controllers/settings.controller';
import { TwitchClientFactory } from './twitch/twitch-client.factory';
import { TwitchUserFilterService } from './twitch/twitch-user-filter.service';
import { ActionRepository } from './repositories/action.repository';
import { CommandRepository } from './repositories/command.repository';
import { SettingsRepository } from './repositories/settings.repository';
import { TwitchRewardRepository } from './repositories/twitch-reward.repository';
import { EventClientFactory } from './event-client/event-client.factory';
import { SessionController } from './controllers/session.controller';
import { HttpModule } from '@nestjs/axios';
import { ChatterController } from './controllers/chatter.controller';
import { ChatterRepository } from './repositories/chatter.repository';

const twitchClientFactory = {
  provide: 'TWITCH_CLIENT_FACTORY',
  useFactory: (
    config: ConfigService,
    prisma: PrismaService,
    twitchUserFilterService: TwitchUserFilterService,
    chasMessageService: ChatMessageService
  ): TwitchClientFactory =>
    new TwitchClientFactory(
      config,
      prisma,
      twitchUserFilterService,
      chasMessageService
    ),
  inject: [
    ConfigService,
    PrismaService,
    TwitchUserFilterService,
    ChatMessageService,
  ],
};

@Module({
  imports: [HttpModule],
  controllers: [
    UserController,
    CommandController,
    RewardController,
    ActionController,
    SettingsController,
    SessionController,
    ChatterController,
  ],
  providers: [
    twitchClientFactory,
    EventClientFactory,
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
    ChatterRepository,
  ],
})
export class AdminModule {}
