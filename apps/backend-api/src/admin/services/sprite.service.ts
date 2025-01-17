import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpriteService {
  constructor(private readonly prismaService: PrismaService) {}

  public async isSpriteAvailable(
    userId: number,
    spriteName: string
  ): Promise<boolean> {
    const count = await this.prismaService.skin.count({
      where: {
        name: spriteName,
        collection: {
          userSkinCollection: {
            some: {
              isActive: true,
              userId,
            },
          },
        },
        userSkin: {
          some: {
            isActive: true,
            userId,
          },
        },
      },
    });

    return count > 0;
  }
}
