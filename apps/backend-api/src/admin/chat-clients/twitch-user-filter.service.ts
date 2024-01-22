import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class TwitchUserFilterService {
  private bot: string[] = [];

  public constructor() {
    const file = readFileSync('apps/backend-api/public/bot.txt');
    this.bot = file.toString().split('\n');
  }

  public isBot(nick: string): boolean {
    return this.bot.includes(nick);
  }
}
