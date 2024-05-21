import { ConfigService } from '@app/backend-api/config/config.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export type EmoteData = {
  [name: string]: string;
};

@Injectable()
export class EmoteService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  public async getEmotes(platformUserId: string): Promise<EmoteData> {
    const hostUrl = this.configService.hostUrl;
    const userUrl = `https://7tv.io/v3/users/twitch/${platformUserId}`;
    const globalUrl = 'https://7tv.io/v3/emote-sets/global';

    const [userData, globalData] = await Promise.all<any>([
      firstValueFrom(this.httpService.get(userUrl)),
      firstValueFrom(this.httpService.get(globalUrl)),
    ]);

    const emotes = [
      ...userData['data']['emote_set']['emotes'],
      ...globalData['data']['emotes'],
    ];

    const emoteEntries = emotes.map((emote: any) => {
      const host = emote['data']['host'];
      const url =
        host['url'] + (emote['data']['animated'] ? '/4x.gif' : '/4x.png');
      return [
        emote['name'],
        url.replace('//cdn.7tv.app', hostUrl + '/7tv-emotes'),
      ];
    });

    return Object.fromEntries(emoteEntries);
  }
}
