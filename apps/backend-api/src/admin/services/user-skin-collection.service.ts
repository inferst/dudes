import { PrismaService } from '@app/backend-api/database/prisma.service';
import {
  UpdateUserSkinCollectionDto,
  UserSkinCollectionEntity,
} from '@lib/types';
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
        isDefault: userSkinCollection ? userSkinCollection.isDefault : false,
      };
    });

    return data;
  }

  public async update(
    userId: number,
    collectionId: number,
    data: UpdateUserSkinCollectionDto
  ): Promise<UserSkinCollectionEntity> {
    const collection = await this.prismaService.skinCollection.findFirst({
      where: {
        id: collectionId,
      },
    });

    if (collection) {
      const create = {
        skinCollectionId: collectionId,
        userId,
        isActive: data.isActive ?? false,
        isDefault: data.isDefault ?? false,
      };

      const update = {
        isActive: data.isActive,
        isDefault: data.isDefault,
      };

      if (data.isDefault) {
        await this.prismaService.$transaction([
          this.prismaService.userSkinCollection.updateMany({
            where: {
              userId,
              isDefault: true,
            },
            data: {
              isDefault: false,
            },
          }),
          this.prismaService.userSkinCollection.upsert({
            where: {
              skinCollectionId_userId: {
                userId,
                skinCollectionId: collectionId,
              },
            },
            create: {
              ...create,
              isActive: true,
            },
            update: {
              ...update,
              isActive: true,
            },
          }),
        ]);
      } else {
        const current = await this.prismaService.userSkinCollection.findUnique({
          where: {
            skinCollectionId_userId: {
              userId,
              skinCollectionId: collectionId,
            },
          },
        });

        if (
          current &&
          current.isDefault &&
          (data.isDefault === false || data.isActive === false)
        ) {
          throw new BadRequestException('Must be one default skin collection');
        }
      }

      const userSkinCollection =
        await this.prismaService.userSkinCollection.upsert({
          create,
          update,
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
