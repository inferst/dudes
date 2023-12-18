import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { Auth } from '@app/backend-api/auth/decorators';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';

@Controller('/user')
export class UserController {
  @Get('/')
  @UseGuards(AuthGuard)
  public getUser(@Auth() user: AuthUserProps) {
    return user;
  }

  @Get('/test-db')
  public async test() {}
}
