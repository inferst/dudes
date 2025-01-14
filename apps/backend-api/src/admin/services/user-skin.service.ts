import { PrismaService } from '@app/backend-api/database/prisma.service';
import { UpdateUserSkinDto, UserSkinEntity } from '@lib/types';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UserSkinService {
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
        isDefault: userSkin ? userSkin.isDefault : false,
      };
    });

    return data;
  }

  public async getActiveUserSkinByName(
    userId: number,
    name: string
  ): Promise<UserSkinEntity> {
    const skin = await this.prismaService.skin.findFirst({
      where: {
        name,
      },
    });

    if (skin) {
      const userSkin = await this.prismaService.userSkin.findFirst({
        where: {
          user: {
            id: userId,
          },
          skin: {
            id: skin.id,
          },
          isActive: true,
        },
      });

      return {
        ...skin,
        isActive: userSkin ? userSkin.isActive : false,
        isDefault: userSkin ? userSkin.isDefault : false,
      };
    }

    throw new NotFoundException();
  }

  public async update(
    userId: number,
    skinId: number,
    data: UpdateUserSkinDto
  ): Promise<UserSkinEntity> {
    const skin = await this.prismaService.skin.findFirst({
      where: {
        id: skinId,
      },
    });

    if (skin) {
      const create = {
        skinId,
        userId,
        isActive: data.isActive,
        isDefault: data.isDefault,
      };

      const update = {
        isActive: data.isActive,
        isDefault: data.isDefault,
      };

      if (data.isDefault) {
        await this.prismaService.$transaction([
          this.prismaService.userSkin.updateMany({
            where: {
              isDefault: true,
            },
            data: {
              isDefault: false,
            },
          }),
          this.prismaService.userSkin.upsert({
            where: {
              skinId_userId: {
                userId,
                skinId,
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
        const current = await this.prismaService.userSkin.findUnique({
          where: {
            skinId_userId: {
              userId,
              skinId,
            },
          },
        });

        if (
          current &&
          current.isDefault &&
          (data.isDefault === false || data.isActive === false)
        ) {
          throw new BadRequestException('Must be one default skin');
        }
      }

      const userSkin = await this.prismaService.userSkin.upsert({
        create: {
          ...create,
          isActive: false,
          isDefault: false,
        },
        update,
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
