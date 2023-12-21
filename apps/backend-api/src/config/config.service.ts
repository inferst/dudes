import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

type Config = {
  ORIGIN: string;
  SESSION_SECRET: string;
  TWITCH_CLIENT_ID: string;
  TWITCH_CLIENT_SECRET: string;
  TWITCH_CALLBACK_URL: string;
  DATABASE_URL: string;
};

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService<Config, true>) {}

  get appUrl(): string {
    return this.configService.get('ORIGIN');
  }

  get sessionSecret(): string {
    return this.configService.get('SESSION_SECRET');
  }

  get twitchClientId(): string {
    return this.configService.get('TWITCH_CLIENT_ID');
  }

  get twitchClientSecret(): string {
    return this.configService.get('TWITCH_CLIENT_SECRET');
  }

  get twitchCallbackUrl(): string {
    return this.configService.get('TWITCH_CALLBACK_URL');
  }
}
