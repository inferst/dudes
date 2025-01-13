import { EventsGateway } from '@app/backend-api/admin/gateways';
import {
  UserRepository,
  UserSkinCollectionRepository,
  UserSkinRepository,
} from '@app/backend-api/admin/repositories';
import {
  ActionService,
  ChatMessageService,
  SocketService,
  SpriteService,
} from '@app/backend-api/admin/services';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { PrismaService } from '../database/prisma.service';
import {
  CommandController,
  SpriteController,
  UserController,
} from './controllers';
import { ActionController } from './controllers/action.controller';
import { ChatterController } from './controllers/chatter.controller';
import { RewardController } from './controllers/reward.controller';
import { SessionController } from './controllers/session.controller';
import { SettingsController } from './controllers/settings.controller';
import { UserSkinCollectionController } from './controllers/user-skin-collection.controller';
import { UserSkinController } from './controllers/user-skin.controller';
import { EventClientFactory } from './event-client/event-client.factory';
import { ActionRepository } from './repositories/action.repository';
import { ChatterRepository } from './repositories/chatter.repository';
import { CommandRepository } from './repositories/command.repository';
import { SettingsRepository } from './repositories/settings.repository';
import { TwitchRewardRepository } from './repositories/twitch-reward.repository';
import { ChatterService } from './services/chatter.service';
import { EmoteService } from './services/emote.service';
import { TwitchClientFactory } from './twitch/twitch-client.factory';
import { TwitchUserFilterService } from './twitch/twitch-user-filter.service';

const twitchClientFactory = {
  provide: 'TWITCH_CLIENT_FACTORY',
  useFactory: (
    config: ConfigService,
    prisma: PrismaService,
    twitchUserFilterService: TwitchUserFilterService,
    chatMessageService: ChatMessageService
  ): TwitchClientFactory =>
    new TwitchClientFactory(
      config,
      prisma,
      twitchUserFilterService,
      chatMessageService
    ),
  inject: [
    ConfigService,
    PrismaService,
    TwitchUserFilterService,
    ChatMessageService,
    EmoteService,
  ],
};

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [
    UserController,
    CommandController,
    RewardController,
    ActionController,
    SettingsController,
    SessionController,
    ChatterController,
    SpriteController,
    UserSkinCollectionController,
    UserSkinController,
  ],
  providers: [
    twitchClientFactory,
    EventClientFactory,
    TwitchRewardRepository,
    TwitchUserFilterService,
    ChatMessageService,
    EmoteService,
    EventsGateway,
    SocketService,
    ActionService,
    ChatterService,
    SpriteService,
    UserRepository,
    CommandRepository,
    ActionRepository,
    SettingsRepository,
    ChatterRepository,
    UserSkinRepository,
    UserSkinCollectionRepository,
  ],
})
export class AdminModule {}
