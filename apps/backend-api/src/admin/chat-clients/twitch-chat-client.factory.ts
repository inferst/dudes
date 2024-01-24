import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { ChatterEntity, MessageEntity } from '@shared';
import * as tmi from 'tmi.js';
import {
  TokenRevokedException,
  TwitchApiClientFactory,
} from '../api-clients/twitch-api-client';
import { ChatClient } from './chat-client-factory';
import { TwitchUserFilterService } from './twitch-user-filter.service';
import { ChatMessageService } from '../services';

const TWITCH_CHATTERS_SEND_INTERVAL = 20 * 1000; // 1 minute.

@Injectable()
export class TwitchChatClientFactory {
  private readonly logger = new Logger(TwitchChatClientFactory.name);

  public constructor(
    private readonly twitchApiClientFactory: TwitchApiClientFactory,
    private readonly twitchUserFilterService: TwitchUserFilterService,
    private readonly chasMessageService: ChatMessageService
  ) {}

  public async createFromUser(user: User): Promise<ChatClient> {
    const tmiClient = new tmi.Client({
      channels: [user.twitchLogin],
    });

    const twitchApiClient = await this.twitchApiClientFactory.createFromUserId(
      user.id
    );

    let timerId: NodeJS.Timer;

    const onChat = (listener: (data: MessageEntity) => void): void => {
      tmiClient.on(
        'chat',
        async (_channel, tags: tmi.CommonUserstate, message) => {
          const name = tags['display-name'];
          const userId = tags['user-id'];

          if (!name || !userId) {
            this.logger.error('Name or user id are empty', { tags });
            return;
          }

          const emotes = tags.emotes ?? {};

          const emoteNames = Object.entries(emotes).map((entity) => {
            const range = entity[1][0].split('-');
            const start = Number(range[0]);
            const end = Number(range[1]) + 1;

            return message.substring(start, end);
          });

          const emoteIds = Object.entries(emotes).map((entity) => entity[0]);

          listener({
            name: name,
            userId: userId,
            emotes: emoteIds.map((emote) => this.getTwitchEmoteUrl(emote)),
            message: this.chasMessageService.stripEmotes(message, emoteNames),
            data: {
              color: tags['color'],
            },
          });
        }
      );
    };

    const onChatters = (listener: (data: ChatterEntity[]) => void): void => {
      timerId = setInterval(async () => {
        try {
          const chatters = await twitchApiClient.getChatters(user.twitchId);

          const users = chatters
            .filter(
              (chatter) =>
                !this.twitchUserFilterService.isBot(chatter.user_login)
            )
            .map((chatter) => ({
              userId: chatter.user_id,
              name: chatter.user_name,
            }));

          listener(users);
        } catch (error) {
          if (error instanceof TokenRevokedException) {
            // Token is revoked, do nothing.
            return;
          }

          this.logger.error('Failed to send chatters.', {
            e: error,
          });
        }
      }, TWITCH_CHATTERS_SEND_INTERVAL);
    };

    return {
      connect: async (): Promise<void> => {
        await tmiClient.connect();
      },
      disconnect: async (): Promise<void> => {
        await tmiClient.disconnect();
        clearInterval(timerId);
      },
      onChat,
      onChatters,
    };
  }

  private getTwitchEmoteUrl(emote: string): string {
    return `https://static-cdn.jtvnw.net/emoticons/v2/${emote}/static/light/3.0`;
  }
}
