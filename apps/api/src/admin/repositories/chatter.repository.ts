import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Chatter } from '@repo/database';

@Injectable()
export class ChatterRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getChatterById(
    userId: number,
    chatterId: string,
  ): Promise<Chatter | null> {
    const data = await this.prismaService.chatter.findFirst({
      where: {
        user: {
          id: userId,
        },
        chatterId: {
          equals: chatterId,
        },
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
    data: Prisma.ChatterUpdateInput,
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
