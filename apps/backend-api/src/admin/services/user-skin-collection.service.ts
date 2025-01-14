import { PrismaService } from '@app/backend-api/database/prisma.service';
import { UserSkinCollectionEntity } from '@lib/types';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UserSkinCollectionService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getUserSkinCollectionsByUserId(
    userId: number
  ): Promise<UserSkinCollectionEntity[]> {
    const collections = await this.prismaService.skinCollection.findMany();

    const collectionIds = collections.map((collection) => collection.id);

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
        (userSkinCollection) =>
          userSkinCollection.skinCollectionId == collection.id
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
      const activeOrCurrent =
        await this.prismaService.userSkinCollection.findMany({
          where: {
            userId,
            OR: [
              { skinCollectionId: collectionId, isActive: true },
              { isActive: true },
            ],
          },
        });

      if (!isActive && activeOrCurrent.length == 1) {
        throw new BadRequestException('Must be at least one active collection');
      }

      console.log(activeOrCurrent);

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
