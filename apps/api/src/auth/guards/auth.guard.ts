import { TWITCH_PLATFORM_ID } from '@/constants';
import { PrismaService } from '@/database/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthUserProps } from '../services/auth.service';

type Request = {
  user?: AuthUserProps;
};

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

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
      this.logger.error('Failed to find user token.', e.toString());
      return false;
    }
  }
}
