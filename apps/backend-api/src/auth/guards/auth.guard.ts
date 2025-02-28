import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthUserProps } from '../services/auth.service';
import { PrismaService } from '@/database/prisma.service';
import { TWITCH_PLATFORM_ID } from '@/constants';

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
      const platformUserId = request.user.platformUserId;
      const { isTokenRevoked } =
        await this.prismaService.userToken.findUniqueOrThrow({
          where: {
            platformUserId_platformId: {
              platformUserId: platformUserId,
              platformId: TWITCH_PLATFORM_ID,
            },
          },
        });

      return !isTokenRevoked;
    } catch (e) {
      return false;
    }
  }
}
