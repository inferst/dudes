import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Skin } from '@prisma/client';

@Injectable()
export class SkinRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getSkins(): Promise<Skin[]> {
    return this.prismaService.skin.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}
