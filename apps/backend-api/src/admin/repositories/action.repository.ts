import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Action } from '@prisma/client';

@Injectable()
export class ActionRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getActionByName(name: string): Promise<Action | null> {
    return await this.prismaService.action.findFirst({
      where: {
        name,
      },
    });
  }

  public async getActions(): Promise<Action[]> {
    return this.prismaService.action.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}
