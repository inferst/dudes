import { Inject, Injectable } from '@nestjs/common';
import { UserToken } from '@prisma/client';
import {
  ChatterEntity,
  MessageEntity,
  RaidData,
  RewardRedemptionData,
} from '@libs/types';
import { TwitchClientFactory } from '../twitch/twitch-client.factory';

export type EventClient = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  onChatMessage: (listener: (data: MessageEntity) => void) => void;
  onChatters: (listener: (data: ChatterEntity[]) => void) => void;
  onRaid: (listener: (data: RaidData) => void) => void;
  onRewardRedemptionAdd: (
    listener: (data: RewardRedemptionData) => void
  ) => void;
};

@Injectable()
export class EventClientFactory {
  public constructor(
    @Inject('TWITCH_CLIENT_FACTORY')
    private readonly twitchClientFactory: TwitchClientFactory
  ) {}

  // TODO: create YoutubeEventClientFactory
  public async createFromUser(user: UserToken): Promise<EventClient> {
    await this.twitchClientFactory.addUserToken(user.userId, ['chat']);
    return this.twitchClientFactory.createEventClient(user);
  }
}
