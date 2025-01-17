import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { SkinCollection } from '@prisma/client';

@Injectable()
export class SkinCollectionRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getSkinCollections(): Promise<SkinCollection[]> {
    return this.prismaService.skinCollection.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}
