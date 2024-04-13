import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Chatter } from '@prisma/client';

@Injectable()
export class ChatterRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getChatterByName(name: string): Promise<Chatter | null> {
    const data = await this.prismaService.chatter.findFirst({
      where: {
        chatterName: {
          equals: name,
          mode: 'insensitive'
        }
      },
    });

    return data;
  }

  public async getChattersByUserId(userId: number): Promise<Chatter[]> {
    const data = await this.prismaService.chatter.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return data;
  }

  public async update(
    userId: number,
    id: number,
    data: Prisma.ChatterUpdateInput
  ): Promise<Chatter> {
    return this.prismaService.chatter.update({
      data,
      where: {
        id: id,
        user: {
          id: userId,
        },
      },
    });
  }

  public async create(data: Prisma.ChatterCreateInput): Promise<Chatter> {
    return this.prismaService.chatter.create({
      data,
    });
  }

  public async delete(userId: number, id: number): Promise<Chatter> {
    return this.prismaService.chatter.delete({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
  }
}
