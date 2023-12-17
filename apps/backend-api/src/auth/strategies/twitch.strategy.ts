import { PassportStrategy } from '@nestjs/passport';
import Oauth2Strategy from 'passport-oauth2';
import { Injectable } from '@nestjs/common';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';

// TODO: extract to .env.
const CLIENT_ID = 'lvit12o5wp2dtuysbjvikog7mf39jz';
const CLIENT_SECRET = '38r88n280n85fw16rfb4sohl8k2v4f';
const CALLBACK_URL = 'http://localhost:3000/auth/callback';
const SCOPE = ['channel:read:subscriptions', 'moderator:read:chatters'];

@Injectable()
export class TwitchStrategy extends PassportStrategy(Oauth2Strategy, 'twitch') {
  public constructor() {
    super({
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: SCOPE,
      authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      store: true,
    });
  }

  public validate(accessToken: string, refreshToken: string): AuthUserProps {
    console.log(accessToken, 'access-token');
    console.log(refreshToken, 'refresh-token');

    return {
      name: 'Alexander S',
    };
  }
}
