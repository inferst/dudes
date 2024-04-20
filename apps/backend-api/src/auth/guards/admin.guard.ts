import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthUserProps } from '../services/auth.service';
import { PrismaService } from '@app/backend-api/database/prisma.service';
import { TWITCH_PLATFORM_ID } from '@app/backend-api/constants';

type Request = {
  user?: AuthUserProps;
};

@Injectable()
export class AdminGuard implements CanActivate {
  // We are using prisma service directly to avoid repo import cycles.
  public constructor(private readonly prismaService: PrismaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // TODO: refactor admin guard (remove hardcode)
    if (!request.user || request.user.userId != 1) {
      return false;
    }

    try {
      const platformUserId = request.user.platformUserId;
      const { isTokenRevoked } = await this.prismaService.userToken.findUniqueOrThrow({
        where: {
          platformUserId_platformId: {
            platformUserId: platformUserId,
            platformId: TWITCH_PLATFORM_ID,
          }
        },
      });

      return !isTokenRevoked;
    } catch (e) {
      return false;
    }
  }
}
