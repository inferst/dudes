import { TwitchHttpException } from '@app/backend-api/auth/exceptions/twitch-http.exception';
import { AxiosInstance, isAxiosError } from 'axios';

// TODO: move types to separate file

export type TwitchChatter = {
  user_id: string;
  user_login: string;
  user_name: string;
};

export type TwitchCustomReward = {
  id: string;
  title: string;
  cost: number;
  is_enabled: boolean;
};

export type UpdateTwitchCustomReward = Partial<Omit<TwitchCustomReward, 'id'>>;

export type CreateTwitchCustomReward = Omit<TwitchCustomReward, 'id'>;

type PaginatedData<T> = {
  data: T;
};

export class TwitchApiClient {
  public constructor(private readonly client: AxiosInstance) {}

  private processErrorResponse(error: Error): void {
    if (isAxiosError(error)) {
      const response = error.response;

      if (response) {
        throw new TwitchHttpException(
          response.data['message'],
          response.status
        );
      }
    }
  }

  public async getChatters(broadcasterId: string): Promise<TwitchChatter[]> {
    try {
      const {
        data: { data },
      } = await this.client.get<PaginatedData<TwitchChatter[]>>(
        '/chat/chatters',
        {
          params: {
            // TODO: aggregate all element in memory in the future.
            first: 1000,
            broadcaster_id: broadcasterId,
            moderator_id: broadcasterId,
          },
        }
      );

      return data;
    } catch (err) {
      this.processErrorResponse(err);
      throw err;
    }
  }

  public async getCustomRewards(
    broadcasterId: string
  ): Promise<TwitchCustomReward[]> {
    try {
      const {
        data: { data },
      } = await this.client.get<PaginatedData<TwitchCustomReward[]>>(
        '/channel_points/custom_rewards',
        {
          params: {
            broadcaster_id: broadcasterId,
            only_manageable_rewards: true,
          },
        }
      );

      return data;
    } catch (err) {
      this.processErrorResponse(err);
      throw err;
    }
  }

  public async updateCustomReward(
    broadcasterId: string,
    rewardId: string,
    reward: UpdateTwitchCustomReward
  ): Promise<TwitchCustomReward> {
    try {
      const {
        data: { data },
      } = await this.client.patch<PaginatedData<TwitchCustomReward[]>>(
        '/channel_points/custom_rewards',
        {
          ...reward,
        },
        {
          params: {
            broadcaster_id: broadcasterId,
            id: rewardId,
          },
        }
      );

      return data[0];
    } catch (err) {
      this.processErrorResponse(err);
      throw err;
    }
  }

  public async createCustomReward(
    broadcasterId: string,
    reward: CreateTwitchCustomReward
  ): Promise<TwitchCustomReward> {
    try {
      const {
        data: { data },
      } = await this.client.post<PaginatedData<TwitchCustomReward[]>>(
        '/channel_points/custom_rewards',
        {
          ...reward,
        },
        {
          params: {
            broadcaster_id: broadcasterId,
          },
        }
      );

      return data[0];
    } catch (err) {
      this.processErrorResponse(err);
      throw err;
    }
  }

  public async deleteCustomReward(
    broadcasterId: string,
    rewardId: string
  ): Promise<void> {
    try {
      const {
        data: { data },
      } = await this.client.delete<PaginatedData<void>>(
        '/channel_points/custom_rewards',
        {
          params: {
            broadcaster_id: broadcasterId,
            id: rewardId,
          },
        }
      );

      return data;
    } catch (err) {
      this.processErrorResponse(err);
      throw err;
    }
  }
}
