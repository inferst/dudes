import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@app/backend-api/database/prisma.service';

@Injectable()
export class UserRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getByTwitchIdOrCreate(
    data: Prisma.UserCreateInput
  ): Promise<User> {
    return this.prismaService.user.upsert({
      where: {
        twitchId: data.twitchId,
      },
      update: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        twitchLogin: data.twitchLogin,
        tokenRevoked: data.tokenRevoked,
      },
      create: data,
    });
  }

  public async createUserCommandsIfNotExists(userId: number): Promise<void> {
    const commands = await this.prismaService.command.findMany();

    for (const command of commands) {
      await this.prismaService.userCommand.upsert({
        where: {
          userId_commandId: {
            commandId: command.id,
            userId: userId,
          },
        },
        update: {},
        create: {
          text: '!' + command.name,
          commandId: command.id,
          userId: userId,
          cooldown: 0,
          isActive: false,
        },
      });
    }
  }
}
