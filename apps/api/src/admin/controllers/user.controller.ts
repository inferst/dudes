import { Auth } from '@/auth/decorators';
import { AuthGuard } from '@/auth/guards';
import { AuthUserProps } from '@/auth/services/auth.service';
import { ConfigService } from '@/config/config.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserEntity } from '@repo/types';

@Controller('/user')
export class UserController {
  public constructor(private readonly configService: ConfigService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  public getUser(@Auth() user: AuthUserProps): UserEntity {
    return {
      ...user,
      previewUrl: `${this.configService.clientUrl}/${user.guid}`,
    };
  }
}
