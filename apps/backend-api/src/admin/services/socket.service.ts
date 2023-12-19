import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import * as tmi from 'tmi.js';
import { UserRepository } from '@app/backend-api/admin/repositories';
import { User } from '@app/backend-api/admin/repositories/user.repository';

type ClientSocket = {
  socket: Socket;
  roomId?: string;
};

type Room = {
  tmi: tmi.Client;
  clients: Socket[];
};

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);

  private readonly connectedClients: Map<string, ClientSocket> = new Map();
  private readonly rooms: Map<string, Room> = new Map();

  public constructor(private readonly userRepository: UserRepository) {}

  public handleDisconnect(socket: Socket): void {
    const connectedClient = this.connectedClients.get(socket.id);

    if (connectedClient.roomId) {
      const room = this.rooms.get(connectedClient.roomId);
      const clients = room.clients.filter(
        (client) => client != connectedClient.socket
      );

      if (clients.length > 0) {
        this.rooms.set(connectedClient.roomId, { ...room, clients });
      } else {
        void room.tmi.disconnect();
        this.rooms.delete(connectedClient.roomId);
        this.logger.log(
          'Room disconnected with name: ' + room.tmi.getUsername()
        );
      }
    }

    this.connectedClients.delete(socket.id);
    this.logger.log('Socket disconnected with id: ' + socket.id);
  }

  public async handleConnection(socket: Socket): Promise<void> {
    this.connectedClients.set(socket.id, { socket });
    this.logger.log('Socket connected with id: ' + socket.id);

    const userGuid = socket.handshake.auth.userGuid;
    if (!userGuid) {
      this.logger.warn('User guid does not provided.');
      socket.disconnect();
      return;
    }

    let user: User;

    try {
      user = await this.userRepository.getUserByGuid(userGuid);
    } catch (e) {
      this.logger.error('Failed to fetch the user.', {
        e,
      });
    }

    if (!user) {
      this.logger.log('The room does not provided or user does not exist.');
      socket.disconnect();
      return;
    }

    this.logger.log('Room initialize with name: ' + userGuid);

    const roomIsEmpty = !this.rooms.has(userGuid);

    await socket.join(userGuid);

    if (roomIsEmpty) {
      const tmiClient = new tmi.Client({
        channels: [userGuid],
      });

      void tmiClient.connect();

      tmiClient.on('chat', (_channel, tags: tmi.CommonUserstate, message) => {
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

        this.emitToRoom(socket, userGuid, 'message', {
          name: tags['display-name'],
          userId: tags['user-id'],
          message: updatedMessage,
          color: tags['color'],
          emotes: emotes,
        });
      });

      const room = this.rooms.get(userGuid);

      this.rooms.set(userGuid, { ...room, tmi: tmiClient });
    }
  }

  private emitToRoom<T>(
    socket: Socket,
    roomId: string,
    name: string,
    data: T
  ): void {
    socket.emit(name, data);
    socket.broadcast.to(roomId).emit(name, data);
  }
}