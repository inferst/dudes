import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { AuthUserProps } from '@/auth/services/auth.service';

export const factory = (_: unknown, ctx: ExecutionContext): AuthUserProps => {
  const request = ctx.switchToHttp().getRequest();

  if (!request?.user) {
    throw new RuntimeException(
      'User object is not found in the request. Possibly you forgot to add Auth guard',
    );
  }

  return request.user;
};

export const Auth = createParamDecorator(factory);
