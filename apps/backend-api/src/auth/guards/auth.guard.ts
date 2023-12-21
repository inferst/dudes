import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthUserProps } from '../services/auth.service';

type Request = {
  user?: AuthUserProps;
}

@Injectable()
export class AuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    return !!request.user;
  }
}
