import { TwitchApiClientFactory } from '@app/backend-api/admin/api-clients/twitch-api-client';
import { EventsGateway } from '@app/backend-api/admin/gateways';
import { UserRepository } from '@app/backend-api/admin/repositories';
import { ActionService, ChatMessageService, SocketService } from '@app/backend-api/admin/services';
import { Module } from '@nestjs/common';
import { ChatClientFactory } from './chat-clients/chat-client-factory';
import { TwitchChatClientFactory } from './chat-clients/twitch-chat-client.factory';
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
    TwitchRewardRepository,
    TwitchUserFilterService,
    TwitchChatClientFactory,
    TwitchApiClientFactory,
    ChatClientFactory,
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
