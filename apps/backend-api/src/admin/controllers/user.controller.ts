import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { Auth } from '@app/backend-api/auth/decorators';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { User } from '@dudes/shared';
import { ConfigService } from '@app/backend-api/config/config.service';

@Controller('/user')
export class UserController {
  public constructor(private readonly configService: ConfigService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  public getUser(@Auth() user: AuthUserProps): User {
    return {
      ...user,
      personalUrl: `${this.configService.appUrl}/${user.guid}`,
    };
  }
}
