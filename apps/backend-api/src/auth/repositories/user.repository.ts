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
    const user = await this.prismaService.user.findFirst({
      where: {
        twitchId: data.twitchId,
      },
    });

    if (user) {
      return user;
    }

    return this.prismaService.user.create({ data });
  }
}
