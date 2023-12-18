import { Controller, Get, UseGuards, Response, Request } from '@nestjs/common';
import { TwitchAuthGuard } from '@app/backend-api/auth/guards/twitch-auth.guard';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { AuthService } from '@app/backend-api/auth/services';

@Controller()
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

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

  @Get('/logout')
  public async handleLogout(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse
  ): Promise<void> {
    const user = req.user as { accessToken?: string } | undefined;

    if (user?.accessToken) {
      await this.authService.logout(user.accessToken);
      req.session.destroy(() => {
        // TODO: log the error.
      });
    }

    res.redirect('http://localhost:4200/login');
  }
}
