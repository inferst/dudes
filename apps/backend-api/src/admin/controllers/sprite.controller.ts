import { ConfigService } from '@app/backend-api/config/config.service';
import { PrismaService } from '@app/backend-api/database/prisma.service';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { JsonObject } from '@prisma/client/runtime/library';
import { existsSync, readFileSync } from 'fs';
import { z } from 'zod';
import { UserRepository } from '../repositories';

type SpriteDto = {
  guid: string;
  sprite: string;
};

export const spriteDtoSchema = z
  .object({
    guid: z.string().min(1).max(255),
    sprite: z.string().min(1).max(255),
  })
  .strict();

export type SpriteEntity = {
  data: JsonObject;
  image: string;
  sprite: JsonObject;
};

@Controller('/sprite')
export class SpriteController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly prismaService: PrismaService
  ) {}

  @Post()
  public async getSprite(
    @Body(new ZodPipe(spriteDtoSchema)) body: SpriteDto
  ): Promise<JsonObject> {
    const user = await this.userRepository.getUserByGuid(body.guid);

    if (!user) {
      throw new BadRequestException();
    }

    const data = await this.prismaService.skin.findFirst({
      where: {
        name: body.sprite,
        collection: {
          userSkinCollection: {
            some: {
              userId: user.id,
              isActive: true,
            },
          },
        },
        userSkin: {
          some: {
            userId: user.id,
            isActive: true,
          },
        },
      },
      select: {
        name: true,
        collection: true,
      },
    });

    if (data) {
      return this.prepareSprite(data.collection.name, data.name);
    } else {
      const data = await this.prismaService.userSkin.findFirst({
        where: {
          userId: user.id,
          isDefault: true,
          skin: {
            collection: {
              userSkinCollection: {
                some: {
                  userId: user.id,
                  isActive: true,
                  isDefault: true,
                },
              },
            },
          },
        },
        select: {
          skin: {
            include: {
              collection: true,
            },
          },
        },
      });

      if (data) {
        return this.prepareSprite(data.skin.collection.name, data.skin.name);
      }
    }

    throw new NotFoundException();
  }

  private prepareSprite(collectionName: string, skinName: string): JsonObject {
    const src = `static/skins/${collectionName}/`;
    const spriteName = skinName;

    const spriteSrc = src + spriteName + '/sprite.json';
    const dataSrc = src + spriteName + '/data.json';

    if (!existsSync(spriteSrc) || !existsSync(dataSrc)) {
      throw new NotFoundException();
    }

    const path =
      this.configService.clientUrl + `/${collectionName}/` + spriteName;

    const sprite = JSON.parse(readFileSync(spriteSrc).toString());
    const data = JSON.parse(readFileSync(dataSrc).toString());

    return {
      data: data,
      image: path + '/sprite.png',
      sprite: sprite,
    };
  }
}
