import { Controller, Get, UseGuards, Response } from '@nestjs/common';
import { TwitchAuthGuard } from '@app/backend-api/auth/guards/twitch-auth.guard';
import { Response as ExpressResponse } from 'express';

@Controller()
export class AuthController {
  @Get('/login')
  @UseGuards(TwitchAuthGuard)
  public handleLogin(): { msg: string } {
    return { msg: 'Redirecting...' };
  }

  @Get('/callback')
  @UseGuards(TwitchAuthGuard)
  public handleRedirect(
    @Response({ passthrough: true }) res: ExpressResponse
  ): void {
    // TODO: get rid of hardcoded url.
    res.redirect('http://localhost:4200');
  }
}
