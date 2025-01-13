import { PrismaService } from '@app/backend-api/database/prisma.service';
import { UserSkinEntity } from '@lib/types';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserSkinRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getUserSkinsByUserId(
    userId: number,
    collectionId: number
  ): Promise<UserSkinEntity[]> {
    const skins = await this.prismaService.skin.findMany({
      where: {
        collectionId: collectionId,
      },
    });

    const skinIds = skins.map((skin) => skin.id);

    const userSkins = await this.prismaService.userSkin.findMany({
      where: {
        user: {
          id: userId,
        },
        skin: {
          id: {
            in: skinIds,
          },
        },
      },
    });

    const data = skins.map((skin) => {
      const userSkin = userSkins.find((userSkin) => userSkin.skinId == skin.id);

      return {
        ...skin,
        isActive: userSkin ? userSkin.isActive : false,
      };
    });

    return data;
  }

  public async update(
    userId: number,
    skinId: number,
    isActive: boolean
  ): Promise<UserSkinEntity> {
    const skin = await this.prismaService.skin.findFirst({
      where: {
        id: skinId,
      },
    });

    if (skin) {
      const userSkin = await this.prismaService.userSkin.upsert({
        create: {
          skinId,
          userId,
          isActive,
        },
        update: {
          isActive,
        },
        where: {
          skinId_userId: {
            skinId,
            userId,
          },
        },
      });

      return {
        ...userSkin,
        name: skin.name,
      };
    }

    throw new NotFoundException();
  }
}
