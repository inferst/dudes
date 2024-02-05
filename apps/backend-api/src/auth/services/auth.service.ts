import { UserRepository } from '@app/backend-api/auth/repositories/user.repository';
import { ConfigService } from '@app/backend-api/config/config.service';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UserTokenRepository } from '../repositories/user-token.repository';
import { SeedService } from './seed.service';
import { HttpStatusCode } from 'axios';

export type AuthUserProps = {
  userId: number;
  guid: string;
  displayName: string;
  profileImageUrl: string;
  platformUserId: string;
};

type WithData<T> = {
  data: T;
};

type TwitchUser = {
  id: string;
  display_name: string;
  profile_image_url: string;
  login: string;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  public constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly userTokenRepository: UserTokenRepository,
    private readonly commandRepository: SeedService
  ) {}

  public async validate(
    accessToken: string,
    refreshToken: string
  ): Promise<AuthUserProps> {
    const result = await this.getTwitchUserInfo(accessToken);

    const userToken = await this.userTokenRepository.updateOrCreate({
      userId: result.id,
      login: result.login,
      accessToken,
      refreshToken,
    });

    const user = await this.userRepository.getByIdOrCreate(userToken.userId);

    await this.commandRepository.createDefaultCommands(user);

    return {
      userId: user.id,
      guid: user.guid,
      platformUserId: result.id,
      profileImageUrl: result.profile_image_url,
      displayName: result.display_name,
    };
  }

  public async logout(accessToken: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(
          'https://id.twitch.tv/oauth2/revoke',
          `token=${accessToken}&client_id=${this.configService.twitchClientId}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
      );
    } catch (error) {
      // TODO: check prod error
      this.logger.error('Failed to logout.', {
        message: error.response.data,
      });
    }
  }

  private async getTwitchUserInfo(accessToken: string): Promise<TwitchUser> {
    const {
      data: { data },
    } = await firstValueFrom(
      this.httpService.get<WithData<TwitchUser[]>>(
        'https://api.twitch.tv/helix/users',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.twitchtv.v5+json',
            'Client-Id': this.configService.twitchClientId,
          },
        }
      )
    );

    if (data.length === 0) {
      // TODO: convert to more precise exception.
      throw new HttpException(
        'Twitch user is not found.',
        HttpStatusCode.InternalServerError
      );
    }

    const [user] = data;
    return user;
  }
}
