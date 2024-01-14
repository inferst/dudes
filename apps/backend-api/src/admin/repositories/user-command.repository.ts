import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Command } from '@prisma/client';

@Injectable()
export class UserCommandRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getComomandsByUserId(userId: number): Promise<Command[]> {
    return this.prismaService.command.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  public async update(
    userId: number,
    userCommandId: number,
    data: Prisma.CommandUpdateInput
  ): Promise<Command> {
    return this.prismaService.command.update({
      data,
      where: {
        id: userCommandId,
      },
    });
  }
}
