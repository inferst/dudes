import { Module } from '@nestjs/common';
import { CommandController, UserController } from './controllers';
import { ActionService, ChatMessageService, SocketService } from '@app/backend-api/admin/services';
import { EventsGateway } from '@app/backend-api/admin/gateways';
import { UserRepository } from '@app/backend-api/admin/repositories';
import { TwitchApiClientFactory } from '@app/backend-api/admin/api-clients/twitch-api-client';
import { CommandRepository } from './repositories/command.repository';
import { RewardController } from './controllers/reward.controller';
import { RewardRepository } from './repositories/reward.repository';
import { ActionController } from './controllers/action.controller';
import { ActionRepository } from './repositories/action.repository';
import { SettingsController } from './controllers/settings.controller';
import { SettingsRepository } from './repositories/settings.repository';
import { TwitchUserFilterService } from './chat-clients/twitch-user-filter.service';
import { TwitchChatClientFactory } from './chat-clients/twitch-chat-client.factory';
import { ChatClientFactory } from './chat-clients/chat-client-factory';

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
    TwitchUserFilterService,
    TwitchChatClientFactory,
    TwitchApiClientFactory,
    ChatClientFactory,
    ChatMessageService,
    EventsGateway,
    SocketService,
    ActionService,
    UserRepository,
    RewardRepository,
    CommandRepository,
    ActionRepository,
    SettingsRepository,
  ],
})
export class AdminModule {}
