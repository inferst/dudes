import { AuthGuard } from '@app/backend-api/auth/guards';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ActionEntity,
  testActionDtoSchema,
  TestActionDto,
  ServerToClientsEvents,
  ClientToServerEvents,
  UserActionEntity,
} from '@lib/types';
import { ActionRepository } from '../repositories/action.repository';
import { Auth } from '@app/backend-api/auth/decorators';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';
import { SocketService } from '../services';
import { Socket } from 'socket.io';

@Controller('/action')
export class ActionController {
  public constructor(
    private readonly actionRepository: ActionRepository,
    private readonly socketService: SocketService<
      Socket<ServerToClientsEvents, ClientToServerEvents>
    >
  ) {}

  @Get('/list')
  @UseGuards(AuthGuard)
  public async getActions(): Promise<ActionEntity[]> {
    return this.actionRepository.getActions();
  }

  @Post('/test')
  @UseGuards(AuthGuard)
  public async test(
    @Body(new ZodPipe(testActionDtoSchema)) data: TestActionDto,
    @Auth() user: AuthUserProps
  ): Promise<void> {
    const action = await this.actionRepository.getActionByName(data.action);
    const room = this.socketService.getRoomByUserGuid(user.guid);

    if (action && room) {
      const actionData: UserActionEntity = {
        data: data.data,
        id: action.id,
        info: {
          sprite: 'dude',
          color: 'red',
          displayName: 'Test',
        },
        name: action.name,
        title: action.title,
        userId: '-1',
        cooldown: 0,
        description: action.description,
      };

      for (const socket of room.clients) {
        socket.emit('action', actionData);
        socket.broadcast.to(user.guid).emit('action', actionData);
      }
    }
  }
}
