import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Command } from '@repo/database';

@Injectable()
export class CommandRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getCommandsByUserId(userId: number): Promise<Command[]> {
    return this.prismaService.command.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  public async getActiveCommandsByUserId(userId: number): Promise<Command[]> {
    return this.prismaService.command.findMany({
      where: {
        userId: userId,
        isActive: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  public async update(
    userId: number,
    commandId: number,
    data: Prisma.CommandUpdateInput,
  ): Promise<Command> {
    return this.prismaService.command.update({
      data,
      where: {
        id: commandId,
        user: {
          id: userId,
        },
      },
    });
  }

  public async create(data: Prisma.CommandCreateInput): Promise<Command> {
    return this.prismaService.command.create({
      data,
    });
  }

  public async delete(userId: number, id: number): Promise<Command> {
    return this.prismaService.command.delete({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
  }
}
