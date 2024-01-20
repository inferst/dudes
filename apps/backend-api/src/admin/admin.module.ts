import { Module } from '@nestjs/common';
import { CommandController, UserController } from './controllers';
import { BotService, SocketService } from '@app/backend-api/admin/services';
import { EventsGateway } from '@app/backend-api/admin/gateways';
import { UserRepository } from '@app/backend-api/admin/repositories';
import { TwitchApiClientFactory } from '@app/backend-api/admin/twitch-api-client';
import { CommandRepository } from './repositories/command.repository';
import { RewardController } from './controllers/reward.controller';
import { RewardRepository } from './repositories/reward.repository';
import { ActionController } from './controllers/action.controller';
import { ActionRepository } from './repositories/action.repository';
import { SettingsController } from './controllers/settings.controller';
import { SettingsRepository } from './repositories/settings.repository';

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
    BotService,
    EventsGateway,
    SocketService,
    UserRepository,
    RewardRepository,
    CommandRepository,
    ActionRepository,
    SettingsRepository,
    TwitchApiClientFactory,
  ],
})
export class AdminModule {}
