import {
  ClientToServerEvents,
  MessageEntity,
  RaidData,
  ServerToClientsEvents,
  SettingsEntity,
  TwitchChatterEntity,
  UserActionEntity
} from '@lib/types';
import { Socket, io } from 'socket.io-client';

export class Connection {
  private socket!: Socket<ServerToClientsEvents, ClientToServerEvents>;

  public init(): void {
    const path = window.location.pathname.split('/');
    const userGuid = path[path.length - 1];

    const socket = io(import.meta.env.VITE_CLIENT_SOCKET_HOST, {
      transports: ['websocket'],
      auth: {
        userGuid,
      },
    });

    this.socket = socket;
  }

  public onMessage(callback: (data: MessageEntity) => void): void {
    this.socket.on('message', callback);
  }

  public onAction(callback: (data: UserActionEntity) => void): void {
    this.socket.on('action', callback);
  }

  public onSettings(callback: (data: SettingsEntity) => void): void {
    this.socket.on('settings', callback);
  }

  public onChatters(callback: (data: TwitchChatterEntity[]) => void): void {
    this.socket.on('chatters', callback);
  }

  public onRaid(callback: (data: RaidData) => void): void {
    this.socket.on('raid', callback);
  }
}
