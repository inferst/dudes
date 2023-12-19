import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { Auth } from '@app/backend-api/auth/decorators';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { User } from '@dudes/shared';

@Controller('/user')
export class UserController {
  @Get('/')
  @UseGuards(AuthGuard)
  public getUser(@Auth() user: AuthUserProps): User {
    return user;
  }

  @Get('/test-db')
  public async test() {}
}
