import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthUserProps } from '../services/auth.service';
import { PrismaService } from '@app/backend-api/database/prisma.service';

type Request = {
  user?: AuthUserProps;
};

@Injectable()
export class AuthGuard implements CanActivate {
  // We are using prisma service directly to avoid repo import cycles.
  public constructor(private readonly prismaService: PrismaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return false;
    }

    try {
      const userId = request.user.userId;
      const { tokenRevoked } = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      return !tokenRevoked;
    } catch (e) {
      return false;
    }
  }
}
