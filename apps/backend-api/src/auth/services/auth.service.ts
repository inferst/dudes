import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '@app/backend-api/auth/repositories/user.repository';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InvalidTokenException } from '@app/backend-api/auth/exceptions';
import { ConfigService } from '@app/backend-api/config/config.service';

export type AuthUserProps = {
  name: string;
  picture: string;
  twitchId: string;
  userId: number;
  guid: string;
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
    private readonly userRepository: UserRepository
  ) {}

  public async validate(
    accessToken: string,
    refreshToken: string
  ): Promise<AuthUserProps> {
    await this.validateToken(accessToken);
    const result = await this.getTwitchUserInfo(accessToken);

    const {
      twitchId,
      id: userId,
      guid,
    } = await this.userRepository.getByTwitchIdOrCreate({
      twitchId: result.id,
      accessToken,
      refreshToken,
      twitchLogin: result.login,
      tokenRevoked: false,
    });

    await this.userRepository.createUserCommandsIfNotExists(userId);

    return {
      guid,
      userId,
      twitchId,
      picture: result.profile_image_url,
      name: result.display_name,
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
    } catch (e) {
      this.logger.error('Failed to logout.', {
        message: e.response.data,
      });
    }
  }

  public async validateToken(accessToken: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.get('https://id.twitch.tv/oauth2/validate', {
          headers: {
            Authorization: `OAuth ${accessToken}`,
          },
        })
      );
    } catch (e) {
      this.logger.error('Token validation has been failed.', {
        e,
      });

      throw new InvalidTokenException();
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
      throw new Error('Twitch user is not found.');
    }

    const [user] = data;
    return user;
  }
}
