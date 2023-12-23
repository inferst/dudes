import { AxiosInstance } from 'axios';

export type Chatter = {
  user_id: string;
  user_login: string;
  user_name: string;
};

type PaginatedData<T> = {
  data: T;
};

export class TwitchApiClient {
  public constructor(private readonly client: AxiosInstance) {}

  public async getChatters(broadcasterId: string): Promise<Chatter[]> {
    const {
      data: { data },
    } = await this.client.get<PaginatedData<Chatter[]>>('/chat/chatters', {
      params: {
        // TODO: aggregate all element in memory in the future.
        first: 1000,
        broadcaster_id: broadcasterId,
        moderator_id: broadcasterId,
      },
    });

    return data;
  }
}
