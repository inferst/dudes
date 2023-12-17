import { Controller, Get, UseGuards } from '@nestjs/common';
import { TwitchAuthGuard } from '@app/backend-api/auth/guards/twitch-auth.guard';

type Result = {
  msg: string;
};

@Controller()
export class AuthController {
  @Get('/login')
  @UseGuards(TwitchAuthGuard)
  public handleLogin(): Result {
    return { msg: 'Redirect.' };
  }

  @Get('/callback')
  @UseGuards(TwitchAuthGuard)
  handleRedirect(): Result {
    return { msg: 'OK.' };
  }
}
