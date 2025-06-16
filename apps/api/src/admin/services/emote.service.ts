import { ConfigService } from '@/config/config.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { WebSocket } from 'ws';

type SevenTVEmoteData = {
  userId: string;
  emoteSetId: string;
  data: SevenTVEmotes;
};

type SevenTVEmotes = {
  [name: string]: string;
};

type Emote = {
  name: string;
  url: string;
};

type SevenTVTwitchUserData = {
  emote_set: {
    id: string;
    emotes: SevenTVEventEmote[];
  };
  user: {
    id: string;
  };
};

type SevenTVEventEmote = {
  name: string;
  data: {
    animated: boolean;
    host: {
      url: string;
    };
  };
};

type SevenTVEventPushedEmote = {
  value: SevenTVEventEmote;
};

type SevenTVEventPulledEmote = {
  old_value: {
    name: string;
  };
};

type SevenTVEmoteEvent = {
  d: {
    type: string;
    body: SevenTVEmoteSetUpdateBody | SevenTVUserUpdateEvent;
  };
};

type SevenTVEmoteSetUpdateBody = {
  pushed?: SevenTVEventPushedEmote[];
  pulled?: SevenTVEventPulledEmote[];
};

type SevenTVUserUpdateData = {
  key: 'emote_set_id';
  old_value: string;
  value: string;
};

type SevenTVUserUpdateEvent = {
  updated: {
    key: 'connections';
    value: SevenTVUserUpdateData[];
  }[];
};

type UserData = {
  data: SevenTVTwitchUserData;
};

type GlobalData = {
  data: {
    emotes: SevenTVEventEmote[];
  };
};

const isSevenTVEvent = (data: unknown): data is SevenTVEmoteEvent => {
  return (
    typeof data == 'object' &&
    data != null &&
    'd' in data &&
    typeof data.d == 'object' &&
    data.d != null &&
    'type' in data.d &&
    typeof data.d.type == 'string'
  );
};

export type EmoteClient = {
  getEmotes: (text: string) => Emote[];
  connect: () => void;
  disconnect: () => void;
};

@Injectable()
export class EmoteService {
  private readonly logger = new Logger(EmoteService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async createClient(platformUserId: string): Promise<EmoteClient> {
    const hostUrl = this.configService.hostUrl;

    let emotes: SevenTVEmotes = {};

    let connection: WebSocket | undefined;

    let isClosed = false;

    const connect = async (): Promise<WebSocket | undefined> => {
      let emotesData = await this.getEmotesData(platformUserId);

      if (!emotesData) {
        return;
      }

      emotes = emotesData.data;

      const ws = new WebSocket('wss://events.7tv.io/v3');

      const emoteSetId = emotesData.emoteSetId;

      const userUpdateSubscribe = {
        op: 35,
        d: {
          type: 'user.update',
          condition: {
            object_id: emotesData.userId,
          },
        },
      };

      ws.onopen = (): void => {
        ws.send(
          JSON.stringify({
            op: 35,
            d: {
              type: 'emote_set.update',
              condition: {
                object_id: emoteSetId,
              },
            },
          }),
        );

        ws.send(JSON.stringify(userUpdateSubscribe));

        ws.onmessage = async (event: unknown): Promise<void> => {
          try {
            const data = JSON.parse((event as object)['data']);

            if (isSevenTVEvent(data)) {
              if (data.d.type == 'user.update') {
                const body = data.d.body as SevenTVUserUpdateEvent;

                const event = body.updated
                  .find((event) => event.key == 'connections')
                  ?.value.find((value) => value.key == 'emote_set_id');

                if (event) {
                  ws.send(
                    JSON.stringify({
                      op: 36,
                      d: {
                        type: 'emote_set.update',
                        condition: {
                          object_id: event.old_value,
                        },
                      },
                    }),
                  );

                  ws.send(
                    JSON.stringify({
                      op: 35,
                      d: {
                        type: 'emote_set.update',
                        condition: {
                          object_id: event.value,
                        },
                      },
                    }),
                  );

                  emotesData = await this.getEmotesData(platformUserId);

                  if (emotesData) {
                    emotes = emotesData.data;
                  }
                }
              }

              if (data.d.type == 'emote_set.update') {
                const body = data.d.body as SevenTVEmoteSetUpdateBody;

                const pulled = body.pulled;
                const pushed = body.pushed;

                if (pulled) {
                  const data = pulled.map((emote) => emote.old_value.name);

                  for (const name of data) {
                    delete emotes[name];
                  }
                }

                if (pushed) {
                  const entries = pushed.map((emote) => {
                    const data = emote.value.data;
                    const url = data.animated
                      ? data.host.url + '/4x.gif'
                      : data.host.url + '/4x.png';

                    return [
                      emote.value.name,
                      url.replace('//cdn.7tv.app', hostUrl + '/7tv-emotes'),
                    ];
                  });

                  emotes = { ...emotes, ...Object.fromEntries(entries) };
                }
              }
            }
          } catch (e) {
            this.logger.error(
              'Failed to process 7TV Web socket message.',
              e.toString(),
            );
          }
        };

        this.logger.log(`ObjectId: [${emoteSetId}] 7TV Web socket connected`);
      };

      ws.onclose = async (): Promise<void> => {
        if (!isClosed) {
          setTimeout(async () => {
            connection = await connect();
          }, 10000);
        }

        this.logger.log(`ObjectId: [${emoteSetId}] 7TV Web socket closed`);
      };

      ws.onerror = (): void => {
        this.logger.log(`ObjectId: [${emoteSetId}] 7TV Web socket error`);
      };

      return ws;
    };

    return {
      getEmotes: (text: string): Emote[] => {
        const entries = text
          .split(' ')
          .filter((word) => emotes[word])
          .map((word) => ({ name: word, url: emotes[word] }));

        return entries;
      },
      connect: async (): Promise<void> => {
        connection = await connect();
      },
      disconnect: (): void => {
        connection?.close();
        isClosed = true;
      },
    };
  }

  public async getEmotesData(
    platformUserId: string,
  ): Promise<SevenTVEmoteData | undefined> {
    try {
      const hostUrl = this.configService.hostUrl;
      const userUrl = `https://7tv.io/v3/users/twitch/${platformUserId}?t=${Date.now()}`;
      const globalUrl = 'https://7tv.io/v3/emote-sets/global';

      const promises: [Promise<UserData>, Promise<GlobalData>] = [
        firstValueFrom(this.httpService.get(userUrl)),
        firstValueFrom(this.httpService.get(globalUrl)),
      ];

      const [userData, globalData] = await Promise.all(promises);

      const emotes = [
        ...userData.data.emote_set.emotes,
        ...globalData.data.emotes,
      ];

      const emoteEntries = emotes.map((emote) => {
        const host = emote.data.host;
        const url = host.url + (emote.data.animated ? '/4x.gif' : '/4x.png');
        return [
          emote.name,
          url.replace('//cdn.7tv.app', hostUrl + '/7tv-emotes'),
        ];
      });

      return {
        userId: userData.data.user.id,
        emoteSetId: userData.data.emote_set.id,
        data: Object.fromEntries(emoteEntries),
      };
    } catch (e) {
      this.logger.error('Failed to fetch the emotes data.', e.toString());
      return;
    }
  }
}
