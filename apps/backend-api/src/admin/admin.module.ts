import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { SocketService } from '@app/backend-api/admin/services';
import { EventsGateway } from '@app/backend-api/admin/gateways';
import { UserRepository } from '@app/backend-api/admin/repositories';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [EventsGateway, SocketService, UserRepository],
})
export class AdminModule {}
