import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/backend-api/database/prisma.service';

@Injectable()
export class CommandRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createDefaultCommands(userId: number): Promise<void> {
    const actions = await this.prismaService.action.findMany();

    for (const action of actions) {
      const isFound = await this.prismaService.command.findFirst({
        where: {
          action: {
            id: action.id,
          },
          user: {
            id: userId,
          },
        },
      });

      if (!isFound) {
        await this.prismaService.command.create({
          data: {
            text: `!${action.name}`,
            cooldown: 0,
            isActive: true,
            action: {
              connect: {
                id: action.id,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });
      }
    }
  }
}
