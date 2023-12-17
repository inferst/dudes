import { PassportStrategy } from '@nestjs/passport';
import Oauth2Strategy from 'passport-oauth2';
import { Injectable } from '@nestjs/common';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { ConfigService } from '@app/backend-api/auth/services';

const SCOPE = ['channel:read:subscriptions', 'moderator:read:chatters'];

@Injectable()
export class TwitchStrategy extends PassportStrategy(Oauth2Strategy, 'twitch') {
  public constructor(configService: ConfigService) {
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

  public validate(_accessToken: string, _refreshToken: string): AuthUserProps {
    // TODO: implement DB user insert.
    return {
      name: 'Alexander S',
    };
  }
}
