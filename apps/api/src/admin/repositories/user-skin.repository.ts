import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, UserSkin } from '@repo/database';

@Injectable()
export class UserSkinRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async upsert(
    userId: number,
    id: number,
    data: Prisma.UserSkinCreateInput,
  ): Promise<UserSkin> {
    return this.prismaService.userSkin.upsert({
      create: data,
      update: data,
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
  }

  public async getUserSkins(userId: number): Promise<UserSkin[]> {
    return await this.prismaService.userSkin.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}
