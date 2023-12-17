import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

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
