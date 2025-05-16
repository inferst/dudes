import { TwitchAuthGuard } from '@/auth/guards/twitch-auth.guard';
import { AuthService } from '@/auth/services';
import { ConfigService } from '@/config/config.service';
import {
  Controller,
  Get,
  Logger,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { AuthUserProps } from '../services/auth.service';
import { UserTokenRepository } from '../repositories/user-token.repository';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  public constructor(
    private readonly authService: AuthService,
    private readonly userTokenRepository: UserTokenRepository,
    private readonly configService: ConfigService,
  ) {}

  @Get('/login')
  @UseGuards(TwitchAuthGuard)
  public handleLogin(): { msg: string } {
    return { msg: 'Redirecting...' };
  }

  @Get('/callback')
  @UseGuards(TwitchAuthGuard)
  public handleRedirect(
    @Response({ passthrough: true }) res: ExpressResponse,
  ): void {
    res.redirect(this.configService.adminUrl);
  }

  @Get('/logout')
  public async handleLogout(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<void> {
    const user = req.user as AuthUserProps | undefined;

    if (user) {
      const userToken = await this.userTokenRepository.findByUserId(
        user.userId,
      );

      if (userToken) {
        await this.authService.logout(userToken.accessToken);
      }

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
