import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Settings } from '@prisma/client';
import { defaultSettingsValues } from '@lib/types';

@Injectable()
export class SettingsRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async get(userId: number): Promise<Settings> {
    const data = await this.prismaService.settings.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!data) {
      return await this.prismaService.settings.create({
        data: {
          data: defaultSettingsValues,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }

    return data;
  }

  public async update(
    userId: number,
    data: Prisma.SettingsUpdateInput
  ): Promise<Settings> {
    const settings = await this.prismaService.settings.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (settings) {
      return this.prismaService.settings.update({
        data,
        where: {
          user: {
            id: userId,
          },
          id: settings.id,
        },
      });
    } else {
      return this.prismaService.settings.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          data: defaultSettingsValues,
        },
      });
    }
  }
}
