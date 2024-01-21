import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import * as tmi from 'tmi.js';
import { UserRepository } from '@app/backend-api/admin/repositories';
import {
  TwitchApiClientFactory,
  TokenRevokedException,
  TwitchApiClient,
} from '@app/backend-api/admin/twitch-api-client';
import { User } from '@prisma/client';
import { SettingsRepository } from '../repositories/settings.repository';
import { ClientToServerEvents, ServerToClientsEvents } from '@shared';
import { BotService } from './bot.service';
import { ChatterEntity } from 'shared/src/dto/socket/chatters';
import { ActionService } from './action.service';

const CHATTERS_SEND_INTERVAL = 60 * 1000; // 1 minute.

type ClientSocket = {
  socket: Socket;
  roomId?: string;
};

type Room = {
  timerId: NodeJS.Timer;
  tmi: tmi.Client;
  twitchApi: TwitchApiClient;
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
    private readonly botService: BotService,
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
      clearInterval(room.timerId);
      void room.tmi.disconnect();
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

    const tmiClient = new tmi.Client({
      channels: [user.twitchLogin],
    });

    await tmiClient.connect();

    tmiClient.on(
      'chat',
      async (_channel, tags: tmi.CommonUserstate, message) => {
        let updatedMessage = message;
        const emotes = [];

        const emotesArray = Object.entries(tags.emotes ?? {}).map((entity) => {
          const range = entity[1][0].split('-');
          const start = Number(range[0]);
          const end = Number(range[1]) + 1;

          return message.substring(start, end);
        });

        for (const emote in tags.emotes) {
          emotes.push(`https://static-cdn.jtvnw.net/emoticons/v1/${emote}/3.0`);
        }

        for (const code of emotesArray ?? []) {
          updatedMessage = updatedMessage.replaceAll(code, '');
        }

        updatedMessage = updatedMessage.replace(/\s+/g, ' ').trim();

        if (tags['display-name'] && tags['user-id']) {
          const data = {
            name: tags['display-name'],
            userId: tags['user-id'],
            message: updatedMessage,
            color: tags['color'],
            emotes: emotes,
          };

          socket.emit('message', data);
          socket.broadcast.to(userGuid).emit('message', data);

          const action = await this.actionService.getUserAction(
            user.id,
            data.userId,
            updatedMessage
          );

          if (action) {
            socket.emit('action', action);
            socket.broadcast.to(userGuid).emit('action', action);
          }
        }
      }
    );

    const twitchApiClient = await this.twitchApiClientFactory.createFromUserId(
      user.id
    );

    const timerId = setInterval(async () => {
      try {
        const chatters = await this.getChatters(user);

        socket.emit('chatters', chatters);
        socket.broadcast.to(userGuid).emit('chatters', chatters);
      } catch (e) {
        if (e instanceof TokenRevokedException) {
          // Token is revoked, do nothing.
          return;
        }

        this.logger.error('Failed to send chatters.', {
          e,
        });
      }
    }, CHATTERS_SEND_INTERVAL);

    this.logger.log('Room initialize with name: ' + userGuid);

    this.rooms.set(userGuid, {
      tmi: tmiClient,
      clients: [socket],
      timerId,
      twitchApi: twitchApiClient,
    });
  }

  private async getChatters(user: User): Promise<ChatterEntity[]> {
    const room = this.rooms.get(user.guid);

    if (!room) {
      return [];
    }

    const twitchApi = room.twitchApi;
    const chatters = await twitchApi.getChatters(user.twitchId);

    return chatters
      .filter((chatter) => !this.botService.isBot(chatter.user_login))
      .map((chatter) => ({
        userId: chatter.user_id,
        name: chatter.user_name,
      }));
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
