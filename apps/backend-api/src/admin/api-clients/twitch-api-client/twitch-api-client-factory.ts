import { ConfigService } from '@app/backend-api/config/config.service';
import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '@app/backend-api/admin/repositories';
import { TwitchApiClient } from './twitch-api-client';
import { TokenRevokedException } from './token-revoked.exception';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import axios, { AxiosError } from 'axios';

type Token = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class TwitchApiClientFactory {
  private readonly logger = new Logger(TwitchApiClientFactory.name);

  public constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository
  ) {}

  public async createFromUserId(userId: number): Promise<TwitchApiClient> {
    const { accessToken } = await this.userRepository.getUserById(userId);

    const refreshAuth = async (failedRequest: AxiosError): Promise<void> => {
      try {
        const { refresh_token: refreshToken, access_token: accessToken } =
          await this.refreshAuth(userId);

        await this.userRepository.update(userId, {
          refreshToken,
          accessToken,
        });

        if (!failedRequest.response) {
          return Promise.reject('Response is missing.');
        }

        failedRequest.response.config.headers['Authorization'] =
          'Bearer ' + accessToken;

        this.logger.log(
          `Access token successfully updated for the user: ${userId}`
        );

        return Promise.resolve();
      } catch (e) {
        await this.userRepository.update(userId, {
          tokenRevoked: true,
        });

        this.logger.error('Failed to refresh token.', {
          e,
        });
        throw e;
      }
    };

    const client = axios.create({
      baseURL: 'https://api.twitch.tv/helix',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': this.configService.twitchClientId,
      },
    });

    client.interceptors.request.use(async (config) => {
      const { tokenRevoked } = await this.userRepository.getUserById(userId);

      if (tokenRevoked) {
        throw new TokenRevokedException();
      }

      return config;
    });

    // Instantiate the interceptor.
    createAuthRefreshInterceptor(client, refreshAuth, {
      pauseInstanceWhileRefreshing: true,
    });

    return new TwitchApiClient(client);
  }

  private async refreshAuth(userId: number): Promise<Token> {
    const { refreshToken } = await this.userRepository.getUserById(userId);

    const { data } = await axios.post<Token>(
      'https://id.twitch.tv/oauth2/token',
      `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${this.configService.twitchClientId}&client_secret=${this.configService.twitchClientSecret}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return data;
  }
}
