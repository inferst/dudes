import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { TwitchHttpException } from '../exceptions/twitch-http.exception';

@Catch(TwitchHttpException)
export class TwitchHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      message: exception.message,
      statusCode: status,
      type: 'twitch',
    });
  }
}
