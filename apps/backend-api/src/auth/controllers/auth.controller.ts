import { TwitchAuthGuard } from '@app/backend-api/auth/guards/twitch-auth.guard';
import { AuthService } from '@app/backend-api/auth/services';
import { ConfigService } from '@app/backend-api/config/config.service';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import {
  Controller,
  Get,
  UseGuards,
  Response,
  Request,
  Logger,
} from '@nestjs/common';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  public constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

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
    res.redirect(this.configService.adminUrl);
  }

  @Get('/logout')
  public async handleLogout(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse
  ): Promise<void> {
    const user = req.user as { accessToken?: string } | undefined;

    if (user?.accessToken) {
      await this.authService.logout(user.accessToken);

      req.session.destroy((err) => {
        if (!err || Object.keys(err).length === 0) {
          // By some reason it returns an error with an empty object
          // but the session was actually destroyed.
          return;
        }

        this.logger.error('Failed to destroy the session.', {
          err,
        });
      });
    }

    res.clearCookie('connect.sid');
    res.redirect(`${this.configService.adminUrl}/login`);
  }
}
