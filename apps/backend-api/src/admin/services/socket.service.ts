import { UserRepository } from '@app/backend-api/admin/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { UserToken } from '@prisma/client';
import { ClientToServerEvents, ServerToClientsEvents } from '@lib/types';
import { Socket } from 'socket.io';
import { SettingsRepository } from '../repositories/settings.repository';

import {
  EventClient,
  EventClientFactory,
} from '../event-client/event-client.factory';
import { ActionService } from './action.service';
import { ChatMessageService } from './chat-message.service';
import { ChatterRepository } from '../repositories/chatter.repository';

type SocketClient = {
  socket: Socket;
  roomId?: string;
};

type Room = {
  clients: Socket[];
  eventClient?: EventClient;
};

@Injectable()
export class SocketService<
  TSocket extends Socket<ClientToServerEvents, ServerToClientsEvents>
> {
  private readonly logger = new Logger(SocketService.name);

  private readonly connectedClients: Map<string, SocketClient> = new Map();
  private readonly rooms: Map<string, Room> = new Map();

  public constructor(
    private readonly userRepository: UserRepository,
    private readonly settingsRepository: SettingsRepository,
    private readonly chatterRepository: ChatterRepository,
    private readonly actionService: ActionService,
    private readonly chatMessageService: ChatMessageService,
    private readonly eventClinetFactory: EventClientFactory
  ) {}

  public getRooms(): Map<string, Room> {
    return this.rooms;
  }

  public handleDisconnect(socket: TSocket): void {
    this.processDisconnect(socket);
    this.connectedClients.delete(socket.id);
    this.logger.log('Socket disconnected with id: ' + socket.id);
  }

  private processDisconnect(socket: Socket): void {
    const connectedClient = this.connectedClients.get(socket.id);
    if (!connectedClient?.roomId) {
      return;
    }

    const room = this.rooms.get(connectedClient.roomId);
    if (!room) {
      return;
    }

    const clients = room.clients.filter(
      (client) => client.id !== connectedClient.socket.id
    );

    if (clients.length > 0) {
      this.rooms.set(connectedClient.roomId, { ...room, clients });
    } else {
      void room.eventClient?.disconnect();
      this.rooms.delete(connectedClient.roomId);
      this.logger.log('Room disconnected with name: ' + connectedClient.roomId);
    }
  }

  public async handleConnection(socket: TSocket): Promise<void> {
    this.logger.log('Socket connected with id: ' + socket.id);

    const userGuid = socket.handshake.auth.userGuid;
    if (!userGuid) {
      this.logger.warn('User guid does not provided.');
      socket.disconnect();
      return;
    }

    const user = await this.getUserByGuid(userGuid);

    if (!user) {
      this.logger.log('The room does not provided or user does not exist.');
      socket.disconnect();
      return;
    }

    const room = this.rooms.get(userGuid);

    await socket.join(userGuid);

    this.connectedClients.set(socket.id, { socket, roomId: userGuid });

    const settings = await this.settingsRepository.get(user.userId);

    socket.emit('settings', settings.data);

    if (room) {
      this.rooms.set(userGuid, { ...room, clients: [...room.clients, socket] });
      return;
    }

    this.rooms.set(userGuid, {
      clients: [socket],
    });

    this.logger.log('Room initialized with id: ' + userGuid);

    const eventClient = await this.eventClinetFactory.createFromUser(user);
    eventClient.connect();

    const connectedRoom = this.rooms.get(userGuid);

    if (connectedRoom) {
      this.rooms.set(userGuid, { ...connectedRoom, eventClient });
    }

    eventClient.onChatMessage(async (data) => {
      const action = await this.actionService.getUserActionByMessage(
        user.userId,
        data
      );

      const chatter = await this.chatterRepository.getChatterByName(
        data.info.displayName
      );

      if (action) {
        const actionData = {
          ...action,
          info: {
            ...action.info,
            sprite: chatter?.sprite,
          }
        };

        socket.emit('action', actionData);
        socket.broadcast.to(userGuid).emit('action', actionData);
      }

      const message = this.chatMessageService.formatMessage(data.message);

      if (message || data.emotes.length > 0) {
        const messageData = {
          ...data,
          message,
          info: {
            ...data.info,
            sprite: chatter?.sprite
          }
        };

        socket.emit('message', messageData);
        socket.broadcast.to(userGuid).emit('message', messageData);
      }
    });

    eventClient.onChatters((data) => {
      socket.emit('chatters', data);
      socket.broadcast.to(userGuid).emit('chatters', data);
    });

    eventClient.onRaid((data) => {
      socket.emit('raid', data);
      socket.broadcast.to(userGuid).emit('raid', data);
    });

    eventClient.onRewardRedemptionAdd(async (data) => {
      const action = await this.actionService.getUserActionByReward(
        user.userId,
        user.platformUserId,
        data
      );

      if (action) {
        socket.emit('action', action);
        socket.broadcast.to(userGuid).emit('action', action);
      }
    });

    this.logger.log('Chat client initialized in room with id: ' + userGuid);
  }

  private async getUserByGuid(userGuid: string): Promise<UserToken | null> {
    try {
      return await this.userRepository.getTwitchUserByGuid(userGuid);
    } catch (error) {
      this.logger.error('Failed to fetch the user.', {
        e: error,
      });
    }

    return null;
  }
}
