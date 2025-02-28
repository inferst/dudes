import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Skin } from '@repo/database';

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
