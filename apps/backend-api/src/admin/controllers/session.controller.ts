import { AdminGuard } from '@app/backend-api/auth/guards/admin.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClientToServerEvents, ServerToClientsEvents } from '@shared';
import { Socket } from 'socket.io';
import { SocketService } from '../services';

@Controller('/session')
export class SessionController {
  public constructor(
    private readonly socketService: SocketService<
      Socket<ServerToClientsEvents, ClientToServerEvents>
    >
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  public async getSessions(): Promise<unknown> {
    const entries = this.socketService.getRooms().entries();
    return Array.from(entries).map((entry) => {
      return {
        id: entry[0],
        clients: entry[1].clients.map((client) => client.id),
      };
    });
  }
}
