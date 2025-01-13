import { PrismaService } from '@app/backend-api/database/prisma.service';
import { UserSkinCollectionEntity } from '@lib/types';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserSkinCollectionRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getUserSkinCollectionsByUserId(
    userId: number
  ): Promise<UserSkinCollectionEntity[]> {
    const collections = await this.prismaService.skinCollection.findMany();

    const collectionIds = collections.map((skin) => skin.id);

    const userSkinCollections =
      await this.prismaService.userSkinCollection.findMany({
        where: {
          user: {
            id: userId,
          },
          skinCollection: {
            id: {
              in: collectionIds,
            },
          },
        },
      });

    const data = collections.map((collection) => {
      const userSkinCollection = userSkinCollections.find(
        (userSkinCollection) => userSkinCollection.id == collection.id
      );

      return {
        ...collection,
        isActive: userSkinCollection ? userSkinCollection.isActive : false,
      };
    });

    return data;
  }

  public async update(
    userId: number,
    collectionId: number,
    isActive: boolean
  ): Promise<UserSkinCollectionEntity> {
    const collection = await this.prismaService.skinCollection.findFirst({
      where: {
        id: collectionId,
      },
    });

    if (collection) {
      const userSkinCollection =
        await this.prismaService.userSkinCollection.upsert({
          create: {
            skinCollectionId: collectionId,
            userId,
            isActive,
          },
          update: {
            isActive,
          },
          where: {
            skinCollectionId_userId: {
              skinCollectionId: collectionId,
              userId,
            },
          },
        });

      return {
        ...userSkinCollection,
        name: collection.name,
      };
    }

    throw new NotFoundException();
  }
}
