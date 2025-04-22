import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Prisma, User, UserToken } from '@repo/database';
import { TWITCH_PLATFORM_ID } from '@/constants';

@Injectable()
export class UserRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getUserByGuid(guid: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        guid,
      },
    });
  }

  public async getTwitchUserByGuid(guid: string): Promise<UserToken | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        guid: {
          equals: guid,
        },
      },
    });

    if (user) {
      const userToken = await this.prismaService.userToken.findUnique({
        where: {
          userId_platformId: {
            userId: user.id,
            platformId: TWITCH_PLATFORM_ID,
          },
        },
      });

      return userToken;
    }

    return null;
  }

  public async getUserById(userId: number): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
  }

  public async update(
    userId: number,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prismaService.user.update({
      data,
      where: {
        id: userId,
      },
    });
  }
}
