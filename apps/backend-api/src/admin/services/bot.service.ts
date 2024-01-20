import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class BotService {
  private bot: string[] = [];
  private goodBot: string[] = [];

  public constructor() {
    const botFile = readFileSync('apps/backend-api/public/bot.txt');
    this.bot = botFile.toString().split('\n');

    const goodBotFile = readFileSync('apps/backend-api/public/goodbot.txt');
    this.goodBot = goodBotFile.toString().split('\n');
  }

  public isBot(nick: string): boolean {
    return this.bot.includes(nick) || this.goodBot.includes(nick);
  }
}
