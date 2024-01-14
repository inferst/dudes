import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@app/backend-api/database/prisma.service';

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
        twitchLogin: data.twitchLogin,
        tokenRevoked: data.tokenRevoked,
      },
      create: data,
    });
  }
}
