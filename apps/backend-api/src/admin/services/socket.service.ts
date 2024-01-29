import { UserRepository } from '@app/backend-api/admin/repositories';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserToken } from '@prisma/client';
import { ClientToServerEvents, ServerToClientsEvents } from '@shared';
import { Socket } from 'socket.io';
import { SettingsRepository } from '../repositories/settings.repository';

import { ApiClient } from '@twurple/api';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { TwitchAuthProvider } from '../api-clients/twitch-api-client/twitch-auth-provider';

type ClientSocket = {
  socket: Socket;
  roomId?: string;
};

type Room = {
  clients: Socket[];
  // chatClient?: ChatClient;
};

@Injectable()
export class SocketService<
  TSocket extends Socket<ClientToServerEvents, ServerToClientsEvents>
> {
  private readonly logger = new Logger(SocketService.name);

  private readonly connectedClients: Map<string, ClientSocket> = new Map();
  private readonly rooms: Map<string, Room> = new Map();

  public constructor(
    private readonly userRepository: UserRepository,
    private readonly settingsRepository: SettingsRepository,
    @Inject('TWITCH_AUTH_PROVIDER') private readonly twitchAuthProvider: TwitchAuthProvider,
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
      // void room?.chatClient?.disconnect();
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

    // const authProvider = new StaticAuthProvider(
    //   this.configService.twitchClientId,
    //   user.accessToken
    // );

    const apiClient = new ApiClient({ authProvider: this.twitchAuthProvider.authProvider });

    this.twitchAuthProvider.addUserForToken(user.userId);

    const listener = new EventSubWsListener({ apiClient });
    listener.start();

    listener.onChannelRedemptionAdd(user.platformUserId, async (data) => {
      const reward = await data.getReward();
      console.log(socket.id, user.platformLogin, reward.title);
    });

    // const chatClient = await this.chatClientFactory.createFromUser(user);
    // await chatClient.connect();

    // const connectedRoom = this.rooms.get(userGuid);

    // if (connectedRoom) {
    //   this.rooms.set(userGuid, { ...connectedRoom, chatClient });
    // }

    // chatClient.onChat(async (data) => {
    //   const action = await this.actionService.getUserAction(
    //     user.id,
    //     data.userId,
    //     data.message
    //   );

    //   if (action) {
    //     socket.emit('action', action);
    //     socket.broadcast.to(userGuid).emit('action', action);
    //   }

    //   const message = this.chatMessageService.formatMessage(data.message);

    //   if (message || data.emotes.length > 0) {
    //     socket.emit('message', { ...data, message });
    //     socket.broadcast.to(userGuid).emit('message', { ...data, message });
    //   }
    // });

    // chatClient.onChatters((data) => {
    //   socket.emit('chatters', data);
    //   socket.broadcast.to(userGuid).emit('chatters', data);
    // });

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
