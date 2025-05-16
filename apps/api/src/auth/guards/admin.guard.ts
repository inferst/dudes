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
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

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
      this.logger.error('Failed to check admin status.', e.toString());
      return false;
    }
  }
}
