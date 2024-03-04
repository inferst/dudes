import { Socket } from 'socket.io';
import { SocketService } from '@app/backend-api/admin/services';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ClientToServerEvents, ServerToClientsEvents } from '@libs/types';

@WebSocketGateway({
  cors: true,
  transport: ['websocket'],
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server!: Socket;

  public constructor(
    private readonly socketService: SocketService<
      Socket<ServerToClientsEvents, ClientToServerEvents>
    >
  ) {}

  public handleDisconnect(socket: Socket): void {
    this.socketService.handleDisconnect(socket);
  }

  public handleConnection(socket: Socket): void {
    void this.socketService.handleConnection(socket);
  }
}
