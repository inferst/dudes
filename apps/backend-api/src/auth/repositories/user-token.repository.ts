import { TWITCH_PLATFORM_ID } from '@/constants';
import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserToken } from '@repo/database';

export type TwitchUserTokenProps = {
  userId: string;
  login: string;
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class UserTokenRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findByUserId(userId: number): Promise<UserToken | null> {
    return await this.prismaService.userToken.findFirst({
      where: {
        userId,
      },
    });
  }

  public async updateOrCreate(data: TwitchUserTokenProps): Promise<UserToken> {
    const userToken = await this.prismaService.userToken.findUnique({
      where: {
        platformUserId_platformId: {
          platformId: TWITCH_PLATFORM_ID,
          platformUserId: data.userId,
        },
      },
    });

    if (!userToken) {
      const user = await this.prismaService.user.create({
        data: {},
      });

      return await this.prismaService.userToken.create({
        data: {
          userId: user.id,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          platformUserId: data.userId,
          platformLogin: data.login,
          platformId: TWITCH_PLATFORM_ID,
          isTokenRevoked: false,
        },
      });
    }

    return await this.prismaService.userToken.update({
      where: {
        platformUserId_platformId: {
          platformId: TWITCH_PLATFORM_ID,
          platformUserId: data.userId,
        },
      },
      data: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        platformLogin: data.login,
        isTokenRevoked: false,
      },
    });
  }
}
