import { PassportStrategy } from '@nestjs/passport';
import Oauth2Strategy from 'passport-oauth2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { AuthService, AuthUserProps } from '@/auth/services/auth.service';
import { TWITCH_SCOPE } from '@/constants';

@Injectable()
export class TwitchStrategy extends PassportStrategy(Oauth2Strategy, 'twitch') {
  public constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.twitchClientId,
      clientSecret: configService.twitchClientSecret,
      callbackURL: configService.twitchCallbackUrl,
      scope: TWITCH_SCOPE,
      authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      // store: true,
    });
  }

  public validate(
    accessToken: string,
    refreshToken: string,
  ): Promise<AuthUserProps> {
    return this.authService.validate(accessToken, refreshToken);
  }
}
