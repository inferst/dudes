import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class TwitchUserFilterService {
  private bot: Set<string> = new Set();

  public constructor() {
    const file = readFileSync('apps/backend-api/public/bot.txt');
    for (const bot in file.toString().split('\n')) {
      this.bot.add(bot);
    }
  }

  public isBot(nick: string): boolean {
    return this.bot.has(nick);
  }
}
