import { Module } from '@nestjs/common';
import { CommandController, UserController } from './controllers';
import { SocketService } from '@app/backend-api/admin/services';
import { EventsGateway } from '@app/backend-api/admin/gateways';
import { UserRepository } from '@app/backend-api/admin/repositories';
import { TwitchApiClientFactory } from '@app/backend-api/admin/twitch-api-client';
import { CommandRepository } from './repositories/user-command.repository';

@Module({
  imports: [],
  controllers: [UserController, CommandController],
  providers: [
    EventsGateway,
    SocketService,
    UserRepository,
    CommandRepository,
    TwitchApiClientFactory,
  ],
})
export class AdminModule {}
