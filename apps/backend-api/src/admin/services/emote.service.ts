import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export type EmoteData = {
  [name: string]: string;
};

@Injectable()
export class EmoteService {
  constructor(private readonly httpService: HttpService) {}

  public async getEmotes(platformUserId: string): Promise<EmoteData> {
    const url = `https://7tv.io/v3/users/twitch/${platformUserId}`;
    const { data } = await firstValueFrom(this.httpService.get(url));

    const emoteEntries = data['emote_set']['emotes'].map((emote: any) => {
      const host = emote['data']['host'];
      const url =
        host['url'] + (emote['data']['animated'] ? '/4x.gif' : '/4x.png');
      return [emote['name'], url];
    });

    return Object.fromEntries(emoteEntries);
  }
}
