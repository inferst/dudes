import { ConfigService } from '@app/backend-api/config/config.service';
import { TWITCH_PLATFORM_ID } from '@app/backend-api/constants';
import { PrismaService } from '@app/backend-api/database/prisma.service';
import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';

export class TwitchAuthProvider {
  public authProvider: RefreshingAuthProvider;
  public apiClient: ApiClient;

  public constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.authProvider = new RefreshingAuthProvider({
      clientId: this.configService.twitchClientId,
      clientSecret: this.configService.twitchClientSecret,
    });

    this.authProvider.onRefresh(async (userId, newTokenData) => {
      if (newTokenData.refreshToken) {
        await this.prisma.userToken.update({
          where: {
            platformUserId_platformId: {
              platformUserId: userId,
              platformId: TWITCH_PLATFORM_ID,
            },
          },
          data: {
            refreshToken: newTokenData.refreshToken,
            accessToken: newTokenData.accessToken,
            expiresIn: newTokenData.expiresIn ?? undefined,
            obtainmentTimestamp: new Date(newTokenData.obtainmentTimestamp),
          },
        });
      }
    });

    this.apiClient = new ApiClient({ authProvider: this.authProvider });
  }

  public async addUserForToken(userId: number): Promise<void> {
    const userToken = await this.prisma.userToken.findUnique({
      where: {
        userId_platformId: {
          userId: userId,
          platformId: TWITCH_PLATFORM_ID,
        },
      },
    });

    if (userToken) {
      const obtainmentTimestamp =
        userToken.obtainmentTimestamp?.getTime();

      this.authProvider.addUser(userToken.platformUserId, {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        expiresIn: userToken.expiresIn,
        obtainmentTimestamp: obtainmentTimestamp ?? 0,
      });
    }
  }
}
