import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/meta')
  public getMeta(): void {}
}
