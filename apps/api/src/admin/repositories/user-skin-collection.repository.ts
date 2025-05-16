import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, UserSkinCollection } from '@repo/database';

@Injectable()
export class UserSkinCollectionRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async upsert(
    userId: number,
    id: number,
    data: Prisma.UserSkinCollectionCreateInput,
  ): Promise<UserSkinCollection> {
    return this.prismaService.userSkinCollection.upsert({
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

  public async getUserSkinCollections(
    userId: number,
  ): Promise<UserSkinCollection[]> {
    return await this.prismaService.userSkinCollection.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}
