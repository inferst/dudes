import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Action } from '@repo/database';

@Injectable()
export class ActionRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getActions(): Promise<Action[]> {
    return this.prismaService.action.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}
