import { PassportStrategy } from '@nestjs/passport';
import Oauth2Strategy from 'passport-oauth2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@app/backend-api/config/config.service';
import {
  AuthService,
  AuthUserProps,
} from '@app/backend-api/auth/services/auth.service';

const SCOPE = [
  'channel:read:subscriptions',
  'moderator:read:chatters',
  'channel:manage:redemptions',
];

@Injectable()
export class TwitchStrategy extends PassportStrategy(Oauth2Strategy, 'twitch') {
  public constructor(
    configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.twitchClientId,
      clientSecret: configService.twitchClientSecret,
      callbackURL: configService.twitchCallbackUrl,
      scope: SCOPE,
      authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      store: true,
    });
  }

  public validate(
    accessToken: string,
    refreshToken: string
  ): Promise<AuthUserProps> {
    return this.authService.validate(accessToken, refreshToken);
  }
}
