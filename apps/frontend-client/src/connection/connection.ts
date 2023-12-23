import { Socket, io } from 'socket.io-client';

export type Message = {
  name: string;
  userId: string;
  message: string;
  color: string;
  emotes: string[];
};

type ServerToClientsEvents = {
  message: (data: Message) => void;
};

export interface ClientToServerEvents {
  initialize: (data: { roomId: string }) => void;
}

export class Connection {
  private socket?: Socket<ServerToClientsEvents, ClientToServerEvents>;

  public init(): void {
    console.log('init');

    const path = window.location.pathname.split('/');
    const userGuid = path[path.length - 1];

    const socket = io(
      import.meta.env.VITE_CLIENT_SOCKET_HOST,
      {
        transports: ['websocket'],
        auth: {
          userGuid,
        },
      }
    );

    this.socket = socket;
  }

  public onMessage(callback: (data: Message) => void): void {
    this.socket?.on('message', callback);
  }
}
