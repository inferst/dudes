import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { Auth } from '@app/backend-api/auth/decorators';

@Controller('/user')
export class UserController {
  @Get('/')
  @UseGuards(AuthGuard)
  public getUser(@Auth() user: unknown) {
    return user;
  }
}
