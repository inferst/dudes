import { Module } from '@nestjs/common';
import { CommandController, UserController } from './controllers';
import { SocketService } from '@app/backend-api/admin/services';
import { EventsGateway } from '@app/backend-api/admin/gateways';
import { UserRepository } from '@app/backend-api/admin/repositories';
import { TwitchApiClientFactory } from '@app/backend-api/admin/twitch-api-client';
import { UserCommandRepository } from './repositories/user-command.repository';
import { RewardController } from './controllers/reward.controller';
import { RewardRepository } from './repositories/reward.repository';

@Module({
  imports: [],
  controllers: [UserController, CommandController, RewardController],
  providers: [
    EventsGateway,
    SocketService,
    UserRepository,
    RewardRepository,
    UserCommandRepository,
    TwitchApiClientFactory,
  ],
})
export class AdminModule {}
