import { HttpException } from '@nestjs/common';
import { HttpStatusCodeError } from '@twurple/api-call';

export class TwitchHttpException extends HttpException {
  constructor(error: unknown) {
    if (error instanceof HttpStatusCodeError) {
      const body = JSON.parse(error.body);
      super(body['message'], error.statusCode);
    } else if (error instanceof Error) {
      super(error.message, 500);
    }
  }
}
