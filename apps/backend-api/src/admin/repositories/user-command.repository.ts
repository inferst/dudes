import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Prisma, UserCommand } from '@prisma/client';

export { Command } from '@prisma/client';

@Injectable()
export class CommandRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getComomandsByUserId(userId: number): Promise<UserCommand[]> {
    return this.prismaService.userCommand.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        id: 'asc'
      }
    });
  }

  public async patch(
    commandId: number,
    data: Prisma.XOR<Prisma.CommandUpdateInput, Prisma.CommandUncheckedUpdateInput>
  ): Promise<UserCommand> {
    return this.prismaService.userCommand.update({
      data,
      where: {
        id: commandId,
      },
    });
  }
}
