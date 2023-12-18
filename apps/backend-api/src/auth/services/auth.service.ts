import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/backend-api/auth/repositories/user.repository';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from './config.service';

export type AuthUserProps = {
  name: string;
  picture: string;
  accessToken: string;
  twitchId: string;
  userId: number;
};

type WithData<T> = {
  data: T;
};

type TwitchUser = {
  id: string;
  display_name: string;
  profile_image_url: string;
};

@Injectable()
export class AuthService {
  public constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository
  ) {}

  public async validate(
    accessToken: string,
    refreshToken: string
  ): Promise<AuthUserProps> {
    const result = await this.getTwitchUserInfo(accessToken);

    const { id, display_name: name, profile_image_url: picture } = result;
    const { twitchId, id: userId } =
      await this.userRepository.getByTwitchIdOrCreate({
        twitchId: id,
        accessToken,
        refreshToken,
      });

    return {
      userId,
      twitchId,
      picture,
      accessToken,
      name,
    };
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
