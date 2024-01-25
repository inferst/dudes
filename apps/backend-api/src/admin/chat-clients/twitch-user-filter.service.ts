import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class TwitchUserFilterService {
  private bot: Set<string> = new Set();

  public constructor() {
    const file = readFileSync('apps/backend-api/public/bots.json');
    const json = JSON.parse(file.toString());

    for (const bot of json['bots']) {
      this.bot.add(bot[0]);
    }
  }

  public isBot(nick: string): boolean {
    return this.bot.has(nick);
  }
}
