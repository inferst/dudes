import { UserRepository } from '@app/backend-api/admin/repositories';
import { TwitchApiClientFactory } from '@app/backend-api/admin/api-clients/twitch-api-client';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { ClientToServerEvents, ServerToClientsEvents } from '@shared';
import { Socket } from 'socket.io';
import {
  ChatClient,
  ChatClientFactory,
} from '../chat-clients/chat-client-factory';
import { SettingsRepository } from '../repositories/settings.repository';
import { ActionService } from './action.service';
import { TwitchUserFilterService } from '../chat-clients/twitch-user-filter.service';
import { ChatMessageService } from './chat-message.service';

type ClientSocket = {
  socket: Socket;
  roomId?: string;
};

type Room = {
  chatClient: ChatClient;
  clients: Socket[];
};

@Injectable()
export class SocketService<
  TSocket extends Socket<ClientToServerEvents, ServerToClientsEvents>
> {
  private readonly logger = new Logger(SocketService.name);

  private readonly connectedClients: Map<string, ClientSocket> = new Map();
  private readonly rooms: Map<string, Room> = new Map();

  public constructor(
    private readonly chatClientFactory: ChatClientFactory,
    private readonly botService: TwitchUserFilterService,
    private readonly chatMessageService: ChatMessageService,
    private readonly userRepository: UserRepository,
    private readonly settingsRepository: SettingsRepository,
    private readonly actionService: ActionService,
    private readonly twitchApiClientFactory: TwitchApiClientFactory
  ) {}

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
      void room.chatClient.disconnect();
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

    const settings = await this.settingsRepository.get(user.id);

    socket.emit('settings', settings.data);

    if (room) {
      this.rooms.set(userGuid, { ...room, clients: [...room.clients, socket] });
      return;
    }

    const chatClient = await this.chatClientFactory.createFromUser(user);
    await chatClient.connect();

    chatClient.onChat(async (data) => {
      const action = await this.actionService.getUserAction(
        user.id,
        data.userId,
        data.message
      );

      if (action) {
        socket.emit('action', action);
        socket.broadcast.to(userGuid).emit('action', action);
      }

      let message = this.chatMessageService.stripEmotes(
        data.message,
        data.emotes
      );

      message = this.chatMessageService.formatMessage(message);

      if (message) {
        socket.emit('message', { ...data, message });
        socket.broadcast.to(userGuid).emit('message', { ...data, message });
      }
    });

    this.logger.log('Room initialize with name: ' + userGuid);

    this.rooms.set(userGuid, {
      chatClient: chatClient,
      clients: [socket],
    });
  }

  private async getUserByGuid(userGuid: string): Promise<User | null> {
    try {
      return await this.userRepository.getUserByGuid(userGuid);
    } catch (e) {
      this.logger.error('Failed to fetch the user.', {
        e,
      });
    }

    return null;
  }
}
