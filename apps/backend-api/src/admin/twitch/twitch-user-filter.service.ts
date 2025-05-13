import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import path from 'path';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TwitchUserFilterService {
  private bot: Set<string> = new Set();

  public constructor(private readonly httpService: HttpService) {
    this.getAllBots();

    setInterval(
      () => {
        this.getAllBots();
      },
      1000 * 60 * 60 * 6,
    );
  }

  public isBot(nick: string): boolean {
    return this.bot.has(nick);
  }

  private async getAllBots(): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://api.twitchinsights.net/v1/bots/all'),
      );

      for (const bot of data['bots']) {
        this.bot.add(bot[0]);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      const file = readFileSync(
        path.resolve(__dirname, 'apps/backend-api/public/bots.json'),
      );

      const json = JSON.parse(file.toString());

      for (const bot of json['bots']) {
        this.bot.add(bot[0]);
      }
    }
  }
}
