import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@app/backend-api/database/prisma.service';

export type User = Required<Prisma.UserUncheckedCreateInput>;

@Injectable()
export class UserRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getByTwitchIdOrCreate(
    data: Prisma.UserCreateInput
  ): Promise<User> {
    return this.prismaService.user.upsert({
      where: {
        twitchId: data.twitchId,
      },
      update: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
      create: data,
    });
  }
}
